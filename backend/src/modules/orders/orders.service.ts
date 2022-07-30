import { HttpException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(@InjectModel('Order') private order: Model<Order>) {}

  async create(createOrderDto: CreateOrderDto) {
    const newOrder = new this.order(createOrderDto);
    //extra fields to populate for order
    await newOrder.save();
    throw new HttpException('Success', 200);
  }

  findAll() {
    return this.order.find({});
  }

  findOne(id: string) {
    return this.order.findOne({ _id: id });
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order: Order = await this.order.findOne({ _id: id });
    if (!order) throw new HttpException('Order not found', 404);
    //Update fields
    //await order.save()
    throw new HttpException('Success', 200);
  }

  async remove(id: string) {
    await this.order.deleteOne({ _id: id });
    throw new HttpException('Success', 200);
  }
}
