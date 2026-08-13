import 'dotenv/config';
import { defineConfig } from '@mikro-orm/postgresql';

import { User } from '../entities/users/user.entity.js';
import { Otp } from '../entities/otp/otp.entity.js';
import { UserSession } from '../entities/user-session/user-session.entity.js';
import { UserTwoFactor } from '../entities/two-factor/user-two-factor.entity.js';
import { Migrator } from '@mikro-orm/migrations';

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
    UserTwoFactor,
  ],

  extensions: [Migrator],

  migrations: {
    path: './dist/database/migrations',
    pathTs: './src/database/migrations',
  },
});