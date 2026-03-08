import React from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Package } from "../../../services/api/package-api";

interface PackageAddressProps {
    pack: Package;
}

export default function PackageAddress({ pack }: PackageAddressProps) {
    const formattedDate = new Date(pack.createdAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <View className="bg-white rounded-2xl mx-4 mt-4 p-4 shadow-sm elevation-2 border border-gray-100">
            <View className="flex-row items-start">
                 <View className="bg-[#FFDbb5] w-12 h-12 rounded-full justify-center items-center mr-4 mt-1">
                     <MaterialCommunityIcons name="map-marker-outline" size={26} color="#E07B39" />
                 </View>
                 <View className="flex-1">
                    <Text className="text-[17px] font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">Thông tin giao hàng</Text>
                    
                    <View className="mb-3">
                        <Text className="text-[14px] text-gray-500 mb-1">Thời gian đặt</Text>
                        <View className="flex-row items-center">
                            <Text className="text-[16px] font-bold text-gray-800">{formattedDate}</Text>
                        </View>
                    </View>
                    
                    <View className="mb-3">
                        <Text className="text-[14px] text-gray-500 mb-1">Tên người nhận</Text>
                        <Text className="text-[16px] font-bold text-gray-800">{pack.name}</Text>
                    </View>
                    
                    <View>
                        <Text className="text-[14px] text-gray-500 mb-1">Địa chỉ giao hàng</Text>
                        <Text className="text-[16px] font-bold text-gray-800 leading-5">{pack.address}</Text>
                    </View>
                 </View>
            </View>
        </View>
    );
}