import { Module } from "@nestjs/common";
import { TableController } from "./Table.controller";
import { AdminModule } from "../admin/admin.module";

@Module({
  imports: [AdminModule],
  controllers: [TableController],
  providers: [],
})
export class TableModule {}
