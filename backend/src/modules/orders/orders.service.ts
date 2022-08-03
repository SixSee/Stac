import { HttpException, Injectable } from '@nestjs/common';
import { CreateOrderDto, VerifyOrderDto } from './dto/create-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './order.entity';
import { ItemsService } from '../items/items.service';
import { Item } from '../items/item.entity';
import { AuthService } from '../auth/auth.service';
import { ethers } from 'ethers';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private order: Model<Order>,
    private readonly itemService: ItemsService,
    private readonly userService: AuthService,
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

  async approveTransaction(id: string) {
    const order: Order = await this.findOne(id);
    if (!order) throw new HttpException('Order not found', 404);
    order.transactionApproved = true;
    await order.save();
    return { signing_message: this.createSignMessage(order) };
  }

  async storeSignedMessage(id: string, signedMessage: string) {
    const order: Order = await this.findOne(id);
    if (!order) throw new HttpException('Order not found', 404);
    order.signedMessage = signedMessage;
    await order.save();
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

  findAllByBuyer(user) {
    return this.order
      .find({ buyer: user.id, transactionApproved: true })
      .populate('buyer')
      .populate('seller')
      .populate('itemId');
  }

  findAllBySeller(user) {
    return this.order
      .find({ seller: user.id, transactionApproved: true })
      .populate('buyer')
      .populate('seller')
      .populate('itemId');
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

  async verifyStacIdAndUser(orderId: string, verifyDTO: VerifyOrderDto) {
    const order: Order = await this.findOne(orderId);
    if (!order) throw new HttpException('Order not found', 404);
    const jwt_user = await this.userService.verifyUnameAndPasswd(
      verifyDTO.username,
      verifyDTO.password,
    );
    if (order.signedMessage != verifyDTO.token)
      throw new HttpException('Wrong Token, Cheating...', 400);
    //Verify signed message using etherJs
    const userWalletAddress = ethers.utils
      .verifyMessage(this.createSignMessage(order), verifyDTO.token)
      .toLowerCase();
    if (userWalletAddress != jwt_user.user.walletAddress)
      throw new HttpException('Wrong Token, Cheating...', 400);
    // return {
    //   accessToken: jwt_user.jwtToken,
    //   user: {
    //     name: jwt_user.user.fullName,
    //     username: jwt_user.user.username,
    //     role: jwt_user.user.role,
    //   },
    // };
    return { stacId: order.stacId };
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

  createSignMessage(order: Order) {
    const itemId = order.itemId['_id'];
    const buyer = order.buyer['_id'];
    return `${order.stacId}:${itemId}:${buyer}`;
  }
}
