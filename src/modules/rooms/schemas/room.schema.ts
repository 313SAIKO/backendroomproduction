import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoomStatus } from '../../../common/enums/room-status.enum';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
  @Prop({ required: true, unique: true })
  roomNumber: string;

  @Prop({ required: true })
  floor: number;

  @Prop({ required: true })
  roomType: string;

  @Prop({
    type: {
      daily: Number,
      monthly: Number,
    },
    required: true,
  })
  prices: {
    daily: number;
    monthly: number;
  };

  @Prop({
    enum: RoomStatus,
    default: RoomStatus.AVAILABLE,
  })
  status: RoomStatus;

  @Prop({ type: Object, default: null })
  currentTenant: any;

  @Prop({
    type: {
      water: Number,
      electric: Number,
      updatedAt: Date,
    },
    default: {
      water: 0,
      electric: 0,
      updatedAt: null,
    },
  })
  lastMeterReading: {
    water: number;
    electric: number;
    updatedAt: Date;
  };
}

export const RoomSchema = SchemaFactory.createForClass(Room);
