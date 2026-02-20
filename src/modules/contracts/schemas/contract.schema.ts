import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ContractStatus } from '../../../common/enums/contract-status.enum';

export type ContractDocument = Contract & Document;

@Schema({ timestamps: true })
export class Contract {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  tenant: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  room: Types.ObjectId;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  monthlyRent: number;

  @Prop({ required: true })
  deposit: number;

  @Prop({
    enum: ContractStatus,
    default: ContractStatus.ACTIVE,
  })
  status: ContractStatus;

  @Prop()
  notes?: string;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
