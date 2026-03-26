import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategorisDocument = HydratedDocument<Categoris>;

export enum CategorisType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

@Schema({ timestamps: true, collection: 'categoris' })
export class Categoris {
  @Prop({ required: true, trim: true })
  name: string;
  @Prop({ required: true })
  icon: string;
  @Prop({ type: String, enum: Object.values(CategorisType) })
  type: CategorisType;
  @Prop({ type: Types.ObjectId, ref: 'Space', default: null })
  spaceId: Types.ObjectId;
  @Prop({ default: false })
  isSystem: boolean;
}

export const CategorisSchema = SchemaFactory.createForClass(Categoris);
