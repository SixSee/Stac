import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
  HttpException,
  UploadedFile,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ApiTags } from '@nestjs/swagger';
import { CommonGaurd } from '../../gaurds/common.gaurd';
import { SellerGaurd } from '../../gaurds/seller.gaurd';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import { diskStorage } from 'multer';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

@Controller('item')
@ApiTags('item')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @UseGuards(SellerGaurd)
  create(@Body() createItemDto: CreateItemDto, @Req() request) {
    return this.itemsService.create(createItemDto, request.user);
  }
  @Get('/seller')
  @UseGuards(SellerGaurd)
  getAllItemBySeller(@Req() request) {
    return this.itemsService.getBySeller(request.user);
  }
  @Get()
  @UseGuards(CommonGaurd)
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @UseGuards(CommonGaurd)
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(SellerGaurd)
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  @UseGuards(SellerGaurd)
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }

  @Post('upload')
  @UseGuards(SellerGaurd)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './media/uploads',
        filename: (req, file, cb) => {
          const randomName = crypto.randomBytes(12).toString('hex');
          //Calling the callback passing the random name generated with the original extension name
          cb(null, `${randomName}${path.extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(
          path.extname(file.originalname).toLowerCase(),
        );
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) return cb(null, true);
        else cb(new HttpException('Upload Images Only!', 400), false);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}` };
  }
}
