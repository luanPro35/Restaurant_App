import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAdminProducts } from "../../hooks/useAdminProducts";
import { AdminProductCard } from "../../components/AdminProductCard";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MainStackParamList } from "../../../../app/navigation/MainNavigator";

export default function AdminProductsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const {
    products,
    loading,
    refreshing,
    handleRefresh,
    toggleAvailability,
    deleteProduct,
    fetchProducts,
  } = useAdminProducts();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    fetchProducts({ search });
  };

  const renderHeader = () => (
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
        <Text className="text-xl font-black text-gray-800">Quản lý món ăn</Text>
        <TouchableOpacity className="w-10 h-10 bg-white shadow-sm rounded-xl items-center justify-center border border-gray-100">
          <MaterialCommunityIcons
            name="filter-variant"
            size={20}
            color="#1F2937"
          />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center space-x-3">
        <View
          className="flex-1 flex-row items-center bg-white h-[52px] px-4 rounded-2xl shadow-sm border border-gray-100"
          style={{ elevation: 2 }}
        >
          <MaterialCommunityIcons name="magnify" size={22} color="#E07B39" />
          <TextInput
            className="flex-1 ml-3 text-gray-800 font-semibold text-sm"
            placeholder="Tìm tên món, mô tả..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearch("");
                fetchProducts();
              }}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color="#D1D5DB"
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("AdminCreateProduct")}
          activeOpacity={0.8}
          className="shadow-lg shadow-orange-200"
        >
          <LinearGradient
            colors={["#E07B39", "#C96A2E"]}
            className="w-[52px] h-[52px] rounded-2xl items-center justify-center"
          >
            <MaterialCommunityIcons name="plus" size={28} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      {renderHeader()}

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E07B39" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <AdminProductCard
              product={item}
              onEdit={(p) => console.log("Edit", p)}
              onDelete={deleteProduct}
              onToggleAvailability={toggleAvailability}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#E07B39"
            />
          }
          ListEmptyComponent={
            <View className="mt-20 items-center justify-center">
              <MaterialCommunityIcons
                name="food-off-outline"
                size={64}
                color="#D1D5DB"
              />
              <Text className="text-gray-400 mt-4 font-medium">
                Chưa có sản phẩm nào
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
