import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';

import { ChatModule } from './chat/chat.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/app_db',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),

    AuthModule,

    ChatModule,

  ],
})
export class AppModule {}