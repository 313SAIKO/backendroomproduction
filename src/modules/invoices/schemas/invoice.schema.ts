import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { InvoiceStatus } from '../../../common/enums/invoice-status.enum';

export type InvoiceDocument = Invoice & Document;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: Types.ObjectId, ref: 'Contract', required: true })
  contract: Types.ObjectId;

  @Prop({ required: true })
  month: number;

  @Prop({ required: true })
  year: number;

  @Prop({
    type: {
      water: Number,
      electric: Number,
    },
    required: true,
  })
  meterReading: {
    water: number;
    electric: number;
  };

  @Prop({
    type: {
      waterUnits: Number,
      electricUnits: Number,
      waterCost: Number,
      electricCost: Number,
      rent: Number,
      total: Number,
    },
    required: true,
  })
  breakdown: {
    waterUnits: number;
    electricUnits: number;
    waterCost: number;
    electricCost: number;
    rent: number;
    total: number;
  };

  @Prop({
    enum: InvoiceStatus,
    default: InvoiceStatus.UNPAID,
  })
  status: InvoiceStatus;
}

export const InvoiceSchema =
  SchemaFactory.createForClass(Invoice);
