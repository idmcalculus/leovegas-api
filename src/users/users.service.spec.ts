import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

// Mock data
const adminUser = {
  id: 1,
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'hashedpassword',
  role: 'ADMIN',
  access_token: 'token',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const regularUser = {
  id: 2,
  name: 'Regular User',
  email: 'user@example.com',
  password: 'hashedpassword',
  role: 'USER',
  access_token: 'regular_token',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const createUserDto = {
  name: 'New User',
  email: 'new.user@example.com',
  password: 'hashedpassword',
  role: 'USER',
};

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockResolvedValue(regularUser),
              findMany: jest.fn().mockResolvedValue([adminUser, regularUser]),
              findUnique: jest.fn((args) => {
                if (args.where.id === adminUser.id) {
                  return jest.fn().mockResolvedValue(adminUser);
                } else if (args.where.id === regularUser.id) {
                  return jest.fn().mockResolvedValue(regularUser);
                }
                throw new NotFoundException();
              }),
              update: jest.fn((args) => {
                if (args.where.id === regularUser.id) {
                  return jest
                    .fn()
                    .mockResolvedValue({ ...regularUser, ...args.data });
                }
                throw new NotFoundException();
              }),
              delete: jest.fn().mockResolvedValue(regularUser),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);

    prisma.user.findUnique = jest.fn().mockImplementation(({ where }) => {
      if (where.id === regularUser.id) {
        return Promise.resolve(regularUser);
      }
      return null;
    });

    prisma.user.update = jest.fn().mockImplementation(({ where, data }) => {
      if (where.id === regularUser.id) {
        return Promise.resolve({ ...regularUser, ...data });
      }
      return null;
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    await expect(service.createUser(createUserDto)).resolves.toEqual(
      regularUser,
    );
    expect(prisma.user.create).toHaveBeenCalledWith({ data: createUserDto });
  });

  it('should find all users if admin', async () => {
    await expect(service.findAll(adminUser)).resolves.toEqual([
      adminUser,
      regularUser,
    ]);
    expect(prisma.user.findMany).toHaveBeenCalled();
  });

  it('should throw an error when non-admin tries to find all users', async () => {
    await expect(service.findAll(regularUser)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should find one user if admin or the same user', async () => {
    await expect(service.findOne(adminUser, regularUser.id)).resolves.toEqual(
      regularUser,
    );
    await expect(service.findOne(regularUser, regularUser.id)).resolves.toEqual(
      regularUser,
    );
  });

  it('should throw an error when a user tries to find another user', async () => {
    await expect(service.findOne(regularUser, adminUser.id)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should update a user if admin or the same user', async () => {
    const updateUserDto = { name: 'Updated Name' };
    await expect(
      service.updateUser(adminUser, regularUser.id, updateUserDto),
    ).resolves.toMatchObject({ name: 'Updated Name' });
    await expect(
      service.updateUser(regularUser, regularUser.id, updateUserDto),
    ).resolves.toMatchObject({ name: 'Updated Name' });
  });

  it('should throw an error when a user tries to update another user', async () => {
    const updateUserDto = { name: 'Updated Name' };
    await expect(
      service.updateUser(regularUser, adminUser.id, updateUserDto),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should allow admin to remove a user', async () => {
    await expect(
      service.removeUser(adminUser, regularUser.id),
    ).resolves.toEqual(regularUser);
  });

  it('should throw an error when a user tries to remove another user', async () => {
    await expect(service.removeUser(regularUser, adminUser.id)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should throw an error when a user tries to remove themselves', async () => {
    await expect(service.removeUser(adminUser, adminUser.id)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should throw an error when a user tries to remove a non-existing user', async () => {
    await expect(service.removeUser(adminUser, 999)).rejects.toThrow(
      NotFoundException,
    );
  });
});
