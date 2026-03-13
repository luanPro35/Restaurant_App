import { Module, forwardRef } from "@nestjs/common";
import { VietQrController } from "./vietQr.controller";
import { VietQrService } from "./vietQr.service";
import { VietQrRepository } from "./vietQr.repository";
import { PackageModule } from "../package/package.module";

@Module({
    imports: [forwardRef(() => PackageModule)],
    controllers: [VietQrController],
    providers: [VietQrService, VietQrRepository],
    exports: [VietQrService],
})
export class VietQrModule { }