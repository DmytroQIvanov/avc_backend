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
    origin: ['http://localhost:3000'],
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
  const port = process.env.PORT || 8080;
  const server = await app.listen(port, () => {
    console.log('smth');
  });
  console.log('Server has been started! PORT: ' + server.address().port);
}
bootstrap();
