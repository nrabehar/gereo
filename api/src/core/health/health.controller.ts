import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';

import { PrismaHealthIndicator } from './indicators/prisma.health.js';
import { RedisHealthIndicator } from './indicators/redis.health.js';

@ApiTags('health')
@SkipThrottle()
@Controller({ path: 'health', version: VERSION_NEUTRAL })
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly database: PrismaHealthIndicator,
    private readonly redis: RedisHealthIndicator,
  ) {}

  @Get('live')
  live() {
    return { status: 'ok' };
  }

  @Get()
  @HealthCheck()
  ready() {
    return this.health.check([
      () => this.database.check('database'),
      () => this.redis.check('redis'),
    ]);
  }
}
