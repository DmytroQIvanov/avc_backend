import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './model/user.entity';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { BasketModule } from './basket/basket.module';
import { PostModule } from './post/post.module';
// import { MinioClientModule } from './minio-client/minio-client.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ec2-34-253-116-145.eu-west-1.compute.amazonaws.com',
      port: 5432,
      username: 'zauypisgxhntsd',
      password:
        '213b28bf10edbe081d4e20b522a36dec0dbb9f8a2133394f97354b1a5e2fcd67',
      database: 'dcf52tu6mdqtr9',
      entities: [UserEntity],
      synchronize: true,
      ssl: false,
      autoLoadEntities: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),

    //     ConfigModule.forRoot({
    //   validationSchema: Joi.object({
    //     POSTGRES_HOST: Joi.string().required(),
    //     POSTGRES_PORT: Joi.number().required(),
    //     POSTGRES_USER: Joi.string().required(),
    //     POSTGRES_PASSWORD: Joi.string().required(),
    //     POSTGRES_DB: Joi.string().required(),
    //     JWT_SECRET: Joi.string().required(),
    //     JWT_EXPIRATION_TIME: Joi.string().required(),
    //     AWS_REGION: Joi.string().required(),
    //     AWS_ACCESS_KEY_ID: Joi.string().required(),
    //     AWS_SECRET_ACCESS_KEY: Joi.string().required(),
    //     PORT: Joi.number(),
    //   })
    // }),
    UserModule,
    AdminModule,
    AuthModule,
    ProductModule,
    BasketModule,
    PostModule,
    // MinioClientModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
