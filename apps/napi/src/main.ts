import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { setupSwagger } from '@configuration/configuration';

const chalk = require('chalk');
declare const module: any;

async function bootstrap() {
  // CORE SERVER
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: ['error', 'warn', 'debug'],
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT'],
    },
  });

  // CORE BACKUP SERVER
  app.useStaticAssets(join(__dirname, './web/assets'));
  app.setBaseViewsDir(join(__dirname, '../web/www'));
  app.setViewEngine('ejs');

  const globalPrefix = 'v1';
  app.setGlobalPrefix(globalPrefix);
  const p = process.env.NODE_PORT || 3021;

  setupSwagger(app);
  await app.listen(p, () => {
    console.log(
      chalk
        .hex('#ffdd00')
        .bold(`---| [NXiE: Global Api] http://localhost:${p}/${globalPrefix}`),
    );
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
void bootstrap();
