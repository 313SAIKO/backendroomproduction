import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { Room, RoomSchema } from '../rooms/schemas/room.schema';
import { Contract, ContractSchema } from '../contracts/schemas/contract.schema';
import { Invoice, InvoiceSchema } from '../invoices/schemas/invoice.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: Contract.name, schema: ContractSchema },
      { name: Invoice.name, schema: InvoiceSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}