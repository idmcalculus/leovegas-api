import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findAll(user: User): Promise<User[]> {
    this.ensureAdmin(user);
    return this.prisma.user.findMany();
  }

  async findOne(user: User, userId: number): Promise<User | null> {
    if (user.id !== userId && user.role !== 'ADMIN') {
      throw new ForbiddenException();
    }
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async updateUser(
    user: User,
    userId: number,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    if (user.id !== userId && user.role !== 'ADMIN') {
      throw new ForbiddenException();
    }
    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async removeUser(user: User, userId: number): Promise<User> {
    this.ensureAdmin(user);
    if (user.id === userId) {
      throw new ForbiddenException('Cannot delete oneself');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.user.delete({
      where: { id: userId },
    });
  }

  private ensureAdmin(user: User) {
    if (user.role !== 'ADMIN') {
      throw new ForbiddenException();
    }
  }
}
