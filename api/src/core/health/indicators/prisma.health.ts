import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';

import { PrismaService } from '@core/database/prisma.service.js';

@Injectable()
export class PrismaHealthIndicator {
  constructor(
    private readonly prisma: PrismaService,
    private readonly indicator: HealthIndicatorService,
  ) {}

  async check(key: string) {
    const session = this.indicator.check(key);
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return session.up();
    } catch (error) {
      return session.down({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
