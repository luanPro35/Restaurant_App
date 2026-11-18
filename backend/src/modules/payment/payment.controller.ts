import { Controller, Post, Body, Get, Param, Patch, HttpCode, HttpStatus, Query, Delete, UseInterceptors, UploadedFile, UseGuards } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./payment.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/role.enum";

@Controller("payments")
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
        return this.paymentService.create(createPaymentDto);
    }

    @Post("upload-receipt")
    @UseInterceptors(FileInterceptor("file"))
    async uploadReceipt(
        @UploadedFile() file: Express.Multer.File,
        @Body("orderId") orderId?: string,
        @Body("packageId") packageId?: string
    ) {
        return this.paymentService.uploadReceipt(file, orderId, packageId);
    }

    @Get("total-amount")
    async getTotalAmount() {
        return this.paymentService.totalAmount();
    }

    @Get("total-amount-today")
    async getTotalAmountToday() {
        return this.paymentService.totalAmountToday();
    }

    @Get("total-package-today")
    async getTotalPackageToday() {
        return this.paymentService.totalPackageToday();
    }

    @Get("analytics")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.STAFF)
    async getAnalytics(@Query("period") period?: string) {
        return this.paymentService.getAnalytics(period);
    }

    @Get("order/:orderId")
    async getPaymentByOrderId(@Param("orderId") orderId: string) {
        return this.paymentService.findByOrderId(orderId);
    }

    @Get()
    async getAllPayments(@Query() query: any) {
        return this.paymentService.findAll(query);
    }

    @Get("test-telegram")
    async testTelegram(@Query("message") message?: string) {
        const result = await this.paymentService.testTelegram(message);
        return {
            success: true,
            message: "Đã gửi thông báo thử nghiệm tới Telegram!",
            result
        };
    }

    @Get("check-status")
    async checkStatus(
        @Query("packageId") packageId?: string,
        @Query("orderId") orderId?: string
    ) {
        return this.paymentService.checkPaymentStatus(packageId, orderId);
    }

    @Get(":id")
    async getPaymentById(@Param("id") id: string) {
        return this.paymentService.findById(id);
    }

    @Post("webhook/sepay")
    @HttpCode(HttpStatus.OK)
    async handleSepayWebhook(@Body() sepayData: any) {
        return this.paymentService.handleSepayWebhook(sepayData);
    }
}
