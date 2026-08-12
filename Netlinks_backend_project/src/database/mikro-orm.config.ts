import 'dotenv/config';
import { defineConfig } from '@mikro-orm/postgresql';

import { User } from '../shared/entities/user/user.entity.js';
import { Otp } from '../shared/entities/user/otp.entity.js';
import { UserSession } from '../shared/entities/user/user-session.entity.js';

export default defineConfig({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,

  entities: [
    User,
    Otp,
    UserSession,
  ],
});