import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  // 🔹 สร้าง invoice
  @Post()
  @Roles(Role.ADMIN, Role.STAFF)
  create(@Body() dto: CreateInvoiceDto) {
    return this.invoicesService.create(dto);
  }

  // 🔹 ดู invoice ทั้งหมด (รองรับ pagination + filter)
  @Get()
  @Roles(Role.ADMIN, Role.STAFF)
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.invoicesService.findAll(
      +page,
      +limit,
      status,
      month ? +month : undefined,
      year ? +year : undefined,
    );
  }

  // 🔹 ดู invoice รายตัว
  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  findById(@Param('id') id: string) {
    return this.invoicesService.findById(id);
  }

  // 🔹 Mark เป็นจ่ายแล้ว
  @Patch(':id/pay')
  @Roles(Role.ADMIN, Role.STAFF)
  markAsPaid(@Param('id') id: string) {
    return this.invoicesService.markAsPaid(id);
  }
}
