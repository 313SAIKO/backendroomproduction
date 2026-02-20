import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Get,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('contracts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  // 🔹 สร้างสัญญา (admin เท่านั้น)
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateContractDto) {
    return this.contractsService.create(dto);
  }

  // 🔹 ดูสัญญาทั้งหมด (admin + staff)
  @Get()
  @Roles(Role.ADMIN, Role.STAFF)
  findAll() {
    return this.contractsService.findAll();
  }

  // 🔹 ยกเลิกสัญญา (admin เท่านั้น)
  @Patch(':id/terminate')
  @Roles(Role.ADMIN)
  terminate(@Param('id') id: string) {
    return this.contractsService.terminate(id);
  }
}
