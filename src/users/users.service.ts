import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll() {
    return await this.prisma.client.orm.public.User.all();
  }

  async findOne(identifier: string) {
    const user = await this.prisma.client.orm.public.User
      .where((u) => u.email.eq(identifier))
      .first();

    if (user) return user;

    return await this.prisma.client.orm.public.User
      .where((u) => u.username.eq(identifier))
      .first();
  }

  async findByEmail(email: string) {
    return await this.prisma.client.orm.public.User
      .where((u) => u.email.eq(email))
      .first();
  }

  async createUser(data: {
    email?: string;
    username?: string;
    password?: string;
    photo?: string;
  }) {
    return await this.prisma.client.orm.public.User.create(data);
  }
}
