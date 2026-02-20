import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contract, ContractDocument } from './schemas/contract.schema';
import { CreateContractDto } from './dto/create-contract.dto';
import { RoomsService } from '../rooms/rooms.service';
import { UsersService } from '../users/users.service';
import { ContractStatus } from '../../common/enums/contract-status.enum';
import { RoomStatus } from '../../common/enums/room-status.enum';

@Injectable()
export class ContractsService {
  constructor(
    @InjectModel(Contract.name)
    private contractModel: Model<ContractDocument>,
    private roomsService: RoomsService,
    private usersService: UsersService,
  ) {}

  async create(dto: CreateContractDto) {
    // 1️⃣ เช็ค tenant
    await this.usersService.findById(dto.tenant);

    // 2️⃣ เช็ค room
    const room = await this.roomsService.findOne(dto.room);

    if (new Date(dto.startDate) >= new Date(dto.endDate)) {
    throw new BadRequestException(
      'End date must be after start date',
    );
  }

    // 3️⃣ เช็ค tenant ไม่มี active contract
    const activeContract = await this.contractModel.findOne({
      tenant: dto.tenant,
      status: ContractStatus.ACTIVE,
    });

    if (activeContract) {
      throw new BadRequestException(
        'Tenant already has active contract',
      );
    }

    // 4️⃣ สร้าง contract
    const contract = await this.contractModel.create({
      ...dto,
      status: ContractStatus.ACTIVE,
    });

    // 5️⃣ update room
    await this.roomsService.occupyRoom(dto.room, dto.tenant);

    return contract;
  }

  async terminate(contractId: string) {
    const contract = await this.contractModel.findById(contractId);

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    if (contract.status !== ContractStatus.ACTIVE) {
      throw new BadRequestException('Contract is not active');
    }

    contract.status = ContractStatus.TERMINATED;
    await contract.save();

    await this.roomsService.releaseRoom(
      contract.room.toString(),
    );

    return {
      message: 'Contract terminated successfully',
    };
  }

  async findAll() {
    return this.contractModel
      .find()
      .populate('tenant', '-password')
      .populate('room');
  }

  // 🔥 เพิ่มอันนี้ (สำคัญมาก)
  async findById(id: string) {
    const contract = await this.contractModel
      .findById(id)
      .populate('tenant', '-password')
      .populate('room');

    if (!contract) {
      throw new NotFoundException('Contract not found');
    }

    return contract;
  }
}
