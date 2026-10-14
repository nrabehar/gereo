import { Inject, Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import type { Redis } from 'ioredis';

import { REDIS_CLIENT } from '@core/redis/redis.constants.js';

@Injectable()
export class RedisHealthIndicator {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly indicator: HealthIndicatorService,
  ) {}

  async check(key: string) {
    const session = this.indicator.check(key);
    try {
      const reply = await this.redis.ping();
      return reply === 'PONG'
        ? session.up()
        : session.down({ message: 'Unexpected ping reply' });
    } catch (error) {
      return session.down({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
