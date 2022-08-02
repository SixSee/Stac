import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { CommonGaurd } from '../../gaurds/common.gaurd';
import { SellerGaurd } from '../../gaurds/seller.gaurd';
import { BuyerGaurd } from '../../gaurds/buyer.gaurd';

@Controller('order')
@ApiTags('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(CommonGaurd)
  create(@Body() createOrderDto: CreateOrderDto, @Req() request) {
    return this.ordersService.create(createOrderDto, request.user);
  }

  @Get()
  @UseGuards(CommonGaurd)
  findAll() {
    return this.ordersService.findAll();
  }

  @Post('/approve-transaction/:id')
  @UseGuards(CommonGaurd)
  approveTransaction(@Param('id') id: string) {
    return this.ordersService.approveTransaction(id);
  }

  @Post('refund/:id')
  @UseGuards(CommonGaurd)
  performRefund(@Param('id') id: string) {
    return this.ordersService.performRefund(id);
  }

  @Post('approve_refund/:id')
  @UseGuards(SellerGaurd)
  approveRefund(@Param('id') id: string) {
    return this.ordersService.approveRefund(id);
  }

  @Get('seller_refunded')
  @UseGuards(SellerGaurd)
  findRefundedBySeller(@Req() request) {
    return this.ordersService.findRefundedBySeller(request.user);
  }

  @Get('buyer_refunded')
  @UseGuards(BuyerGaurd)
  findRefundedByBuyer(@Req() request) {
    return this.ordersService.findRefundedByBuyer(request.user);
  }

  @Get('seller_completed_refunded')
  @UseGuards(SellerGaurd)
  findCompletedRefundsBySeller(@Req() request) {
    return this.ordersService.findRefundedBySeller(request.user);
  }

  @Get('buyer_completed_refunded')
  @UseGuards(BuyerGaurd)
  findCompletedRefundsByBuyer(@Req() request) {
    return this.ordersService.findRefundedByBuyer(request.user);
  }

  @Get('buyer_list')
  @UseGuards(BuyerGaurd)
  findAllByBuyer(@Req() request) {
    return this.ordersService.findAllByBuyer(request.user);
  }

  @Get(':id')
  @UseGuards(CommonGaurd)
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(SellerGaurd)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
