import { Module } from "@nestjs/common";
import { AdminProductController } from "./controllers/admin-products.controller";
import { AdminProductService } from "./services/admin-products.service";
import { AdminProductRepository } from "./repositories/admin-products.repository";
import { AdminManageUserRepository } from "./repositories/admin-manage_user.repository";
import { ProductModule } from "../product/product.module";
import { AuthModule } from "../auth/modules/auth.module";
import { AdminManageUserController } from "./controllers/admin-manage_user.controller";
import { AdminManageUserService } from "./services/admin-manage_user.service";
import { AdminPromotionController } from "./controllers/admin-promotion.controller";
import { AdminPromotionService } from "./services/admin-promotion.service";
import { AdminPromotionRepository } from "./repositories/admin-promotion.repository";
import { AdminNotificationController } from "./controllers/admin-notification.controller";
import { NotificationController } from "./controllers/notification.controller";
import { AdminNotificationService } from "./services/admin-notification.service";
import { AdminNotificationRepository } from "./repositories/admin-notification.repository";
import { AddressController } from "./controllers/admin-address.controller";
import { AdminAddressService } from "./services/admin-address.service";
import { AdminAddressRepository } from "./repositories/admin-address.repository";

@Module({
  imports: [ProductModule, AuthModule],
  controllers: [
    AdminProductController,
    AdminManageUserController,
    AdminPromotionController,
    AdminNotificationController,
    NotificationController,
    AddressController,
  ],
  providers: [
    AdminProductService,
    AdminProductRepository,
    AdminManageUserRepository,
    AdminManageUserService,
    AdminPromotionService,
    AdminPromotionRepository,
    AdminNotificationService,
    AdminNotificationRepository,
    AdminAddressService,
    AdminAddressRepository,
  ],
  exports: [
    AdminProductService,
    AdminManageUserService,
    AdminPromotionService,
    AdminNotificationService,
    AdminAddressService,
  ],
})
export class AdminModule {}
