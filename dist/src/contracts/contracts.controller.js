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
exports.ContractsController = void 0;
const common_1 = require("@nestjs/common");
const contracts_service_1 = require("./contracts.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const swagger_1 = require("@nestjs/swagger");
let ContractsController = class ContractsController {
    contractsService;
    constructor(contractsService) {
        this.contractsService = contractsService;
    }
    getMyContracts(user) {
        return this.contractsService.getMyContracts(user.id);
    }
    createCheckout(proposalId, user) {
        return this.contractsService.createCheckout(proposalId, user.id);
    }
    completeContract(id, user) {
        return this.contractsService.completeContract(id, user.id);
    }
    fundContract(id, user) {
        return this.contractsService.fundContract(id, user.id);
    }
    submitWork(id, submissionDetails, user) {
        return this.contractsService.submitWork(id, user.id, submissionDetails);
    }
    disputeContract(id, user) {
        return this.contractsService.disputeContract(id, user.id);
    }
    async handleWebhook(signature, req) {
        if (!signature || !req.rawBody) {
            return { received: true };
        }
        await this.contractsService.handleStripeWebhook(signature, req.rawBody);
        return { received: true };
    }
};
exports.ContractsController = ContractsController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('contracts/me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user contracts' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "getMyContracts", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('contracts/:proposalId/checkout'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate Stripe Checkout URL' }),
    __param(0, (0, common_1.Param)('proposalId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "createCheckout", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('contracts/:id/complete'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a contract as completed' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "completeContract", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('contracts/:id/fund'),
    (0, swagger_1.ApiOperation)({ summary: 'Simulate funding a contract' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "fundContract", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('contracts/:id/submit'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit work for a contract' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('submissionDetails')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "submitWork", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('contracts/:id/dispute'),
    (0, swagger_1.ApiOperation)({ summary: 'Dispute a contract' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ContractsController.prototype, "disputeContract", null);
__decorate([
    (0, common_1.Post)('payments/webhook'),
    (0, swagger_1.ApiOperation)({ summary: 'Stripe webhook endpoint' }),
    __param(0, (0, common_1.Headers)('stripe-signature')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ContractsController.prototype, "handleWebhook", null);
exports.ContractsController = ContractsController = __decorate([
    (0, swagger_1.ApiTags)('contracts'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [contracts_service_1.ContractsService])
], ContractsController);
//# sourceMappingURL=contracts.controller.js.map