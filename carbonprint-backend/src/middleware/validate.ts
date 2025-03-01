import { Request, Response, NextFunction } from 'express';
import expressValidator from 'express-validator';

const { validationResult } = expressValidator;

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
