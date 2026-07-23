import type { Knex } from 'knex';
import bcrypt from 'bcryptjs';

export async function seed(knex: Knex): Promise<void> {
  const email = process.env.ADMIN_EMAIL || 'admin@test.com';
  const existing = await knex('users').where({ email }).first();
  if (existing) return;

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || '123456', 10);

  await knex('users').insert({
    name: process.env.ADMIN_NAME || 'Admin',
    email,
    password: hashedPassword,
  });
}
