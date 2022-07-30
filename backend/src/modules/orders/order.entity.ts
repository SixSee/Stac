import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { UserEntity } from '../auth/auth.entity';

export interface Order extends Document {
  id: string;
}

export const OrderEntity = new mongoose.Schema({}, { timestamps: true });

UserEntity.virtual('id').get(function () {
  return this._id.toHexString();
});
// Ensure virtual fields are serialised.
UserEntity.set('toJSON', {
  virtuals: true,
});
