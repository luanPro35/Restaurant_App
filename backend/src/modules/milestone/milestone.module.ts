import { Module } from "@nestjs/common";
import { MilestoneService } from "./milestone.service";
import { MilestoneController } from "./milestone.controller";
import { MilestoneRepository } from "./milestone.repository";
import { PrismaModule } from "../../prisma/prisma.module";
import { OrderModule } from "../order/order.module";
import { PackageModule } from "../package/package.module";

@Module({
  imports: [PrismaModule, OrderModule, PackageModule],
  providers: [MilestoneService, MilestoneRepository],
  controllers: [MilestoneController],
  exports: [MilestoneService],
})
export class MilestoneModule {}
