import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { AdminProductRepository } from "../repositories/admin-products.repository";
import {
  createProductSchema,
  updateProductSchema,
  getProductsSchema,
  getProductByIdSchema,
  deleteProductSchema,
  toggleAvailabilitySchema,
} from "../../product/validations/product.validation";

@Injectable()
export class AdminProductService {
  private readonly logger = new Logger(AdminProductService.name);

  constructor(
    private readonly adminProductRepository: AdminProductRepository,
  ) {}

  async createProduct(data: any) {
    try {
      const validatedData = createProductSchema.parse(data);
      return await this.adminProductRepository.create(validatedData as any);
    } catch (error) {
      this.logger.error("Validation failed for creating product:", error);
      if (error instanceof Error && "issues" in error) {
        throw new BadRequestException((error as any).issues);
      }
      throw error;
    }
  }

  async getAllProducts(query: any) {
    try {
      const validatedQuery = getProductsSchema.parse(query);
      const products = await this.adminProductRepository.findAll(
        validatedQuery as any,
      );
      const total = await this.adminProductRepository.count(
        validatedQuery as any,
      );

      return {
        data: products,
        pagination: {
          total,
          page: Number(validatedQuery.page) || 1,
          limit: Number(validatedQuery.limit) || 10,
          totalPages: Math.ceil(total / (Number(validatedQuery.limit) || 10)),
        },
      };
    } catch (error) {
      this.logger.error("Validation failed for getting products:", error);
      throw error;
    }
  }

  async getProductById(id: string) {
    getProductByIdSchema.parse({ id });
    const product = await this.adminProductRepository.findById(id);
    if (!product) {
      throw new NotFoundException("Không tìm thấy sản phẩm");
    }
    return product;
  }

  async updateProduct(id: string, data: any) {
    try {
      await this.getProductById(id);
      const validatedData = updateProductSchema.parse(data);
      return await this.adminProductRepository.update(id, validatedData as any);
    } catch (error) {
      this.logger.error("Validation failed for updating product:", error);
      throw error;
    }
  }

  async deleteProduct(id: string) {
    deleteProductSchema.parse({ id });
    await this.getProductById(id);
    return this.adminProductRepository.delete(id);
  }

  async toggleAvailability(id: string, isAvailable: boolean) {
    const validated = toggleAvailabilitySchema.parse({ id, isAvailable });
    await this.getProductById(validated.id);
    return this.adminProductRepository.updateAvailability(
      validated.id,
      validated.isAvailable,
    );
  }
}
