import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(identifier: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(identifier);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
