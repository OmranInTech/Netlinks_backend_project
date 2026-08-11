import 'dotenv/config';
import { defineConfig } from '@mikro-orm/postgresql';
import { User } from '../modules/users/user.entity.js';

export default defineConfig({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,

  entities: [User],
});