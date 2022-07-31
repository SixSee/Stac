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
    if (item.quantity < 1) throw new HttpException('No more items left', 400);
    const newOrder = new this.order(createOrderDto);
    newOrder.seller = item.seller;
    newOrder.buyer = user.id;
    newOrder.stacId = await this.getNewStacId();
    //TODO-> code to generate qr_code
    newOrder.refunded = 'false';
    await newOrder.save();
    item.quantity -= 1;
    await item.save();
    return {
      orderId: newOrder._id,
      timestamp: newOrder.createdAt,
      stacId: newOrder.stacId,
    };
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

  findAllByBuyer(user) {
    return this.order
      .find({ buyer: user.id })
      .populate('buyer')
      .populate('seller')
      .populate('itemId')
      .populate('refund_status');
  }

  // Returns a list of refund items belonging to the buyer
  findRefundedByBuyer(user) {
    return this.order
      .find({ buyer: user.id, refunded: 'initiated' })
      .populate('buyer')
      .populate('seller')
      .populate('itemId');
  }

  // Returns a list of refund items belonging to the seller
  findRefundedBySeller(user) {
    return this.order
      .find({ seller: user.id, refunded: 'initiated' })
      .populate('buyer')
      .populate('seller')
      .populate('itemId');
  }

  // Returns a list of refund items belonging to the buyer
  findCompletedRefundsByBuyer(user) {
    return this.order
      .find({ buyer: user.id, refunded: 'true' })
      .populate('buyer')
      .populate('seller')
      .populate('itemId');
  }

  // Returns a list of refund items belonging to the seller
  findCompletedRefundsBySeller(user) {
    return this.order
      .find({ seller: user.id, refunded: 'true' })
      .populate('buyer')
      .populate('seller')
      .populate('itemId');
  }

  async performRefund(id: string) {
    const order: Order = await this.findOne(id);
    if (!order) throw new HttpException('Order not found', 404);
    order.refunded = 'initiated';
    order.refund_status = 'started'; // should be an enum but idc
    await order.save();
    return {
      orderId: order._id,
      timestamp: order.createdAt,
      stacId: order.stacId,
      refunded: order.refunded,
      refund_status: order.refund_status,
    };
  }

  async approveRefund(id: string) {
    const order: Order = await this.findOne(id);
    if (!order) throw new HttpException('Order not found', 400);
    order.refunded = 'true';
    order.refund_status = 'completed'; // should be an enum but idc
    await order.save();
    return {
      orderId: order._id,
      timestamp: order.createdAt,
      stacId: order.stacId,
      refunded: order.refunded,
      refund_status: order.refund_status,
    };
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
