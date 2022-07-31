import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { UserEntity } from '../auth/auth.entity';

export interface Order extends Document {
  id: string;
  buyer: string;
  seller: string;
  itemId: string;
  stacId: string;
  qr_code: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export enum OrderStatus {}
export const OrderEntity = new mongoose.Schema(
  {
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    qr_code: { type: String },
    stacId: { type: String },
    status: { type: String, enum: OrderStatus },
  },
  { timestamps: true },
);

UserEntity.virtual('id').get(function () {
  return this._id.toHexString();
});
// Ensure virtual fields are serialised.
UserEntity.set('toJSON', {
  virtuals: true,
});