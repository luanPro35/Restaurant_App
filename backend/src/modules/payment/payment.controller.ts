import { Controller, Post, Body, Get, Param, Patch, HttpCode, HttpStatus, Query, Delete } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { CreatePaymentDto } from "./payment.dto";

@Controller("payments")
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
        return this.paymentService.create(createPaymentDto);
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