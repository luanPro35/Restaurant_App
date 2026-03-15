import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AdminStackParamList } from "@/app/navigation/AdminNavigator";
import { useAdminTable } from "../../hooks/useAdminTable";

type AdminEditTablesRouteProp = RouteProp<
  AdminStackParamList,
  "AdminEditTables"
>;

const AdminEditTables = () => {
  const navigation = useNavigation();
  const route = useRoute<AdminEditTablesRouteProp>();
  const { table } = route.params;
  const { updateTable, getActiveOrderForTable, loadingOrder } = useAdminTable();

  const [name, setName] = useState(table.name);
  const [capacity, setCapacity] = useState(table.capacity.toString());
  const [listFoods, setListFoods] = useState(table.listFoods?.join(", ") || "");
  const [price, setPrice] = useState(table.price?.toString() || "0");

  useEffect(() => {
    const fetchActiveOrder = async () => {
      const activeOrder = await getActiveOrderForTable(table.id);
      if (activeOrder) {
        setPrice(activeOrder.totalAmount.toString());
        const foodNames = activeOrder.items
          .map((item: any) => `${item.name} (x${item.quantity})`)
          .join(", ");
        setListFoods(foodNames);
      }
    };

    fetchActiveOrder();
  }, [table.id, getActiveOrderForTable]);

  const handleUpdateTable = () => {
    updateTable(table.id, {
      name,
      capacity: parseInt(capacity),
      listFoods: listFoods?.split(", ").filter((f) => f.length > 0),
      price: parseInt(price),
    });
  };

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      <View className="px-6 pt-14 pb-6 bg-[#FDFCF7]">
        <View className="flex-row items-center justify-between mb-6">
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

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-8 h-8 bg-blue-50 rounded-full items-center justify-center mr-3">
              <MaterialCommunityIcons
                name="information-outline"
                size={18}
                color="#3B82F6"
              />
            </View>
            <Text className="text-gray-800 font-black text-sm uppercase tracking-wider">
              Thông tin cơ bản
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-500 font-bold mb-2 ml-1 text-xs">
              Tên bàn
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4">
              <MaterialCommunityIcons
                name="tag-outline"
                size={20}
                color="#9CA3AF"
              />
              <TextInput
                className="flex-1 p-4 font-semibold text-gray-800"
                value={name}
                onChangeText={(text) => setName(text)}
                placeholder="Nhập tên bàn..."
              />
            </View>
          </View>

          <View className="mb-2">
            <Text className="text-gray-500 font-bold mb-2 ml-1 text-xs">
              Sức chứa (người)
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4">
              <MaterialCommunityIcons
                name="account-group-outline"
                size={20}
                color="#9CA3AF"
              />
              <TextInput
                className="flex-1 p-4 font-semibold text-gray-800"
                value={capacity}
                onChangeText={(text) => setCapacity(text)}
                keyboardType="numeric"
                placeholder="Nhập sức chứa..."
              />
            </View>
          </View>
        </View>

        <View className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm mb-10">
          <View className="flex-row items-center mb-6">
            <View className="w-8 h-8 bg-orange-50 rounded-full items-center justify-center mr-3">
              <MaterialCommunityIcons
                name="food-outline"
                size={18}
                color="#E07B39"
              />
            </View>
            <Text className="text-gray-800 font-black text-sm uppercase tracking-wider">
              Chi tiết đơn hàng
            </Text>
          </View>

          <View className="mb-5">
            <Text className="text-gray-500 font-bold mb-2 ml-1 text-xs">
              Danh sách món ăn
            </Text>
            <View className="flex-row bg-gray-50 rounded-2xl border border-gray-100 px-4 py-1">
              <MaterialCommunityIcons
                name="format-list-bulleted"
                size={20}
                color="#E07B39"
                style={{ marginTop: 15 }}
              />
              {loadingOrder ? (
                <View className="flex-1 p-4 justify-center items-start">
                  <ActivityIndicator size="small" color="#E07B39" />
                </View>
              ) : (
                <TextInput
                  className="flex-1 p-4 font-semibold text-gray-800"
                  value={listFoods}
                  onChangeText={(text) => setListFoods(text)}
                  multiline
                  placeholder="Chưa có món ăn..."
                />
              )}
            </View>
          </View>

          <View className="mb-2">
            <Text className="text-gray-500 font-bold mb-2 ml-1 text-xs">
              Tổng giá tiền (Từ đơn hàng hiện tại)
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4">
              <MaterialCommunityIcons
                name="cash-multiple"
                size={20}
                color="#E07B39"
              />
              {loadingOrder ? (
                <View className="flex-1 p-4 justify-center items-start">
                  <ActivityIndicator size="small" color="#E07B39" />
                </View>
              ) : (
                <TextInput
                  className="flex-1 p-4 font-semibold text-gray-800 text-lg"
                  value={price}
                  onChangeText={(text) => setPrice(text)}
                  keyboardType="numeric"
                  placeholder="0"
                />
              )}
              <Text className="font-bold text-gray-400">VNĐ</Text>
            </View>
          </View>
        </View>

        <View className="flex-row justify-between mb-10">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="flex-1 mr-3 bg-gray-100 p-5 rounded-3xl items-center"
          >
            <Text className="text-gray-600 font-black">Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleUpdateTable}
            className="flex-[2] bg-[#E07B39] p-5 rounded-3xl items-center shadow-lg shadow-orange-200"
          >
            <Text className="text-white font-black text-lg">Lưu thay đổi</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminEditTables;
