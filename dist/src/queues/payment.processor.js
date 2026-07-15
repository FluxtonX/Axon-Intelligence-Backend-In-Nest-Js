"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
let PaymentProcessor = class PaymentProcessor extends bullmq_1.WorkerHost {
    async process(job) {
        console.log(`Processing payment job: ${job.name} for contract ${job.data.contractId}`);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log(`Successfully processed payment for contract ${job.data.contractId}`);
        return { success: true };
    }
};
exports.PaymentProcessor = PaymentProcessor;
exports.PaymentProcessor = PaymentProcessor = __decorate([
    (0, bullmq_1.Processor)('payment-queue')
], PaymentProcessor);
//# sourceMappingURL=payment.processor.js.map