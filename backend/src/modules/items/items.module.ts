import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemEntity } from './item.entity';

@Module({
  imports: [MongooseModule.forFeature([{ schema: ItemEntity, name: 'Item' }])],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
