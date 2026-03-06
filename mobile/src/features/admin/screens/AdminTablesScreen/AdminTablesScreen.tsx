import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { AdminTableCard } from "../../components/AdminTableCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminTable } from "../../types/admin.types";
import { AdminStackParamList } from "../../../../app/navigation/AdminNavigator";
import { useAdminTable } from "../../hooks/useAdminTable";

export default function AdminTablesScreen() {
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();

  const { tables, getTables, deleteTable } = useAdminTable();

  useEffect(() => {
    if (isFocused) {
      getTables();
    }
  }, [isFocused]);

  const handleDelete = (table: AdminTable) => {
    deleteTable(table.id);
  };

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      <View className="px-6 pt-14 pb-6 bg-[#FDFCF7]">
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-[#E07B39] shadow-sm rounded-xl items-center justify-center border border-gray-100"
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
          <TouchableOpacity
            onPress={() => navigation.navigate("AdminAddTables")}
            className="w-10 h-10 bg-[#E07B39] shadow-sm rounded-xl items-center justify-center border border-gray-100"
          >
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
          {tables.map((table) => (
            <AdminTableCard
              key={table.id}
              table={table}
              onEdit={(t: AdminTable) =>
                navigation.navigate("AdminEditTables", { table: t })
              }
              onDelete={(t: AdminTable) => handleDelete(t)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
