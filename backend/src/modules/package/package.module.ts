import { Module } from "@nestjs/common";
import { PackageService } from "./package.service";
import { PackageController } from "./package.controller";
import { PackageRepository } from "./package.repository";
import { PaymentModule } from "../payment/payment.model";

@Module({
    imports: [PaymentModule],
    controllers: [PackageController],
    providers: [PackageService, PackageRepository],
    exports: [PackageService, PackageRepository],
})
export class PackageModule { }
