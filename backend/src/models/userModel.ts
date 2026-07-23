import db from '../config/db';
import type { User } from '../types';

export const userModel = {
  findByEmail(email: string): Promise<User | undefined> {
    return db<User>('users').where({ email }).first();
  },

  findById(id: number): Promise<User | undefined> {
    return db<User>('users').where({ id }).first();
  },
};
