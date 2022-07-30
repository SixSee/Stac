import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { UserEntity } from '../auth/auth.entity';

export interface Item extends Document {
  id: string;
  name: string;
  description: string;
  price: string;
  publicKey: string;
  privateKey: string;
  createdAt: string;
  updatedAt: string;
}

export const ItemEntity = new mongoose.Schema(
  {
    name: { type: String },
    description: { type: String },
    price: { type: String },
    publicKey: { type: String },
    privateKey: { type: String },
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
