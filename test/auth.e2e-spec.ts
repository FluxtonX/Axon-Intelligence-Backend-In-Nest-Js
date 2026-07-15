import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/database/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    
    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.passwordResetToken.deleteMany({
      where: { user: { email: { startsWith: 'e2etest_' } } }
    });
    await prisma.profile.deleteMany({
      where: { user: { email: { startsWith: 'e2etest_' } } }
    });
    await prisma.user.deleteMany({
      where: { email: { startsWith: 'e2etest_' } }
    });
    
    await app.close();
  });

  describe('Duplicate Registration Validation', () => {
    const testEmail = `e2etest_dup_${Date.now()}@example.com`;

    it('should register a new user successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: testEmail,
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe'
        })
        .expect(201);

      expect(res.body).toHaveProperty('accessToken');
    });

    it('should fail to register again with the same email (case insensitive)', async () => {
      // Trying to register with mixed case to test normalization
      const res = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: testEmail.toUpperCase(),
          password: 'Password123!',
          firstName: 'John',
          lastName: 'Doe'
        })
        .expect(409);

      expect(res.body.message).toBe('Email already in use');
    });
  });

  describe('Forgot Password Flow', () => {
    const testEmail = `e2etest_forgot_${Date.now()}@example.com`;

    beforeAll(async () => {
      // Create user for forgot password tests
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: testEmail,
          password: 'Password123!',
          firstName: 'Jane',
          lastName: 'Doe'
        });
    });

    it('should generate a reset code successfully', async () => {
      const res = await request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({
          email: testEmail,
        })
        .expect(200);

      expect(res.body.message).toBe('If that email is in our system, we have sent a reset code.');

      // Verify token exists in database
      const user = await prisma.user.findUnique({ where: { email: testEmail } });
      const token = await prisma.passwordResetToken.findFirst({
        where: { userId: user!.id }
      });
      
      expect(token).toBeDefined();
      expect(token!.token.length).toBe(6);
    });
  });
});
