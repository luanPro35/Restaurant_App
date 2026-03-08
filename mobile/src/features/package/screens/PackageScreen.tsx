import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CustomerStackParamList } from "../../../app/navigation/CustomerNavigator";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PackageItem from "../components/PackageItem";
import PackageAddress from "../components/PackageAddress";
import PackageDish from "../components/PackageDish";
import { usePackage } from "../hooks/usePackage";

export default function PackageScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<CustomerStackParamList>>();

  const {packages, loading, error, fetchPackages} = usePackage();

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <View className="flex-1 bg-[#F9F6E7]">
      <StatusBar barStyle="light-content" backgroundColor="#E07B39" />

      <View className="bg-[#E07B39] pt-12 pb-6 px-4 rounded-b-3xl shadow-lg elevation-5 z-10 mb-[-20px]">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-3"
          >
            <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-white">
            Theo Dõi Đơn Hàng
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 pt-10" showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="items-center justify-center mt-20">
            <Text className="text-gray-500 text-lg">Đang tải dữ liệu...</Text>
          </View>
        ) : error ? (
          <View className="items-center justify-center mt-20">
            <Text className="text-red-500 text-lg mb-4">Có lỗi xảy ra khi tải dữ liệu.</Text>
            <TouchableOpacity
              className="bg-[#E07B39] px-8 py-3 rounded-full shadow-lg"
              onPress={() => fetchPackages()}
            >
              <Text className="text-white font-bold text-base">
                Thử lại
              </Text>
            </TouchableOpacity>
          </View>
        ) : packages.length > 0 ? (
          <View className="pb-10">
            {packages.map((pack, index) => (
              <React.Fragment key={pack.id || index}>
                <View>
                  <PackageAddress pack={pack} />
                  <PackageDish pack={pack} />
                  <View className="pt-6"><PackageItem pack={pack} onRefresh={fetchPackages} /></View>
                 
                </View>
                {index < packages.length - 1 && (
                  <View className="mx-6 mb-8 border-b border-dashed border-gray-300" />
                )}
              </React.Fragment>
            ))}
          </View>
        ) : (
          <View className="items-center justify-center mt-20">
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/2038/2038854.png",
              }}
              className="w-40 h-40 opacity-50 mb-4"
            />
            <Text className="text-gray-500 text-lg mb-6">
              Bạn chưa có đơn hàng nào
            </Text>
            <TouchableOpacity
              className="bg-[#E07B39] px-8 py-3 rounded-full shadow-lg"
              onPress={() => navigation.navigate("Delivery" as any, { screen: "Menu" })}
            >
              <Text className="text-white font-bold text-base">
                Đặt món ngay
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
