import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as requestIp from 'request-ip';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('logger.middleware');

  use(req: Request, res: Response, next: NextFunction): void {
    const clientIp = requestIp.getClientIp(req);
    const userAgent = req.headers['user-agent'];
    this.logger.debug(`Client IP: ${clientIp}, User Agent: ${userAgent}`);
    next();
  }
}
