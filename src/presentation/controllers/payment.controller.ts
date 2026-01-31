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
  async create(@Body() dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    return this.createPaymentUseCase.execute(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentDto,
  ): Promise<PaymentResponseDto> {
    return this.updatePaymentUseCase.execute(id, dto);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PaymentResponseDto> {
    return this.findPaymentByIdUseCase.execute(id);
  }

  @Get()
  async findAll(@Query() filters: FilterPaymentDto): Promise<PaymentResponseDto[]> {
    return this.findAllPaymentsUseCase.execute(filters);
  }
}
