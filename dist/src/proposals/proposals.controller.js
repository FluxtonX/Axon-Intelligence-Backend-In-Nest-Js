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
exports.ProposalsController = void 0;
const common_1 = require("@nestjs/common");
const proposals_service_1 = require("./proposals.service");
const create_proposal_dto_1 = require("./dto/create-proposal.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const swagger_1 = require("@nestjs/swagger");
let ProposalsController = class ProposalsController {
    proposalsService;
    constructor(proposalsService) {
        this.proposalsService = proposalsService;
    }
    create(user, createProposalDto) {
        return this.proposalsService.create(user.id, createProposalDto);
    }
    findMyProposals(user) {
        return this.proposalsService.findMyProposals(user.id);
    }
    findByProject(projectId, user) {
        return this.proposalsService.findByProject(projectId, user.id);
    }
    acceptProposal(id, user) {
        return this.proposalsService.acceptProposal(id, user.id);
    }
};
exports.ProposalsController = ProposalsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a proposal to a project' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_proposal_dto_1.CreateProposalDto]),
    __metadata("design:returntype", void 0)
], ProposalsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Freelancer views their submitted proposals' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProposalsController.prototype, "findMyProposals", null);
__decorate([
    (0, common_1.Get)('project/:projectId'),
    (0, swagger_1.ApiOperation)({ summary: 'Client views proposals for their project' }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProposalsController.prototype, "findByProject", null);
__decorate([
    (0, common_1.Patch)(':id/accept'),
    (0, swagger_1.ApiOperation)({ summary: 'Client accepts a proposal' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProposalsController.prototype, "acceptProposal", null);
exports.ProposalsController = ProposalsController = __decorate([
    (0, swagger_1.ApiTags)('proposals'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('proposals'),
    __metadata("design:paramtypes", [proposals_service_1.ProposalsService])
], ProposalsController);
//# sourceMappingURL=proposals.controller.js.map