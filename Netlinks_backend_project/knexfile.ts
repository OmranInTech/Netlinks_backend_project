import type { Knex } from 'knex';
import 'dotenv/config';

const config: Knex.Config = {
  client: 'pg',

  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },

  migrations: {
    directory: './src/database/migrations',
    extension: 'ts',
    tableName: 'knex_migrations',
  },
};

export default config;