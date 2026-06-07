import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let details: string | string[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const body = exceptionResponse as {
          message?: string | string[];
          error?: string;
        };
        message = Array.isArray(body.message)
          ? body.message.join(', ')
          : body.message || body.error || message;
        details = Array.isArray(body.message) ? body.message : undefined;
      }
    } else if (exception instanceof Error) {
      if (
        exception.message.includes('fechaInicio') ||
        exception.message.includes('fechaFin')
      ) {
        status = HttpStatus.BAD_REQUEST;
        message = exception.message;
      } else {
        this.logger.error(
          `Excepción no controlada: ${exception.message}`,
          exception.stack,
        );
        message = exception.message || message;
      }
    } else {
      this.logger.error('Excepción desconocida', String(exception));
    }

    response.status(status).json({
      error: {
        code: status,
        message,
        ...(details ? { details } : {}),
      },
    });
  }
}
