import { HttpException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.entity';
import { ItemsService } from '../items/items.service';
import { Item } from '../items/item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private order: Model<Order>,
    private readonly itemService: ItemsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user) {
    const item: Item = await this.itemService.findOne(createOrderDto.itemId);
    if (!item) throw new HttpException('Item not found', 400);
    const newOrder = new this.order(createOrderDto);
    newOrder.buyer = item.buyer;
    newOrder.seller = user.id;
    newOrder.stacId = await this.getNewStacId();
    //TODO-> code to generate qr_code
    await newOrder.save();
    throw new HttpException('Success', 200);
  }
  async getNewStacId(): Promise<string> {
    return '12345abcde';
  }

  findAll() {
    return this.order
      .find({})
      .populate('buyer')
      .populate('seller')
      .populate('itemId');
  }

  findOne(id: string) {
    return this.order
      .findOne({ _id: id })
      .populate('buyer')
      .populate('seller')
      .populate('itemId');
  }

  async remove(id: string) {
    await this.order.deleteOne({ _id: id });
    throw new HttpException('Success', 200);
  }
}
