import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePayment } from "../../hooks/usePayment";

const { width } = Dimensions.get("window");

export default function AdminAnalysisScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { totalAmount, fetchTotalAmount, loading: hookLoading } = usePayment();
    const [internalLoading, setInternalLoading] = useState(false);

    const loadData = async () => {
        setInternalLoading(true);
        try {
            await fetchTotalAmount();
        } catch (error) {
            console.error(error);
        } finally {
            setInternalLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

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
                    borderBottomRightRadius: 35,
                }}
            >
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/30"
                    >
                        <MaterialCommunityIcons name="chevron-left" size={26} color="white" />
                    </TouchableOpacity>
                    <View className="items-center">
                        <Text
                            className="text-white text-xl font-black tracking-tight"
                            style={{
                                textShadowColor: "rgba(0, 0, 0, 0.1)",
                                textShadowOffset: { width: 0, height: 2 },
                                textShadowRadius: 4,
                            }}
                        >
                            Phân tích tài chính
                        </Text>
                        <Text className="text-white/80 text-[9px] font-bold uppercase tracking-[2.5px] mt-1">
                            Báo cáo doanh thu
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={loadData}
                        className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/30"
                    >
                        <MaterialCommunityIcons name="refresh" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );

    return (
        <View className="flex-1 bg-[#FDFCF7]">
            {renderHeader()}

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={internalLoading}
                        onRefresh={loadData}
                        colors={["#E07B39"]}
                    />
                }
            >
                <LinearGradient
                    colors={["#FFFFFF", "#F9F6E7"]}
                    className="rounded-[32px] p-8 border border-orange-100 shadow-xl shadow-orange-200"
                    style={{ elevation: 5 }}
                >
                    <View className="flex-row items-center justify-between mb-6">
                        <View className="w-14 h-14 bg-orange-100 rounded-2xl items-center justify-center">
                            <MaterialCommunityIcons name="wallet" size={30} color="#E07B39" />
                        </View>
                        <View className="bg-green-100 px-3 py-1.5 rounded-full">
                            <Text className="text-green-600 text-[10px] font-black uppercase">Sẵn dụng</Text>
                        </View>
                    </View>

                    <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-2">
                        Tổng doanh thu hệ thống
                    </Text>

                    {internalLoading ? (
                        <ActivityIndicator size="small" color="#E07B39" className="py-4" />
                    ) : (
                        <Text className="text-[#2D2D2D] text-4xl font-black tracking-tighter">
                            {formatCurrency(totalAmount || 0)}
                        </Text>
                    )}

                    <View className="h-[1px] bg-orange-100/50 my-6" />

                    <View className="flex-row items-center">
                        <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                        <Text className="text-gray-500 font-medium text-xs">
                            Cập nhật lúc: {new Date().toLocaleTimeString("vi-VN")}
                        </Text>
                    </View>
                </LinearGradient>

            </ScrollView>
        </View>
    );
}