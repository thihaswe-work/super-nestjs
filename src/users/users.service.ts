import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      email: 'john@example.com',
      phone: '1234567890',
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      email: 'maria@example.com',
      phone: '2134567890',
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
