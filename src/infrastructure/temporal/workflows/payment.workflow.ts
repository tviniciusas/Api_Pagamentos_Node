import {
  condition,
  defineQuery,
  defineSignal,
  proxyActivities,
  setHandler,
} from '@temporalio/workflow';
import { PaymentStatus } from '../../../domain/enums';
import type * as activities from '../activities/payment.activities';
import {
  MercadoPagoPreference,
  PaymentData,
  PaymentRecord,
  WebhookSignal,
  WorkflowResult,
} from '../types';

const { createPaymentRecord, createMercadoPagoPreference, updatePaymentStatus } =
  proxyActivities<typeof activities>({
    startToCloseTimeout: '30 seconds',
    retry: {
      maximumAttempts: 3,
      initialInterval: '1 second',
      maximumInterval: '30 seconds',
      backoffCoefficient: 2,
    },
  });

// Signal to receive webhook notifications
export const paymentWebhookSignal = defineSignal<[WebhookSignal]>('paymentWebhook');

// Query to get payment state during workflow execution
export const getPaymentStateQuery = defineQuery<{
  payment: PaymentRecord | null;
  preference: MercadoPagoPreference | null;
  status: 'initializing' | 'waiting_payment' | 'completed';
}>('getPaymentState');

export async function creditCardPaymentWorkflow(
  paymentData: PaymentData,
  timeoutMinutes: number = 30,
): Promise<WorkflowResult> {
  // Workflow state
  let payment: PaymentRecord | null = null;
  let preference: MercadoPagoPreference | null = null;
  let webhookReceived = false;
  let webhookAction: string | null = null;
  let workflowStatus: 'initializing' | 'waiting_payment' | 'completed' = 'initializing';

  // Set up query handler for getting current state
  setHandler(getPaymentStateQuery, () => ({
    payment,
    preference,
    status: workflowStatus,
  }));

  // Set up signal handler for webhook
  setHandler(paymentWebhookSignal, (signal: WebhookSignal) => {
    webhookReceived = true;
    webhookAction = signal.action;
  });

  // Step 1: Create payment record with PENDING status
  payment = await createPaymentRecord(paymentData);

  // Step 2: Create Mercado Pago preference
  preference = await createMercadoPagoPreference(payment);

  // Update workflow status - now waiting for payment
  workflowStatus = 'waiting_payment';

  // Step 3: Wait for webhook signal or timeout
  const timeoutMs = timeoutMinutes * 60 * 1000;
  const completed = await condition(() => webhookReceived, timeoutMs);

  // Step 4: Update payment status based on result
  let finalStatus: PaymentStatus;

  if (!completed) {
    // Timeout - mark as failed
    finalStatus = PaymentStatus.FAIL;
    await updatePaymentStatus(payment.id, finalStatus);
  } else {
    // Webhook received - map action to status
    finalStatus = mapWebhookActionToStatus(webhookAction);
    await updatePaymentStatus(payment.id, finalStatus);
  }

  // Update final state
  payment = { ...payment, status: finalStatus, externalId: preference.preferenceId };
  workflowStatus = 'completed';

  return {
    payment,
    preference,
  };
}

function mapWebhookActionToStatus(action: string | null): PaymentStatus {
  switch (action) {
    case 'payment.approved':
      return PaymentStatus.PAID;
    case 'payment.rejected':
    case 'payment.cancelled':
      return PaymentStatus.FAIL;
    default:
      return PaymentStatus.FAIL;
  }
}
