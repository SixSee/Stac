import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderEntity } from './order.entity';
import { AuthModule } from '../auth/auth.module';
import { ItemsModule } from '../items/items.module';

@Module({
  imports: [
    AuthModule,
    ItemsModule,
    MongooseModule.forFeature([{ schema: OrderEntity, name: 'Order' }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
