import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

export const validateBody =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };

export const validateQuery =
  (schema: ZodType) => (req: Request, _res: Response, next: NextFunction) => {
    req.query = schema.parse(req.query) as typeof req.query;
    next();
  };
