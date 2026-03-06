import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  isServerItem?: boolean;
}

interface CurrentOrderProps {
  items?: OrderItem[];
  tableNumber?: string;
  onAddMore?: () => void;
  onConfirm?: () => void;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemoveItem?: (id: string) => void;
}

export default function CurrentOrder({
  items = [],
  tableNumber = "A1",
  onAddMore,
  onConfirm,
  onUpdateQuantity,
  onRemoveItem,
}: CurrentOrderProps) {
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <View className="bg-white rounded-2xl p-4 shadow-md mx-4 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="table-furniture"
            size={24}
            color="#E07B39"
          />
          <Text className="text-lg font-bold text-gray-800 ml-2">
            Bàn {tableNumber}
          </Text>
        </View>
        <View className="bg-orange-100 px-3 py-1 rounded-full">
          <Text className="text-orange-600 font-semibold">
            {items.length} món
          </Text>
        </View>
      </View>

      {items.length === 0 ? (
        <View className="items-center py-8">
          <MaterialCommunityIcons name="food-off" size={48} color="#D1D5DB" />
          <Text className="text-gray-400 mt-2">Chưa có món nào</Text>
        </View>
      ) : (
        <>
          <ScrollView className="max-h-64">
            {Array.isArray(items) && items.map((item) => (
              <View
                key={item.id}
                className="flex-row items-center justify-between py-3 border-b border-gray-100"
              >
                <View className="flex-1">
                  <Text className="text-gray-800 font-semibold">
                    {item.name}
                  </Text>
                </View>
                <View className="items-end">
                  {item.isServerItem ? (
                    <View className="items-end">
                      <Text className="text-gray-600 font-medium">x{item.quantity}</Text>
                      <Text className="text-orange-600 font-semibold">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                      </Text>
                    </View>
                  ) : (
                    <View className="items-end">
                      <View className="flex-row items-center bg-gray-100 rounded-lg px-2 py-1 mb-1">
                        <TouchableOpacity 
                          onPress={() => onUpdateQuantity?.(item.id, item.quantity - 1)}
                          className="p-1"
                        >
                          <MaterialCommunityIcons name="minus" size={16} color="#E07B39" />
                        </TouchableOpacity>
                        <Text className="mx-2 font-bold text-gray-800">{item.quantity}</Text>
                        <TouchableOpacity 
                          onPress={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                          className="p-1"
                        >
                          <MaterialCommunityIcons name="plus" size={16} color="#E07B39" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => onRemoveItem?.(item.id)}
                          className="ml-2 pl-2 border-l border-gray-300"
                        >
                          <MaterialCommunityIcons name="close" size={16} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                      <Text className="text-orange-600 font-semibold">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>

          <View className="flex-row items-center justify-between pt-4 mt-2 border-t-2 border-gray-200">
            <Text className="text-lg font-bold text-gray-800">Tổng cộng</Text>
            <Text className="text-xl font-bold text-orange-600">
              {totalAmount.toLocaleString("vi-VN")}đ
            </Text>
          </View>

          <View className="flex-row mt-4 gap-3">
            <TouchableOpacity
              onPress={onAddMore}
              className="flex-1 border border-orange-500 rounded-xl py-3 items-center justify-center flex-row"
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="plus" size={20} color="#E07B39" />
              <Text className="text-orange-600 font-bold ml-1">Đặt thêm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 bg-orange-500 rounded-xl py-3 justify-center items-center"
              activeOpacity={0.8}
            >
              <Text className="text-white font-bold text-base">Đặt món</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
