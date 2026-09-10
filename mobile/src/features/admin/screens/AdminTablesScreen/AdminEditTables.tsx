import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AdminStackParamList } from "@/app/navigation/AdminNavigator";
import { useAdminTable } from "../../hooks/useAdminTable";
import { productApi } from "../../../../services/api/apiProducts";
import { orderApi } from "../../../../services/api/api-order";

import {
  TableOrderItem,
  ProductItemData,
  getProductImage,
} from "./components/table.types";
import TableBasicInfoCard from "./components/TableBasicInfoCard";
import TableOrderDetailsCard from "./components/TableOrderDetailsCard";
import FoodPickerModal from "./components/FoodPickerModal";

type AdminEditTablesRouteProp = RouteProp<
  AdminStackParamList,
  "AdminEditTables"
>;

const AdminEditTables = () => {
  const navigation = useNavigation();
  const route = useRoute<AdminEditTablesRouteProp>();
  const { table } = route.params;
  const { updateTable, getActiveOrderForTable, loadingOrder } = useAdminTable();

  // Thông tin cơ bản
  const [name, setName] = useState(table.name);
  const [capacity, setCapacity] = useState(table.capacity.toString());

  // Danh sách món ăn của bàn
  const [orderItems, setOrderItems] = useState<TableOrderItem[]>([]);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Modal thực đơn
  const [modalVisible, setModalVisible] = useState(false);
  const [products, setProducts] = useState<ProductItemData[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // 1. Tải đơn hàng hiện tại của bàn
  useEffect(() => {
    const fetchActiveOrder = async () => {
      const activeOrder = await getActiveOrderForTable(table.id);
      if (activeOrder && activeOrder.items && activeOrder.items.length > 0) {
        setActiveOrderId(activeOrder.id);
        const mappedItems: TableOrderItem[] = activeOrder.items.map((item: any) => ({
          productId: item.productId || item.id,
          name: item.name || "Món ăn",
          price: item.price || 0,
          quantity: item.quantity || 1,
          image: getProductImage(item),
          isNew: false,
        }));
        setOrderItems(mappedItems);
      } else if (table.listFoods && table.listFoods.length > 0) {
        const parsedItems: TableOrderItem[] = table.listFoods.map(
          (foodStr: string, idx: number) => {
            const match = foodStr.match(/^(.+)\s*\(x(\d+)\)$/i);
            if (match) {
              return {
                productId: `legacy-${idx}`,
                name: match[1].trim(),
                quantity: parseInt(match[2], 10) || 1,
                price: Math.round((table.price || 0) / table.listFoods.length),
                isNew: false,
              };
            }
            return {
              productId: `legacy-${idx}`,
              name: foodStr,
              quantity: 1,
              price: Math.round((table.price || 0) / table.listFoods.length),
              isNew: false,
            };
          }
        );
        setOrderItems(parsedItems);
      }
    };

    fetchActiveOrder();
  }, [table.id, getActiveOrderForTable]);

  // 2. Tải thực đơn từ backend khi mở modal
  const fetchMenuProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await productApi.getAll({ isAvailable: true, limit: 100 });
      const productList = res?.data || res || [];
      setProducts(Array.isArray(productList) ? productList : []);
    } catch (error) {
      console.error("Lỗi khi tải thực đơn:", error);
      Alert.alert("Lỗi", "Không thể tải danh sách thực đơn món ăn.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleOpenAddModal = () => {
    setModalVisible(true);
    if (products.length === 0) {
      fetchMenuProducts();
    }
  };

  // 3. Thao tác thêm, sửa, xóa món
  const handleAddProductToTable = (prod: ProductItemData) => {
    const imageUri = getProductImage(prod);
    setOrderItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === prod.id || item.name === prod.name
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
          image: updated[existingIndex].image || imageUri,
          isNew: true,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            productId: prod.id,
            name: prod.name,
            price: prod.price,
            quantity: 1,
            image: imageUri,
            isNew: true,
          },
        ];
      }
    });
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    setOrderItems((prev) => {
      const updated = [...prev];
      const newQty = updated[index].quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      updated[index] = { ...updated[index], quantity: newQty, isNew: true };
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalPrice = useMemo(() => {
    return orderItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
  }, [orderItems]);

  // 4. Lưu toàn bộ thay đổi
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const formattedListFoods = orderItems.map(
        (item) => `${item.name} (x${item.quantity})`
      );

      await updateTable(table.id, {
        name,
        capacity: parseInt(capacity, 10) || table.capacity,
        listFoods: formattedListFoods,
        price: totalPrice,
        status: orderItems.length > 0 ? "OCCUPIED" : "AVAILABLE",
      });

      const newItemsToAdd = orderItems
        .filter((item) => item.isNew && !item.productId.startsWith("legacy-"))
        .map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        }));

      if (newItemsToAdd.length > 0) {
        if (activeOrderId) {
          await orderApi.addItemsToOrder(activeOrderId, newItemsToAdd);
        } else {
          await orderApi.createOrder({
            tableId: table.id,
            items: newItemsToAdd,
          });
        }
      }

      Alert.alert(
        "Thành công",
        "Đã cập nhật thông tin bàn và thực đơn món ăn cho khách!",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error("Lỗi khi lưu bàn:", error);
      Alert.alert("Lỗi", "Không thể lưu thay đổi. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      {/* HEADER */}
      <View className="px-6 pt-14 pb-4 bg-[#FDFCF7]">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white shadow-sm rounded-xl items-center justify-center border border-gray-100"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color="#1F2937"
            />
          </TouchableOpacity>
          <Text className="text-xl font-black text-gray-800">
            Sửa thông tin bàn
          </Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* KHỐI 1: THÔNG TIN CƠ BẢN */}
        <TableBasicInfoCard
          name={name}
          onChangeName={setName}
          capacity={capacity}
          onChangeCapacity={setCapacity}
        />

        {/* KHỐI 2: CHI TIẾT ĐƠN HÀNG & MÓN ĂN */}
        <TableOrderDetailsCard
          orderItems={orderItems}
          loadingOrder={loadingOrder}
          totalPrice={totalPrice}
          onOpenAddModal={handleOpenAddModal}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
        />

        {/* NÚT THAO TÁC HỦY / LƯU */}
        <View className="flex-row justify-between mb-8">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            disabled={saving}
            className="flex-1 mr-3 bg-gray-100 py-4 rounded-2xl items-center justify-center border border-gray-200"
          >
            <Text className="text-gray-700 font-bold text-sm">Hủy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSaveAll}
            disabled={saving}
            activeOpacity={0.85}
            className="flex-[2] rounded-2xl overflow-hidden shadow-md shadow-orange-500/20"
          >
            <LinearGradient
              colors={["#E07B39", "#C96A2E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 items-center justify-center flex-row"
            >
              {saving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="content-save-check"
                    size={20}
                    color="white"
                  />
                  <Text className="text-white font-black text-base ml-2">
                    Lưu thay đổi
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL THỰC ĐƠN */}
      <FoodPickerModal
        visible={modalVisible}
        products={products}
        loadingProducts={loadingProducts}
        orderItems={orderItems}
        onClose={() => setModalVisible(false)}
        onAddProduct={handleAddProductToTable}
      />
    </View>
  );
};

export default AdminEditTables;
