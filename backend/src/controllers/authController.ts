import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../utils/AppError';
import { signToken } from '../utils/jwt';
import { userModel } from '../models/userModel';
import type { LoginInput } from '../validators/authValidators';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput;

  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = signToken({ userId: user.id, email: user.email });

  res.status(200).json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});
