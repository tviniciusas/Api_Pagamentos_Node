import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreatePaymentDto,
  FilterPaymentDto,
  PaymentResponseDto,
  UpdatePaymentDto,
} from '../../application/dtos';
import {
  CreatePaymentUseCase,
  FindAllPaymentsUseCase,
  FindPaymentByIdUseCase,
  UpdatePaymentUseCase,
} from '../../application/use-cases';

@ApiTags('Pagamentos')
@Controller('api/payment')
export class PaymentController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly updatePaymentUseCase: UpdatePaymentUseCase,
    private readonly findPaymentByIdUseCase: FindPaymentByIdUseCase,
    private readonly findAllPaymentsUseCase: FindAllPaymentsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar pagamento',
    description:
      'PIX cria o registro com status PENDING. CREDIT_CARD inicia um workflow no Temporal, cria a preferência no Mercado Pago e retorna o initPoint para o checkout.',
  })
  @ApiCreatedResponse({ type: PaymentResponseDto })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  async create(@Body() dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    return this.createPaymentUseCase.execute(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar status do pagamento' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: PaymentResponseDto })
  @ApiNotFoundResponse({ description: 'Pagamento não encontrado' })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.updatePaymentUseCase.execute(id, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pagamento por ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiOkResponse({ type: PaymentResponseDto })
  @ApiNotFoundResponse({ description: 'Pagamento não encontrado' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<PaymentResponseDto> {
    return this.findPaymentByIdUseCase.execute(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar pagamentos',
    description: 'Filtros opcionais por CPF e método.',
  })
  @ApiOkResponse({ type: PaymentResponseDto, isArray: true })
  async findAll(@Query() filters: FilterPaymentDto): Promise<PaymentResponseDto[]> {
    return this.findAllPaymentsUseCase.execute(filters);
  }
}
