import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { ContractsService } from '../contracts/contracts.service';
import { InvoiceStatus } from '../../common/enums/invoice-status.enum';
import { ContractStatus } from '../../common/enums/contract-status.enum';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name)
    private invoiceModel: Model<InvoiceDocument>,
    private contractsService: ContractsService,
  ) {}

  async create(dto: CreateInvoiceDto) {
    if (dto.month < 1 || dto.month > 12) {
      throw new BadRequestException('Invalid month');
    }

    if (dto.year < 2000) {
      throw new BadRequestException('Invalid year');
    }

    const contract: any =
      await this.contractsService.findById(dto.contract);

    if (contract.status !== ContractStatus.ACTIVE) {
      throw new BadRequestException(
        'Contract is not active',
      );
    }

    if (!contract.monthlyRent) {
      throw new BadRequestException(
        'Contract rent not defined',
      );
    }

    const existing = await this.invoiceModel.findOne({
      contract: dto.contract,
      month: dto.month,
      year: dto.year,
    });

    if (existing) {
      throw new BadRequestException(
        'Invoice for this month already exists',
      );
    }

    const WATER_RATE = 20;
    const ELECTRIC_RATE = 8;

    const lastInvoice = await this.invoiceModel
      .findOne({ contract: dto.contract })
      .sort({ createdAt: -1 });

    const lastWater =
      lastInvoice?.meterReading?.water ?? 0;
    const lastElectric =
      lastInvoice?.meterReading?.electric ?? 0;

    const waterUnits = dto.waterMeter - lastWater;
    const electricUnits =
      dto.electricMeter - lastElectric;

    if (waterUnits < 0 || electricUnits < 0) {
      throw new BadRequestException(
        'Meter reading invalid',
      );
    }

    const waterCost = waterUnits * WATER_RATE;
    const electricCost =
      electricUnits * ELECTRIC_RATE;

    const rent = contract.monthlyRent;
    const total =
      waterCost + electricCost + rent;

    return this.invoiceModel.create({
      contract: dto.contract,
      month: dto.month,
      year: dto.year,
      meterReading: {
        water: dto.waterMeter,
        electric: dto.electricMeter,
      },
      breakdown: {
        waterUnits,
        electricUnits,
        waterCost,
        electricCost,
        rent,
        total,
      },
      status: InvoiceStatus.UNPAID,
    });
  }

  // 🔥 Pagination + Filter Version
  async findAll(
    page = 1,
    limit = 10,
    status?: string,
    month?: number,
    year?: number,
  ) {
    const query: any = {};

    if (status) query.status = status;
    if (month) query.month = month;
    if (year) query.year = year;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.invoiceModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'contract',
          populate: [
            { path: 'tenant', select: '-password' },
            { path: 'room' },
          ],
        }),
      this.invoiceModel.countDocuments(query),
    ]);

    return {
      total,
      page,
      limit,
      data,
    };
  }

  async findById(id: string) {
    const invoice = await this.invoiceModel
      .findById(id)
      .populate({
        path: 'contract',
        populate: [
          { path: 'tenant', select: '-password' },
          { path: 'room' },
        ],
      });

    if (!invoice) {
      throw new NotFoundException(
        'Invoice not found',
      );
    }

    return invoice;
  }

  async markAsPaid(id: string) {
    const invoice = await this.invoiceModel.findById(
      id,
    );

    if (!invoice) {
      throw new NotFoundException(
        'Invoice not found',
      );
    }

    if (invoice.status === InvoiceStatus.PAID) {
      throw new BadRequestException(
        'Invoice already paid',
      );
    }

    invoice.status = InvoiceStatus.PAID;
    await invoice.save();

    return {
      message: 'Invoice marked as paid',
    };
  }
}
