import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { AdminTableCard } from "../../components/AdminTableCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminTable } from "../../types/admin.types";
import { MainStackParamList } from "../../../../app/navigation/MainNavigator";

export default function AdminTablesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  const dummyTables: AdminTable[] = [
    {
      id: "1",
      name: "Bàn 01",
      capacity: 4,
      status: "available",
      listFoods: ["Bún bò Huế", "Phở", "Bún chả"],
      price: 100000,
      isAvailable: true,
      isActive: true,
    },
    {
      id: "2",
      name: "Bàn 02",
      capacity: 2,
      status: "occupied",
      listFoods: ["Bún bò Huế", "Phở", "Bún chả"],
      price: 100000,
      isAvailable: true,
      isActive: true,
    },
    {
      id: "3",
      name: "Bàn 03",
      capacity: 8,
      status: "occupied",
      listFoods: ["Bún bò Huế", "Phở", "Bún chả"],
      price: 100000,
      isAvailable: true,
      isActive: true,
    },
    {
      id: "4",
      name: "Bàn 04",
      capacity: 4,
      status: "available",
      listFoods: ["Bún bò Huế", "Phở", "Bún chả"],
      price: 100000,
      isAvailable: true,
      isActive: true,
    },
  ];

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
            Quản lý bàn & chỗ
          </Text>
          <TouchableOpacity className="w-10 h-10 bg-white shadow-sm rounded-xl items-center justify-center border border-gray-100">
            <MaterialCommunityIcons name="plus" size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center mb-2">
          <View className="w-1.5 h-6 bg-[#E07B39] rounded-full mr-3" />
          <Text className="text-lg font-bold text-gray-800">Sơ đồ bàn</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View className="flex-row flex-wrap justify-between">
          {dummyTables.map((table) => (
            <AdminTableCard
              key={table.id}
              table={table}
              onEdit={(t: AdminTable) =>
                navigation.navigate("AdminEditTables", { table: t })
              }
              onDelete={(t: AdminTable) =>
                navigation.navigate("AdminEditTables", { table: t })
              }
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
