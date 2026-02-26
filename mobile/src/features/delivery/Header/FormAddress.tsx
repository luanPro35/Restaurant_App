import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAddress as useAddressHook } from "../hooks/useAddress";
import { useDelivery } from "../../../app/context/DeliveryContext";
import { SAVED_ICON } from "../contants/Adress.contant";

export default function FormAddress() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const [searchText, setSearchText] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const { addresses, loading, fetchAddresses, deleteAddress } =
    useAddressHook();
  const { selectAddress, selectedAddress } = useDelivery();

  useEffect(() => {
    if (isFocused) {
      fetchAddresses();
    }
  }, [isFocused]);

  const getIconForType = (type: string) => {
    const iconData = SAVED_ICON.find((i) => i.id === type);
    return iconData ? iconData.icon : "map-marker";
  };

  const getNameForType = (type: string) => {
    const iconData = SAVED_ICON.find((i) => i.id === type);
    return iconData ? iconData.name : "Địa chỉ khác";
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa địa chỉ này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            const success = await deleteAddress(id);
            if (success) {
              setActiveMenuId(null);
              if (selectedAddress?.id === id) {
                selectAddress(null);
              }
            } else {
              Alert.alert("Lỗi", "Không thể xóa địa chỉ. Vui lòng thử lại!");
            }
          },
        },
      ],
    );
  };

  const filteredAddresses = addresses.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.address.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View className="flex-1 bg-[#F9F6E7]">
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />

      <View
        style={{
          paddingTop: Math.max(insets.top, 20),
          paddingBottom: 15,
        }}
        className="bg-white shadow-sm border-b border-gray-100 px-5 flex-row items-center"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-11 h-11 rounded-2xl bg-gray-50 items-center justify-center mr-4"
        >
          <Ionicons name="close" size={26} color="#2D2D2D" />
        </TouchableOpacity>
        <View>
          <Text className="text-xl font-black text-[#2D2D2D]">
            Địa chỉ giao hàng
          </Text>
          <Text className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mt-0.5">
            Giao đến nơi bạn muốn
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        onScrollBeginDrag={() => setActiveMenuId(null)}
      >
        <View className="p-5 bg-white mb-2">
          <View className="flex-row items-center bg-gray-50 border border-gray-200/50 rounded-2xl px-5 py-4">
            <Ionicons name="search" size={22} color="#E07B39" />
            <TextInput
              placeholder="Tìm kiếm địa chỉ đã lưu..."
              value={searchText}
              onChangeText={setSearchText}
              className="flex-1 ml-3 text-base text-[#2D2D2D] font-medium"
              placeholderTextColor="#9CA3AF"
            />
            {searchText !== "" && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <View className="mt-8 space-y-5">
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center"
            >
              <View className="w-12 h-12 rounded-2xl bg-orange-50 items-center justify-center mr-4">
                <MaterialCommunityIcons
                  name="crosshairs-gps"
                  size={24}
                  color="#E07B39"
                />
              </View>
              <View className="flex-1 border-b border-gray-50 pb-4">
                <Text className="text-[#2D2D2D] font-bold text-[17px]">
                  Vị trí hiện tại
                </Text>
                <Text className="text-gray-400 text-xs mt-0.5">
                  Định vị địa chỉ của bạn ngay bây giờ
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-5 py-6">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-[20px] font-black text-[#2D2D2D]">
                Địa chỉ đã lưu
              </Text>
              <View className="w-10 h-1 bg-[#E07B39] rounded-full mt-1.5" />
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddAdress")}
              className="bg-orange-50 px-4 py-2 rounded-full border border-orange-100"
            >
              <Text className="text-[#E07B39] font-bold text-xs">
                + Thêm mới
              </Text>
            </TouchableOpacity>
          </View>

          {loading && addresses.length === 0 ? (
            <ActivityIndicator color="#E07B39" size="large" className="my-10" />
          ) : filteredAddresses.length > 0 ? (
            filteredAddresses.map((item) => {
              const isSelected = selectedAddress?.id === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  className={`bg-white rounded-[32px] p-5 flex-row items-center mb-4 shadow-sm border ${
                    isSelected
                      ? "border-[#E07B39] bg-orange-50/30"
                      : "border-gray-100/50"
                  }`}
                  onPress={() => {
                    selectAddress(item);
                    navigation.goBack();
                  }}
                >
                  <View
                    className={`w-[60px] h-[60px] rounded-3xl items-center justify-center mr-5 ${
                      isSelected ? "bg-[#E07B39]" : "bg-[#F9F6E7]"
                    }`}
                  >
                    <MaterialCommunityIcons
                      name={getIconForType(item.type) as any}
                      size={28}
                      color={isSelected ? "#white" : "#E07B39"}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-[17px] font-extrabold text-[#2D2D2D]">
                      {item.name} ({getNameForType(item.type)})
                    </Text>
                    <Text
                      className="text-gray-400 text-xs mt-1.5 leading-5 font-medium"
                      numberOfLines={2}
                    >
                      {item.address}
                    </Text>
                  </View>
                  <View className="relative">
                    <TouchableOpacity
                      onPress={() =>
                        setActiveMenuId(
                          activeMenuId === item.id ? null : item.id,
                        )
                      }
                      className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
                    >
                      <MaterialCommunityIcons
                        name="dots-vertical"
                        size={24}
                        color={isSelected ? "#E07B39" : "#D1D5DB"}
                      />
                    </TouchableOpacity>

                    {activeMenuId === item.id && (
                      <View
                        className="absolute right-0 top-10 bg-white shadow-xl rounded-2xl border border-gray-100 py-1 w-28 z-50 overflow-hidden"
                        style={{
                          elevation: 10,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.1,
                          shadowRadius: 10,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => handleDelete(item.id)}
                          activeOpacity={0.7}
                          className="flex-row items-center px-4 py-3 active:bg-red-50"
                        >
                          <Ionicons
                            name="trash-outline"
                            size={18}
                            color="#FF4D4D"
                          />
                          <Text className="text-red-500 font-bold ml-2">
                            Xóa
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          ) : (
            <View className="items-center justify-center py-10">
              <MaterialCommunityIcons
                name="map-marker-off"
                size={48}
                color="#D1D5DB"
              />
              <Text className="text-gray-400 mt-2 font-medium">
                Bạn chưa lưu địa chỉ nào
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}
        className="p-5 bg-white border-t border-gray-50"
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.goBack()}
          className="overflow-hidden rounded-3xl"
        >
          <LinearGradient
            colors={["#E91E63", "#E07B39"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-5 items-center justify-center shadow-lg shadow-orange-300"
          >
            <Text className="text-white font-black text-lg tracking-tight uppercase">
              Xác nhận địa chỉ
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
