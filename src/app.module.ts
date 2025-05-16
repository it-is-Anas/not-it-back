import { Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';

import { NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from './middleware/Auth';
import { JwtModule } from '@nestjs/jwt';
import { NoteModule } from './note/note.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'not-it',
      // entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UserModule,
    JwtModule.register({
      secret: 'process.env.JWT_SECRET',
      signOptions: { expiresIn: '1h' },
    }),
    NoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'auth', method: RequestMethod.POST },
        { path: 'auth/log-in', method: RequestMethod.POST },
      )
      .forRoutes('');
  }
}
