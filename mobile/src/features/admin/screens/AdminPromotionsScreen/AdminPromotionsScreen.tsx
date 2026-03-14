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
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

  const insets = useSafeAreaInsets();

  const renderHeader = () => (
    <View className="bg-[#FDFCF7]">
      <LinearGradient
        colors={["#E07B39", "#C96A2E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pb-10 px-6 shadow-2xl"
        style={{ 
          paddingTop: Math.max(insets.top, 20) + 5,
          borderBottomLeftRadius: 35,
          borderBottomRightRadius: 35
        }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/30"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={26}
              color="white"
            />
          </TouchableOpacity>
          <View className="items-center">
            <Text className="text-white text-xl font-black tracking-tight" style={{ textShadowColor: 'rgba(0, 0, 0, 0.1)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>Quản lý khuyến mãi</Text>
            <Text className="text-white/80 text-[9px] font-bold uppercase tracking-[2.5px] mt-1">Hệ thống quản trị</Text>
          </View>
          <View className="w-10" />
        </View>
      </LinearGradient>

      <View className="flex-row items-center space-x-3 gap-3 px-6 py-6">
        <View
          className="flex-1 flex-row items-center bg-white h-[52px] px-4 shadow-sm border border-gray-100"
          style={{ elevation: 2, borderRadius: 16 }}
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
          activeOpacity={0.85}
          style={{
            shadowColor: "#E07B39",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <LinearGradient
            colors={["#E07B39", "#C96A2E"]}
            className="w-[52px] h-[52px] items-center justify-center border-t border-white/20"
            style={{ borderRadius: 16 }}
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
