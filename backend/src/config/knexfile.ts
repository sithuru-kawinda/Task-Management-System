import type { Knex } from 'knex';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'task_manager',
    dateStrings: true,
  },
  migrations: {
    directory: path.resolve(__dirname, '../migrations'),
    extension: 'ts',
  },
  seeds: {
    directory: path.resolve(__dirname, '../seeds'),
    extension: 'ts',
  },
};

export default config;
