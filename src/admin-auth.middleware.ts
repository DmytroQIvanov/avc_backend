import { AdminService } from './admin/admin.service';
import { Injectable, NestMiddleware, HttpException, HttpStatus, Req, Header } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from './model/admin.entity';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdminAuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
    private adminService: AdminService

    ) {}
  async use(@Req() req: Request, res: Response, next: NextFunction) {
    try{

      console.log(req.headers)
    // const data = this.adminService.checkToken(req.body.accesToken);
    // console.log(data)

    next();
}catch(e){
  throw new HttpException('Token is not valid middleware', HttpStatus.FORBIDDEN)
}
  }
}