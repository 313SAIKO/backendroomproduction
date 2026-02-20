import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { RoomStatus } from '../../common/enums/room-status.enum';

@Controller('rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  // 🔥 สร้างห้อง - admin เท่านั้น
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  // 🔥 ดูห้อง - admin / staff
  @Get()
  @Roles(Role.ADMIN, Role.STAFF)
  findAll(
    @Query('status') status?: RoomStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.roomsService.findAll(status, Number(page), Number(limit));
  }

  // 🔥 ดูห้องตาม id
  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(id);
  }
}
