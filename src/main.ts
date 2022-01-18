import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'aws-sdk';

import * as cookieParser from 'cookie-parser';
// const TelegramBot = require('node-telegram-bot-api');

const token = '2096231400:AAH5VbFVGwOhHsXs_dYOdS9IGFYfr_NdDaY';
// export const bot = new TelegramBot(token, { polling: true });
// bot.on('message', (msg) => {
//   console.log(msg);
// });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: ['192.168.0.103:3000', 'http://localhost:3002'],
    // origin: ['https://avc-team.com.ua'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  await app.listen(process.env.PORT || 3001);
  console.log('Server has been started! PORT: ' + process.env.PORT);
}
bootstrap();
