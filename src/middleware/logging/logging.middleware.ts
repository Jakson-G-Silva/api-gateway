import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');
  use(req: Request, res: Response, next: () => void) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    this.logger.log(
      `Incoming Request: ${method} ${originalUrl} - ${userAgent} - ${ip}`,
    );

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const duration = Date.now() - startTime;

      this.logger.log(
        `Outgoing Response: ${statusCode} - ${contentLength} bytes - ${duration} ms`,
      );

      if (statusCode >= 400) {
        this.logger.error(
          `Error Response: ${method} ${originalUrl} - ${statusCode} - ${userAgent} - ${ip}`,
        );
      }
    });

    res.on('error', (err: any) => {
      this.logger.error(
        `Response Error: ${method} ${originalUrl} - ${err.message} - ${userAgent} - ${ip}`,
      );
    });

    req.on('timeout', () => {
      this.logger.error(
        `Request Timeout: ${method} ${originalUrl} - ${userAgent} - ${ip}`,
      );
    });
    next();
  }
}
