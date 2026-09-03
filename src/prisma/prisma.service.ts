import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { db } from './db.js';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  readonly client = db;

  async onModuleInit() {
    await this.client.connect({ url: process.env['DATABASE_URL']! });
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
