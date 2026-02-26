import { deliveryAddressService } from "../services/Address.service";
import { useState, useEffect, useCallback } from "react";
import { Address, CreateAddressDto } from "../../../services/api/api-address";

export const useAddress = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const initialFormState: CreateAddressDto & { id?: string } = {
    name: "",
    phone: "",
    address: "",
    detail: "",
    type: "HOME",
    isDefault: false,
  };

  const [form, setForm] = useState(initialFormState);

  const resetForm = useCallback(() => {
    setForm(initialFormState);
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await deliveryAddressService.getSavedAddresses();
      setAddresses(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addAddress = async () => {
    try {
      setLoading(true);
      setError(null);
      await deliveryAddressService.addNewAddress(form);
      resetForm();
      await fetchAddresses();
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAddress = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const { id: _, ...data } = form;
      await deliveryAddressService.updateAddress(id, data);
      resetForm();
      await fetchAddresses();
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deliveryAddressService.deleteAddress(id);
      await fetchAddresses();
      return true;
    } catch (err) {
      setError(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Address) => {
    setForm({
      id: item.id,
      name: item.name,
      phone: item.phone,
      address: item.address,
      detail: item.detail || "",
      type: item.type as any,
      isDefault: item.isDefault,
    });
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return {
    addresses,
    loading,
    error,
    form,
    setForm,
    resetForm,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    handleEdit,
  };
};
