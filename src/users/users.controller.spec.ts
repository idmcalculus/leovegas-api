import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Role } from './roles/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Reflector } from '@nestjs/core';

// Mock implementations
const mockJwtAuthGuard = { canActivate: () => true };
const mockRolesGuard = { canActivate: () => true };

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: Role.User,
    access_token: 'someaccesstoken',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn().mockResolvedValue(mockUser),
            findAll: jest.fn().mockResolvedValue([mockUser]),
            findOne: jest.fn().mockResolvedValue(mockUser),
            updateUser: jest.fn().mockResolvedValue(mockUser),
            removeUser: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: JwtAuthGuard,
          useValue: mockJwtAuthGuard,
        },
        {
          provide: RolesGuard,
          useValue: mockRolesGuard,
        },
        {
          provide: Reflector,
          useValue: {
            get: jest.fn().mockReturnValue([]),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);

    service.createUser = jest
      .fn()
      .mockImplementation((adminUser, createUserDto) => {
        if (adminUser.role !== 'ADMIN') {
          throw new ForbiddenException();
        }

        return {
          ...createUserDto,
          id: expect.any(Number),
          password: expect.any(String),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          access_token: expect.any(String),
        };
      });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'newpassword',
        role: Role.User,
        access_token: 'accesstoken',
      };

      const mockAdminUser = {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN',
      };

      // Mock request object
      const mockReq = {
        user: mockAdminUser,
      };

      await controller.create(mockReq as any, createUserDto);

      // Expect the service to have been called with the mock admin user and createUserDto
      expect(service.createUser).toHaveBeenCalledWith(
        mockAdminUser,
        createUserDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = [mockUser];
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(result));
      expect(await controller.findAll({ user: mockUser } as any)).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const userId = 1;
      await expect(
        controller.findOne({ user: mockUser } as any, userId.toString()),
      ).resolves.toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith(mockUser, userId);
    });

    it('should throw a NotFoundException', async () => {
      jest.spyOn(service, 'findOne').mockImplementation(() => {
        throw new NotFoundException();
      });
      await expect(
        controller.findOne({ user: mockUser } as any, '2'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto: UpdateUserDto = { name: 'Updated User' };
      await expect(
        controller.update(
          { user: mockUser } as any,
          mockUser.id.toString(),
          updateDto,
        ),
      ).resolves.toEqual(mockUser);
      expect(service.updateUser).toHaveBeenCalledWith(
        mockUser,
        mockUser.id,
        updateDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = 1;
      await expect(
        controller.remove({ user: mockUser } as any, userId.toString()),
      ).resolves.toEqual(mockUser);
      expect(service.removeUser).toHaveBeenCalledWith(mockUser, userId);
    });

    it('should throw a ForbiddenException', async () => {
      jest.spyOn(service, 'removeUser').mockImplementation(() => {
        throw new ForbiddenException();
      });
      await expect(
        controller.remove({ user: mockUser } as any, '2'),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
