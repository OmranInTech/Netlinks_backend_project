import 'dotenv/config';

import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';
import { User } from './src/entities/users/user.entity';
import { Otp } from './src/entities/otp/otp.entity';
import { UserSession } from './src/entities/user-session/user-session.entity';
import { UserTwoFactor } from './src/entities/two-factor/user-two-factor.entity';


export default defineConfig({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
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