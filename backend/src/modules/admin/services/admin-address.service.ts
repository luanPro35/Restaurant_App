import { Injectable, NotFoundException } from "@nestjs/common";
import { AdminAddressRepository } from "../repositories/admin-address.repository";
import { CreateAddressDto, UpdateAddressDto } from "../dtos/admin-address.dto";

@Injectable()
export class AdminAddressService {
  constructor(private readonly addressRepository: AdminAddressRepository) {}

  async create(userId: string, createAddressDto: CreateAddressDto) {
    return this.addressRepository.create(userId, createAddressDto);
  }

  async findAll(userId: string) {
    return this.addressRepository.findAll(userId);
  }

  async findOne(id: string) {
    const address = await this.addressRepository.findOne(id);
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    return address;
  }

  async update(id: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.addressRepository.update(id, updateAddressDto);
    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
    return address;
  }

  async remove(id: string) {
    try {
      return await this.addressRepository.remove(id);
    } catch (error) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
  }
}
