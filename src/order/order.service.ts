import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from '../model/order.entity';
import { UserEntity } from '../model/user.entity';
import { OrderProductEntity } from '../model/orderProduct';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OrderProductEntity)
    private orderProductRepository: Repository<OrderProductEntity>,
  ) {}
  async addOrder(userID) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userID },
        relations: ['basket', 'orders'],
      });
      if (!user)
        throw new HttpException('USER is not found', HttpStatus.BAD_REQUEST);
      if (!user.basket.length)
        throw new HttpException('User basket is empty ', HttpStatus.NO_CONTENT);
      const res = await Promise.all(
        user.basket.map(async (elem) => {
          return await this.orderProductRepository.findOne({
            where: { ID: elem.ID },
            relations: ['product'],
          });
        }),
      );
      const order = this.orderRepository.create({
        orderProducts: res,
        user,
      });
      console.log(order);
      user.orders.push(order);
      // const order2 = await this.orderRepository.save(order);
      await Promise.all(
        user.basket.map(async (elem) => {
          await this.orderProductRepository.delete({ ID: elem.ID });
        }),
      );
      return await this.userRepository.save(user);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.CONFLICT);
    }
    // return await this.orderRepository.save(order);
  }
}
