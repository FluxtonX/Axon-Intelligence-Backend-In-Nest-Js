import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(dto: RegisterDto) {
    dto.email = dto.email.toLowerCase().trim();
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
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

  async login(dto: LoginDto) {
    dto.email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.passwordHash) {
      throw new UnauthorizedException('Please login with your Google account');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user.id, user.email, user.role);
  }

  async googleLogin(idToken: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        // Optional: specify audience if process.env.GOOGLE_CLIENT_ID is set
        audience: process.env.GOOGLE_CLIENT_ID ? [process.env.GOOGLE_CLIENT_ID] : undefined, 
      });
      
      const payload = ticket.getPayload();
      if (!payload) throw new UnauthorizedException('Invalid Google Token');
      
      const { sub: googleId, email, given_name, family_name } = payload;
      if (!email) throw new UnauthorizedException('No email found in Google profile');
      
      // Find user by email or googleId
      let user = await this.prisma.user.findFirst({
        where: {
          OR: [
            { googleId },
            { email },
          ]
        }
      });
      
      if (!user) {
        // Create new user
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
      } else if (!user.googleId) {
        // Link google ID to existing email account
        user = await this.prisma.user.update({
          where: { id: user.id },
          data: { googleId, authProvider: 'GOOGLE' }
        });
      }
      
      return this.generateTokens(user.id, user.email, user.role);
    } catch (e) {
       console.error("Google verify error", e);
       throw new UnauthorizedException('Failed to authenticate with Google');
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
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
    
    console.log(`\n\n=== PASSWORD RESET CODE ===\nEmail: ${user.email}\nCode: ${resetCode}\n===========================\n\n`);
    
    return { message: 'If that email is in our system, we have sent a reset code.' };
  }
  
  async resetPassword(dto: ResetPasswordDto) {
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
      include: { user: true }
    });
    
    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset token');
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

  private generateTokens(userId: string, email: string, role: string) {
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
}
