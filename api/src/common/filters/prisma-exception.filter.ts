import {
  type ArgumentsHost,
  Catch,
  ConflictException,
  type HttpException,
  NotFoundException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { Prisma } from '$prisma/client.js';

const mappers: Record<string, () => HttpException> = {
  P2002: () => new ConflictException('Resource already exists'),
  P2003: () => new ConflictException('Related resource constraint failed'),
  P2025: () => new NotFoundException('Resource not found'),
};

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  override catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    const mapped = mappers[exception.code];
    super.catch(mapped ? mapped() : exception, host);
  }
}
