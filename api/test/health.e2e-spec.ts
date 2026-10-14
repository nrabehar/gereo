import type { NestExpressApplication } from '@nestjs/platform-express';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/app.module.js';
import { configureApp } from '@/bootstrap/configure-app.js';
import { PrismaService } from '@core/database/prisma.service.js';
import { REDIS_CLIENT } from '@core/redis/redis.constants.js';

describe('Health (e2e)', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $queryRaw: vi.fn().mockResolvedValue([{ '?column?': 1 }]),
        $connect: vi.fn(),
        $disconnect: vi.fn(),
      })
      .overrideProvider(REDIS_CLIENT)
      .useValue({
        ping: vi.fn().mockResolvedValue('PONG'),
        quit: vi.fn(),
        status: 'ready',
      })
      .compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health/live', () =>
    request(app.getHttpServer())
      .get('/api/health/live')
      .expect(200)
      .expect({ status: 'ok' }));

  it('GET /api/health', () =>
    request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((response) => {
        expect(response.body.status).toBe('ok');
        expect(response.body.details).toMatchObject({
          database: { status: 'up' },
          redis: { status: 'up' },
        });
      }));
});
