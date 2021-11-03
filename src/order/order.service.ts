import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { OrderEntity } from '../model/order.entity';
import { UserEntity } from '../model/user.entity';
import { OrderProductEntity } from '../model/orderProduct';
import { NotificationEntity } from '../model/notification.entity';
import { bot } from '../main';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OrderProductEntity)
    private orderProductRepository: Repository<OrderProductEntity>,
    @InjectRepository(NotificationEntity)
    private notificationEntity: Repository<NotificationEntity>,
  ) {}
  async addOrder(
    userID,
    data: { orderNotes: string; deliveryAddress: string },
  ) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userID },
        relations: ['basket', 'orders', 'notifications'],
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
        ...data,
      });
      user.orders.push(order);
      await Promise.all(
        user.basket.map(async (elem, indx) => {
          await this.orderProductRepository.delete({ ID: elem.ID });
          user.basket.splice(indx);
        }),
      );
      const notification = await this.notificationEntity.create({
        notificationNameUA: 'Ваше замовлення прийняте в обробку',
        // notificationNameEN: 'Your order has been accepted for processing',
        contentUA:
          'Ваше замовлення прийняте в обробку. Найближчим часом ми повiдомимо вас о статусi заказу!',
        // contentEN: 'something',
        user,
      });
      await user.notifications.push(notification);
      bot.sendMessage(
        '874227832',
        `Новый заказ! 
        \n ФИО: ${order.user.firstName + ' ' + order.user.lastName}
        \n Примечание к заказу: ${order.orderNotes} 
        \n Товары: ${order.orderProducts.map(
          (elem) => `${elem.product.name} \n`,
        )}
        `,
      );

      return await this.userRepository.save(user);
    } catch (e) {
      console.log(e);
      throw new HttpException(e.message, HttpStatus.CONFLICT);
    }
    // return await this.orderRepository.save(order);
  }

  async getOrders() {
    // return await this.orderRepository.find({
    //   relations: ['user', 'orderProducts'],
    // });

    const userData = await getRepository(OrderEntity)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderProducts', 'orderProducts')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('orderProducts.product', 'product')
      .leftJoinAndSelect('product.productVariant', 'productVariant')
      .leftJoinAndSelect('productVariant.property', 'property')
      .getMany();
    return userData;
  }

  async deleteOrder(id) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderProducts'],
    });
    await Promise.all(
      order.orderProducts.map(async (elem) => {
        await this.orderProductRepository.delete(elem.ID);
      }),
    );
    return await this.orderRepository.delete({ id });
  }
}
