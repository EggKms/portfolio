import { Request, Response, NextFunction } from 'express';
import { BadRequestException } from '@nestjs/common';

export function sqlInjectionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const sqlInjectionPattern =
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|--|#)\b|['";])/i;

  const checkForInjection = (value: any) => {
    if (typeof value === 'string' && sqlInjectionPattern.test(value)) {
      throw new BadRequestException('SQL Injection detected');
    }
    if (typeof value === 'object' && value !== null) {
      Object.values(value).forEach(checkForInjection);
    }
  };

  checkForInjection(req.body);
  checkForInjection(req.query);
  checkForInjection(req.params);

  next();
}
