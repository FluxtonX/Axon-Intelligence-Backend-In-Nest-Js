"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function main() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.error("No DATABASE_URL found in .env");
        process.exit(1);
    }
    const pool = new pg_1.Pool({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });
    const adapter = new adapter_pg_1.PrismaPg(pool);
    const prisma = new client_1.PrismaClient({ adapter });
    const users = await prisma.user.findMany();
    if (users.length === 0) {
        console.log("No users found. Please sign in first.");
        return;
    }
    for (const user of users) {
        const project = await prisma.project.create({
            data: {
                clientId: user.id,
                title: "Design an E-commerce App for " + user.email,
                description: "I need a full Figma design for an e-commerce platform.",
                budget: 500.0,
                status: "PUBLISHED",
            }
        });
        const proposal = await prisma.proposal.create({
            data: {
                projectId: project.id,
                freelancerId: user.id,
                bidAmount: 500.0,
                deliveryDays: 5,
                coverLetter: "I can do this design perfectly.",
                status: "ACCEPTED",
            }
        });
        const contract = await prisma.contract.create({
            data: {
                proposalId: proposal.id,
                projectId: project.id,
                clientId: user.id,
                freelancerId: user.id,
                amount: 500.0,
                status: "PENDING_PAYMENT",
            }
        });
        console.log(`✅ Seeded Contract for user ${user.email} (ID: ${user.id})`);
    }
    console.log("✅ Done seeding for all users.");
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(() => {
    process.exit(0);
});
//# sourceMappingURL=seed-contract.js.map