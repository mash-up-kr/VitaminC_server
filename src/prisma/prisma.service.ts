import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from './client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }
}
