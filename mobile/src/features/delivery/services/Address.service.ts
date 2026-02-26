import addressApi, {
  CreateAddressDto,
  Address,
} from "../../../services/api/api-address";

export const deliveryAddressService = {
  getSavedAddresses: async (): Promise<Address[]> => {
    try {
      return await addressApi.findAll();
    } catch (error) {
      throw error;
    }
  },

  addNewAddress: async (data: CreateAddressDto): Promise<Address> => {
    try {
      return await addressApi.create(data);
    } catch (error) {
      throw error;
    }
  },

  updateAddress: async (
    id: string,
    data: Partial<CreateAddressDto>,
  ): Promise<Address> => {
    try {
      return await addressApi.update(id, data);
    } catch (error) {
      throw error;
    }
  },

  deleteAddress: async (id: string): Promise<void> => {
    try {
      await addressApi.remove(id);
    } catch (error) {
      throw error;
    }
  },
};

export default deliveryAddressService;
