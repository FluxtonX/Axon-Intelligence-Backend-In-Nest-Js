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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const google_auth_library_1 = require("google-auth-library");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    emailService;
    googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    constructor(prisma, jwtService, emailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    async register(dto) {
        dto.email = dto.email.toLowerCase().trim();
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email }
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already in use');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                authProvider: 'LOCAL',
                profile: {
                    create: {
                        firstName: dto.firstName,
                        lastName: dto.lastName,
                    }
                }
            }
        });
        return this.generateTokens(user.id, user.email, user.role);
    }
    async login(dto) {
        dto.email = dto.email.toLowerCase().trim();
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email }
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.passwordHash) {
            throw new common_1.UnauthorizedException('Please login with your Google account');
        }
        const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.generateTokens(user.id, user.email, user.role);
    }
    async googleLogin(idToken) {
        try {
            const ticket = await this.googleClient.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID ? [process.env.GOOGLE_CLIENT_ID] : undefined,
            });
            const payload = ticket.getPayload();
            if (!payload)
                throw new common_1.UnauthorizedException('Invalid Google Token');
            const { sub: googleId, email, given_name, family_name } = payload;
            if (!email)
                throw new common_1.UnauthorizedException('No email found in Google profile');
            let user = await this.prisma.user.findFirst({
                where: {
                    OR: [
                        { googleId },
                        { email },
                    ]
                }
            });
            if (!user) {
                user = await this.prisma.user.create({
                    data: {
                        email,
                        googleId,
                        authProvider: 'GOOGLE',
                        profile: {
                            create: {
                                firstName: given_name || 'User',
                                lastName: family_name || '',
                            }
                        }
                    }
                });
            }
            else if (!user.googleId) {
                user = await this.prisma.user.update({
                    where: { id: user.id },
                    data: { googleId, authProvider: 'GOOGLE' }
                });
            }
            return this.generateTokens(user.id, user.email, user.role);
        }
        catch (e) {
            console.error("Google verify error", e);
            throw new common_1.UnauthorizedException('Failed to authenticate with Google');
        }
    }
    async forgotPassword(dto) {
        dto.email = dto.email.toLowerCase().trim();
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email }
        });
        if (!user) {
            return { message: 'If that email is in our system, we have sent a reset code.' };
        }
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        await this.prisma.passwordResetToken.create({
            data: {
                token: resetCode,
                userId: user.id,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000)
            }
        });
        await this.emailService.sendPasswordResetEmail(user.email, resetCode);
        return { message: 'If that email is in our system, we have sent a reset code.' };
    }
    async resetPassword(dto) {
        const resetToken = await this.prisma.passwordResetToken.findUnique({
            where: { token: dto.token },
            include: { user: true }
        });
        if (!resetToken || resetToken.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired reset token');
        }
        const passwordHash = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: resetToken.userId },
            data: { passwordHash }
        });
        await this.prisma.passwordResetToken.delete({
            where: { id: resetToken.id }
        });
        return { message: 'Password has been successfully reset. You can now login.' };
    }
    generateTokens(userId, email, role) {
        const payload = { sub: userId, email, role };
        return {
            accessToken: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET || 'super_secret_key',
                expiresIn: '15m'
            }),
            refreshToken: this.jwtService.sign(payload, {
                secret: process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key',
                expiresIn: '7d'
            })
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map