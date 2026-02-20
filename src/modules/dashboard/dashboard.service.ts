import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room, RoomDocument } from '../rooms/schemas/room.schema';
import { Contract, ContractDocument } from '../contracts/schemas/contract.schema';
import { Invoice, InvoiceDocument } from '../invoices/schemas/invoice.schema';
import { RoomStatus } from '../../common/enums/room-status.enum';
import { ContractStatus } from '../../common/enums/contract-status.enum';
import { InvoiceStatus } from '../../common/enums/invoice-status.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Room.name)
    private roomModel: Model<RoomDocument>,

    @InjectModel(Contract.name)
    private contractModel: Model<ContractDocument>,

    @InjectModel(Invoice.name)
    private invoiceModel: Model<InvoiceDocument>,
  ) {}

  async getSummary() {
    const totalRooms = await this.roomModel.countDocuments();

    const availableRooms =
      await this.roomModel.countDocuments({
        status: RoomStatus.AVAILABLE,
      });

    const occupiedRooms =
      await this.roomModel.countDocuments({
        status: RoomStatus.OCCUPIED,
      });

    const occupancyRate =
      totalRooms === 0
        ? 0
        : (occupiedRooms / totalRooms) * 100;

    const activeContracts =
      await this.contractModel.countDocuments({
        status: ContractStatus.ACTIVE,
      });

    const unpaidInvoices =
      await this.invoiceModel.find({
        status: InvoiceStatus.UNPAID,
      });

    const paidInvoices =
      await this.invoiceModel.find({
        status: InvoiceStatus.PAID,
      });

    const totalUnpaid = unpaidInvoices.reduce(
      (sum, inv) => sum + inv.breakdown.total,
      0,
    );

    const totalRevenue = paidInvoices.reduce(
      (sum, inv) => sum + inv.breakdown.total,
      0,
    );

    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      occupancyRate: Number(occupancyRate.toFixed(2)),
      activeContracts,
      totalUnpaid,
      totalRevenue,
    };
  }
}
