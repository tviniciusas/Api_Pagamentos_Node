import { Payment } from '../../../src/domain/entities/payment.entity';
import { PaymentMethod, PaymentStatus } from '../../../src/domain/enums';

describe('Payment Entity', () => {
  const validPaymentProps = {
    cpf: '12345678901',
    description: 'Test payment',
    amount: 100.0,
    paymentMethod: PaymentMethod.PIX,
  };

  describe('constructor', () => {
    it('should create a payment with default status PENDING', () => {
      const payment = new Payment(validPaymentProps);

      expect(payment.cpf).toBe(validPaymentProps.cpf);
      expect(payment.description).toBe(validPaymentProps.description);
      expect(payment.amount).toBe(validPaymentProps.amount);
      expect(payment.paymentMethod).toBe(PaymentMethod.PIX);
      expect(payment.status).toBe(PaymentStatus.PENDING);
    });

    it('should create a payment with provided status', () => {
      const payment = new Payment({
        ...validPaymentProps,
        status: PaymentStatus.PAID,
      });

      expect(payment.status).toBe(PaymentStatus.PAID);
    });

    it('should create a payment with provided id', () => {
      const id = 'test-uuid';
      const payment = new Payment({
        ...validPaymentProps,
        id,
      });

      expect(payment.id).toBe(id);
    });
  });

  describe('markAsPaid', () => {
    it('should update status to PAID', () => {
      const payment = new Payment(validPaymentProps);

      payment.markAsPaid();

      expect(payment.status).toBe(PaymentStatus.PAID);
    });
  });

  describe('markAsFailed', () => {
    it('should update status to FAIL', () => {
      const payment = new Payment(validPaymentProps);

      payment.markAsFailed();

      expect(payment.status).toBe(PaymentStatus.FAIL);
    });
  });

  describe('updateStatus', () => {
    it('should update status to provided value', () => {
      const payment = new Payment(validPaymentProps);

      payment.updateStatus(PaymentStatus.PAID);

      expect(payment.status).toBe(PaymentStatus.PAID);
    });
  });

  describe('setExternalId', () => {
    it('should set external id', () => {
      const payment = new Payment(validPaymentProps);
      const externalId = 'external-123';

      payment.setExternalId(externalId);

      expect(payment.externalId).toBe(externalId);
    });
  });

  describe('isPix', () => {
    it('should return true for PIX payment', () => {
      const payment = new Payment(validPaymentProps);

      expect(payment.isPix()).toBe(true);
    });

    it('should return false for CREDIT_CARD payment', () => {
      const payment = new Payment({
        ...validPaymentProps,
        paymentMethod: PaymentMethod.CREDIT_CARD,
      });

      expect(payment.isPix()).toBe(false);
    });
  });

  describe('isCreditCard', () => {
    it('should return true for CREDIT_CARD payment', () => {
      const payment = new Payment({
        ...validPaymentProps,
        paymentMethod: PaymentMethod.CREDIT_CARD,
      });

      expect(payment.isCreditCard()).toBe(true);
    });

    it('should return false for PIX payment', () => {
      const payment = new Payment(validPaymentProps);

      expect(payment.isCreditCard()).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should return payment properties as object', () => {
      const payment = new Payment({
        ...validPaymentProps,
        id: 'test-id',
      });

      const json = payment.toJSON();

      expect(json.id).toBe('test-id');
      expect(json.cpf).toBe(validPaymentProps.cpf);
      expect(json.description).toBe(validPaymentProps.description);
      expect(json.amount).toBe(validPaymentProps.amount);
      expect(json.paymentMethod).toBe(PaymentMethod.PIX);
      expect(json.status).toBe(PaymentStatus.PENDING);
    });
  });
});
