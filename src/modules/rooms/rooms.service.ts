import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { RoomStatus } from '../../common/enums/room-status.enum';

@Injectable()
export class RoomsService {
  constructor(
    @InjectModel(Room.name)
    private roomModel: Model<RoomDocument>,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const existing = await this.roomModel.findOne({
      roomNumber: createRoomDto.roomNumber,
    });

    if (existing) {
      throw new ConflictException('Room number already exists');
    }

    return this.roomModel.create(createRoomDto);
  }

  async findAll(status?: RoomStatus, page = 1, limit = 10) {
    const query: any = {};

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.roomModel.find(query).skip(skip).limit(limit),
      this.roomModel.countDocuments(query),
    ]);

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async findOne(id: string) {
    const room = await this.roomModel.findById(id);

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return room;
  }

  // 🔥 เพิ่มอันนี้
  async occupyRoom(roomId: string, tenantId: string) {
    return this.roomModel.findByIdAndUpdate(roomId, {
      status: RoomStatus.OCCUPIED,
      currentTenant: tenantId,
    });
  }

  // 🔥 เพิ่มอันนี้ (ไว้ใช้ตอน terminate)
  async releaseRoom(roomId: string) {
    return this.roomModel.findByIdAndUpdate(roomId, {
      status: RoomStatus.AVAILABLE,
      currentTenant: null,
    });
  }
}
