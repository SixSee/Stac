import { HttpException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item } from './item.entity';

@Injectable()
export class ItemsService {
  constructor(@InjectModel('Item') private item: Model<Item>) {}

  async create(createItemDto: CreateItemDto) {
    const newItem = new this.item(createItemDto);
    //extra fields to populate for order
    await newItem.save();
    throw new HttpException('Success', 200);
  }

  findAll() {
    return this.item.find({});
  }

  findOne(id: string) {
    return this.item.findOne({ _id: id });
  }

  async update(id: string, updateItemDto: UpdateItemDto) {
    const item: Item = await this.item.findOne({ _id: id });
    if (!item) throw new HttpException('Item not found', 404);
    //Update fields
    //await item.save()
    throw new HttpException('Success', 200);
  }

  async remove(id: string) {
    await this.item.deleteOne({ _id: id });
    throw new HttpException('Success', 200);
  }
}
