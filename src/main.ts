import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'aws-sdk';

import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser());
app.enableCors({origin:"http://localhost:3001"});

  
  
  config.update({
    region:"eu-central-1",
    accessKeyId:"AKIATGDPX3MLKKDX6KJH",
    secretAccessKey:'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'
  });
  await app.listen(process.env.PORT ||3000);
  console.log('Server has been started!');
}
bootstrap();
