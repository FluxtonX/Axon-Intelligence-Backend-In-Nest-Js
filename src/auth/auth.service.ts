import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OAuth2Client } from 'google-auth-library';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService
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

  async googleLogin(idToken: string, fallbackEmail?: string, displayName?: string, photoUrl?: string) {
    try {
      let verifiedEmail = fallbackEmail;
      let firstName = displayName?.split(' ')[0] || 'User';
      let lastName = displayName?.split(' ').slice(1).join(' ') || '';
      let googleId = '';
      let avatarUrl = photoUrl;

      // Try to verify token if it's a real token (not our mock) and we have a client ID,
      // otherwise we fallback to trusting the email provided by the flutter google_sign_in plugin.
      // TODO: In production, REQUIRE idToken verification and remove fallback.
      if (idToken && !idToken.startsWith('mock_')) {
        try {
          const ticket = await this.googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID ? [process.env.GOOGLE_CLIENT_ID] : undefined, 
          });
          
          const payload = ticket.getPayload();
          if (payload && payload.email) {
            verifiedEmail = payload.email;
            firstName = payload.given_name || firstName;
            lastName = payload.family_name || lastName;
            googleId = payload.sub || '';
            if (payload.picture) {
              avatarUrl = payload.picture;
            }
          }
        } catch (e) {
          console.warn("Google verify failed, falling back to provided email for development", e.message);
        }
      }
      
      if (!verifiedEmail) throw new UnauthorizedException('No email found for Google authentication');
      
      // Find user by email or googleId
      let user = await this.prisma.user.findFirst({
        where: {
          OR: [
            ...(googleId ? [{ googleId }] : []),
            { email: verifiedEmail },
          ]
        }
      });
      
      if (!user) {
        // Create new user
        user = await this.prisma.user.create({
          data: {
            email: verifiedEmail,
            googleId: googleId || undefined,
            authProvider: 'GOOGLE',
            profile: {
              create: {
                firstName: firstName,
                lastName: lastName,
                avatarUrl: avatarUrl || undefined,
              }
            }
          }
        });
      } else {
        // User already exists. Always update their profile picture and name from Google!
        await this.prisma.profile.update({
          where: { userId: user.id },
          data: {
            avatarUrl: avatarUrl || undefined,
            firstName: firstName,
            lastName: lastName,
          }
        });

        if (googleId && !user.googleId) {
          // Link google ID to existing email account
          user = await this.prisma.user.update({
            where: { id: user.id },
            data: { googleId, authProvider: 'GOOGLE' }
          });
        }
      }
      
      return this.generateTokens(user.id, user.email, user.role);
    } catch (e) {
       console.error("Google auth error", e);
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
    
    // Send actual email using EmailService
    await this.emailService.sendPasswordResetEmail(user.email, resetCode);
    
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
