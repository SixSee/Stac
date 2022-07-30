import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderEntity } from './order.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: OrderEntity, name: 'Order' }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
