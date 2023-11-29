import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(
    currentUser: User,
    data: Prisma.UserCreateInput,
  ): Promise<User> {
    // Check if the current user is an admin
    if (currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can create new users');
    }

    // Check if the email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Save the new user with the encrypted password
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
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

  async setAccessToken(userId: number, accessToken: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { access_token: accessToken },
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
