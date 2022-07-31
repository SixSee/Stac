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

  @Post('refund/:id')
  @UseGuards(CommonGaurd)
  performRefund(@Param('id') id: string) {
    return this.ordersService.performRefund(id);
  }

  @Get('refunded_list')
  @UseGuards(BuyerGaurd)
  findRefundedByBuyer(@Req() request) {
    return this.ordersService.findRefundedByBuyer(request.user);
  }

  @Delete(':id')
  @UseGuards(SellerGaurd)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
