import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createMock } from '@golevelup/nestjs-testing';
import { Request, Response } from 'express';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHello: jest.fn().mockImplementation(
              (host) => `
              <h3 style="display: flex; align-items: center; justify-content: center;">
                Welcome to Leovegas API! Please visit <a href="${host}/api-doc"> API Doc </a> to see the documentation.
              </h3>
            `,
            ),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return welcome message with API docs URL in HTML format', () => {
      const mockRequest = createMock<Request>({
        protocol: 'http',
        get: () => 'localhost:3000',
      });
      const mockResponse = createMock<Response>();
      mockResponse.set = jest.fn().mockReturnThis();
      mockResponse.send = jest.fn().mockReturnThis();

      const mockHost = 'http://localhost:3000';
      const expectedOutput = `
        <h3 style="display: flex; align-items: center; justify-content: center;">
          Welcome to Leovegas API! Please visit <a href="${mockHost}/api-doc"> API Doc </a> to see the documentation.
        </h3>
      `;

      appController.getHello(mockRequest, mockResponse);

      expect(mockResponse.set).toHaveBeenCalledWith(
        'Content-Type',
        'text/html',
      );
      expect(mockResponse.send).toHaveBeenCalledWith(expectedOutput);
      expect(appService.getHello).toHaveBeenCalledWith(mockHost);
    });
  });
});
