import { Injectable, NotFoundException } from "@nestjs/common";
import { PackageRepository } from "./package.repository";
import { CreatePackageDto, UpdatePackageDto } from "./package.dto";
import { createPackageSchema, updatePackageSchema } from "./package.validation";

@Injectable()
export class PackageService {
    constructor(private readonly packageRepository: PackageRepository) { }

    async create(data: CreatePackageDto) {
        const validatedData = createPackageSchema.parse(data);
        return this.packageRepository.create(validatedData as CreatePackageDto);
    }

    async findAll() {
        return this.packageRepository.findAll();
    }

    async findOne(id: string) {
        const pkg = await this.packageRepository.findById(id);
        if (!pkg) {
            throw new NotFoundException(`Package with ID ${id} not found`);
        }
        return pkg;
    }

    async update(id: string, data: UpdatePackageDto) {
        await this.findOne(id);
        const validatedData = updatePackageSchema.parse(data);
        return this.packageRepository.update(id, validatedData as UpdatePackageDto);
    }

    async delete(id: string) {
        await this.findOne(id);
        return this.packageRepository.delete(id);
    }
}
