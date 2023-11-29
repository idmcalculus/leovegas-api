import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = this.getHttpStatus(exception.code);

    response.status(status).json({
      statusCode: status,
      message: this.getUserFriendlyMessage(exception.code),
    });
  }

  private getHttpStatus(errorCode: string): number {
    switch (errorCode) {
      case 'P2002':
        return HttpStatus.CONFLICT;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private getUserFriendlyMessage(errorCode: string): string {
    switch (errorCode) {
      case 'P2002':
        return 'The provided data conflicts with an existing resource';
      default:
        return 'An unexpected error occurred';
    }
  }
}
