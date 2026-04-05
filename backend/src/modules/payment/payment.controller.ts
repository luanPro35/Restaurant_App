import { Controller, Post, Body, Get, Param, Patch, HttpCode, HttpStatus, Query, Delete, UseInterceptors, UploadedFile } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./payment.dto";
import { FileInterceptor } from "@nestjs/platform-express";

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

    @Get("order/:orderId")
    async getPaymentByOrderId(@Param("orderId") orderId: string) {
        return this.paymentService.findByOrderId(orderId);
    }

    @Get()
    async getAllPayments(@Query() query: any) {
        return this.paymentService.findAll(query);
    }

    @Get(":id")
    async getPaymentById(@Param("id") id: string) {
        return this.paymentService.findById(id);
    }

    @Get("total-amount-today")
    async getTotalAmountToday() {
        return this.paymentService.totalAmountToday();
    }

    @Get("total-package-today")
    async getTotalPackageToday() {
        return this.paymentService.totalPackageToday();
    }
}