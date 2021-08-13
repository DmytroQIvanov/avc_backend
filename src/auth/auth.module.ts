import { jwtConstants } from './constants';
import { UserEntity } from 'src/model/user.entity';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  // JwtModule.register({
  //   secret: "hard!to-guess_secret",
  //   signOptions: { expiresIn: '60s'},
  // }),
],

  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
