import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Package } from "../../../services/api/package-api";

interface PackageDishProps {
    pack: Package;
}

export default function PackageDish({ pack }: PackageDishProps) {
    return (
        <View className="bg-white rounded-2xl mx-4 mt-4 p-4 shadow-sm elevation-2 border border-gray-100">
            <View className="flex-row items-start">
                <View className="bg-[#FFDbb5] w-12 h-12 rounded-full justify-center items-center mr-4 mt-1">
                    <MaterialCommunityIcons name="silverware-fork-knife" size={26} color="#E07B39" />
                </View>
                <View className="flex-1">
                    <Text className="text-[17px] font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">Chi tiết món ăn</Text>

                    <View className="mb-3">
                        <Text className="text-[14px] text-gray-500 mb-1">Tên món ăn</Text>
                        <Text className="text-[16px] font-bold text-gray-800">{pack.description}</Text>
                    </View>

                    <View>
                        <Text className="text-[14px] text-gray-500 mb-1">Giá</Text>
                        <Text className="text-[16px] font-bold text-[#E07B39]">{Number(pack.price).toLocaleString("vi-VN")} VNĐ</Text>
                    </View>

                    <View className="mt-3">
                        <Text className="text-[14px] text-gray-500 mb-1">Phương thức thanh toán</Text>
                        <Text className="text-[14px] font-black text-gray-800">
                            {pack.paymentMethod === "Cash" ? "Tiền mặt" : pack.paymentMethod}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}