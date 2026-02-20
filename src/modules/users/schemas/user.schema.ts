import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../../../common/enums/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: Role, default: Role.TENANT })
  role: Role;

  @Prop({
    type: {
      fullName: String,
      phone: String,
      idCardNumber: String,
      avatarUrl: String,
    },
  })
  profile: {
    fullName: string;
    phone: string;
    idCardNumber: string;
    avatarUrl: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
