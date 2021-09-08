import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'aws-sdk';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    // origin: ['http://localhost:3000'],
    origin: ['https://avc-team.com.ua'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  config.update({
    // region: 'eu-central-1',
    // accessKeyId: 'ZL6KQB97IAR0JDMMZIQC',
    // secretAccessKey: 'BzzV6PaK8lMdZq0Lt4jQg2DFWSua0ODttPsppksW',
    //
    region: 'eu-central-1',
    accessKeyId: 'AKIATGDPX3MLKKDX6KJH',
    secretAccessKey: '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',
  });
  await app.listen(process.env.PORT || 3001);
  console.log('Server has been started! PORT: ' + process.env.PORT);
}
bootstrap();
