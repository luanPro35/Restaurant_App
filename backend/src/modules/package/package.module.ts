import { Module } from "@nestjs/common";
import { PackageService } from "./package.service";
import { PackageController } from "./package.controller";
import { PackageRepository } from "./package.repository";

@Module({
    controllers: [PackageController],
    providers: [PackageService, PackageRepository],
    exports: [PackageService],
})
export class PackageModule { }
