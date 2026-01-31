"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const dtos_1 = require("../../application/dtos");
const use_cases_1 = require("../../application/use-cases");
let PaymentController = class PaymentController {
    constructor(createPaymentUseCase, updatePaymentUseCase, findPaymentByIdUseCase, findAllPaymentsUseCase) {
        this.createPaymentUseCase = createPaymentUseCase;
        this.updatePaymentUseCase = updatePaymentUseCase;
        this.findPaymentByIdUseCase = findPaymentByIdUseCase;
        this.findAllPaymentsUseCase = findAllPaymentsUseCase;
    }
    async create(dto) {
        return this.createPaymentUseCase.execute(dto);
    }
    async update(id, dto) {
        return this.updatePaymentUseCase.execute(id, dto);
    }
    async findById(id) {
        return this.findPaymentByIdUseCase.execute(id);
    }
    async findAll(filters) {
        return this.findAllPaymentsUseCase.execute(filters);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UpdatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findById", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.FilterPaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findAll", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('api/payment'),
    __metadata("design:paramtypes", [use_cases_1.CreatePaymentUseCase,
        use_cases_1.UpdatePaymentUseCase,
        use_cases_1.FindPaymentByIdUseCase,
        use_cases_1.FindAllPaymentsUseCase])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map