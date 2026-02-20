import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contract, ContractSchema } from './schemas/contract.schema';
import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contract.name, schema: ContractSchema },
    ]),
    RoomsModule,
    UsersModule,
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService], // 🔥 เพิ่มบรรทัดนี้
})
export class ContractsModule {}
