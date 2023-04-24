import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { FirebaseService } from '@firebase/firebase';
import { CreatorModule } from './api/creator/creator.module';
import { VendorModule } from './api/vendor/vendor.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from '@database/database';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AuthGuard } from './security/guards/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from './security/services/http/http.service';
import { HealthModule } from './checks/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
      validationSchema: Joi.object({
        // DATABASE VALIDATION
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USER: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_SCHEMA: Joi.string().required(),
        // JWT VALIDATION
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        // FIREBASE VALIDATION
        FIREBASE_PID: Joi.string().required(),
        FIREBASE_AID: Joi.string().required(),
        FIREBASE_DB: Joi.string().required(),
        FIREBASE_STORAGE: Joi.string().required(),
        FIREBASE_LID: Joi.string().required(),
        FIREBASE_API_KEY: Joi.string().required(),
        FIREBASE_AUTH_DOMAIN: Joi.string().required(),
        FIREBASE_SID: Joi.string().required(),
        FIREBASE_MID: Joi.string().required(),
        FIREBASE_PRIVATE_KEY: Joi.string().required(),
        FIREBASE_PRIVATE_ID: Joi.string().required(),
        // PORT VALIDATION
        NODE_PORT: Joi.number().required(),
        // REDIS VALIDATION
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().required(),
        REDIS_USERNAME: Joi.string().required(),
        // GRPC VALIDATION
        GRPC_HOST: Joi.string().required(),
        GRPC_PACKAGE: Joi.string().required(),
        GRPC_PROTO_PATH: Joi.string().required(),
        // RABBITMQ VALIDATION
        RABBITMQ_HOST: Joi.string().required(),
        RABBITMQ_QUEUE: Joi.string().required(),
        RABBITMQ_USERNAME: Joi.string().required(),
        RABBITMQ_PASSWORD: Joi.string().required(),
        // KAFKA VALIDATION
        KAFKA_HOST: Joi.string().required(),
        KAFKA_CLIENT_ID: Joi.string().required(),
        // MQTT VALIDATION
        MQTT_HOST: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    CreatorModule,
    VendorModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'web/www'),
      renderPath: '/',
      serveStaticOptions: {
        extensions: ['ejs'],
      },
    }),
    HealthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    JwtService,
    HttpService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FirebaseService).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
