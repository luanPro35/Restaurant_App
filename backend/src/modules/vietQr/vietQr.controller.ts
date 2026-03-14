import { Controller, Post, Body, Get, Param } from "@nestjs/common";
import { VietQrService } from "./vietQr.service";
import { CreateVietQrDto } from "./dtos/create-vietQr.dto";

@Controller('vietqr')
export class VietQrController {
    constructor(private readonly vietQrService: VietQrService) { }

    @Post()
    async createVietQr(@Body() data: CreateVietQrDto) {
        return this.vietQrService.createVietQr(data);
    }

    @Post('package/:packageId')
    async createQrForPackage(@Param('packageId') packageId: string) {
        return this.vietQrService.createQrForPackage(packageId);
    }

    @Post('order/:orderId')
    async createQrForOrder(@Param('orderId') orderId: string) {
        return this.vietQrService.createQrForOrder(orderId);
    }

    @Get(':id')
    async getVietQrById(@Param('id') id: string) {
        return this.vietQrService.getVietQrById(id);
    }

    @Get('order/:orderId')
    async getVietQrByOrderId(@Param('orderId') orderId: string) {
        return this.vietQrService.getVietQrByOrderId(orderId);
    }

    @Get('package/:packageId')
    async getVietQrByPackageId(@Param('packageId') packageId: string) {
        return this.vietQrService.getVietQrByPackageId(packageId);
    }
}