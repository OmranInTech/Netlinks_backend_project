import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import * as path from 'path';

import {
  AcceptLanguageResolver,
  I18nJsonLoader,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';

import dbConfig from './database/mikro-orm.config.js';
import { UsersModule } from './modules/users/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(dbConfig),

    I18nModule.forRoot({
      fallbackLanguage: 'da',
      loader: I18nJsonLoader,

      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },

      resolvers: [
        new QueryResolver(['lang']),
        AcceptLanguageResolver,
      ],
    }),

    UsersModule,AuthModule
  ],
})
export class AppModule {}