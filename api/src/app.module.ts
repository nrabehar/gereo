import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { PrismaExceptionFilter } from '@common/filters/prisma-exception.filter.js';
import { AppConfigService } from '$config/app-config.service.js';
import { ConfigModule } from '$config/config.module.js';
import { DatabaseModule } from '@core/database/database.module.js';
import { HealthModule } from '@core/health/health.module.js';
import { LoggerModule } from '@core/logger/logger.module.js';
import { RedisModule } from '@core/redis/redis.module.js';
import { UsersModule } from '#/users/users.module.js';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    DatabaseModule,
    RedisModule,
    ThrottlerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => [
        {
          ttl: config.get('THROTTLE_TTL_MS'),
          limit: config.get('THROTTLE_LIMIT'),
        },
      ],
    }),
    HealthModule,
    UsersModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
  ],
})
export class AppModule {}
