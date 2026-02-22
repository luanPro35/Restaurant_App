import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useAdminPromotion } from "../../hooks/useAdminPromotion";
import { AdminPromotionCard } from "../../components/AdminPromotionCard";
import { AdminStackParamList } from "../../../../app/navigation/AdminNavigator";
import { Alert } from "react-native";

export default function AdminPromotionsScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const {
    promotions,
    loading,
    refreshing,
    fetchPromotions,
    handleRefresh,
    deletePromotion,
  } = useAdminPromotion();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    fetchPromotions({ name: search });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPromotions({});
    }, []),
  );

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
        <Text className="text-xl font-black text-gray-800">
          Quản lý khuyến mãi
        </Text>
        <View className="w-10" />
      </View>

      <View className="flex-row items-center space-x-3 gap-3">
        <View
          className="flex-1 flex-row items-center bg-white h-[52px] px-4 rounded-2xl shadow-sm border border-gray-100"
          style={{ elevation: 2 }}
        >
          <MaterialCommunityIcons name="magnify" size={22} color="#E07B39" />
          <TextInput
            className="flex-1 ml-3 text-gray-800 font-semibold text-sm"
            placeholder="Tìm theo tên khuyến mãi..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearch("");
                fetchPromotions({});
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
          onPress={() => navigation.navigate("AdminAddPromotionScreen")}
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

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center pt-20">
      <View className="w-20 h-20 bg-orange-50 rounded-full items-center justify-center mb-4">
        <MaterialCommunityIcons
          name="ticket-percent-outline"
          size={40}
          color="#E07B39"
        />
      </View>
      <Text className="text-gray-400 font-bold">Không có khuyến mãi nào</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      {renderHeader()}

      {loading && !refreshing && promotions.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E07B39" />
        </View>
      ) : (
        <FlatList
          data={promotions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AdminPromotionCard
              promotion={item}
              onPress={() =>
                navigation.navigate("AdminEditPromotionScreen", {
                  promotionId: item.id,
                })
              }
              onDelete={(id) => deletePromotion(id)}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#E07B39"]}
            />
          }
        />
      )}
    </View>
  );
}
