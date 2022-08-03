import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req, HttpCode,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, VerifyOrderDto } from './dto/create-order.dto';
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

  @Post('/approve-transaction/:id')
  @UseGuards(CommonGaurd)
  approveTransaction(@Param('id') id: string) {
    return this.ordersService.approveTransaction(id);
  }

  @Post('/signed_message/:id')
  @UseGuards(BuyerGaurd)
  storeSignedMessage(@Param('id') id: string, @Req() request) {
    return this.ordersService.storeSignedMessage(
      id,
      request.body['signedMessage'],
    );
  }

  @Post('verify/:id')
  @HttpCode(200)
  loginAndVerifyStacId(
    @Param('id') id: string,
    @Body() verifyStacId: VerifyOrderDto,
  ) {
    return this.ordersService.verifyStacIdAndUser(id, verifyStacId);
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

  @Get('/buyer')
  @UseGuards(BuyerGaurd)
  findAllByBuyer(@Req() request) {
    return this.ordersService.findAllByBuyer(request.user);
  }

  @Get('/seller')
  @UseGuards(SellerGaurd)
  findAllBySeller(@Req() request) {
    return this.ordersService.findAllBySeller(request.user);
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
