import { View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, useWindowDimensions } from "react-native";
import { useEffect } from "react";
import { useVietQr } from "../hooks/useVietQr";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function VietQrScreen({ route }: { route: any }) {
    const navigation = useNavigation<any>();
    const { width: windowWidth } = useWindowDimensions();
    const { packageId } = route.params;
    const { vietQr, loading, error, createVietQrForPackage } = useVietQr();

    useEffect(() => {
        createVietQrForPackage(packageId);
    }, [packageId]);


    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="mt-4 text-gray-500 font-medium">Đang tạo mã thanh toán...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 items-center justify-center bg-white p-6">
                <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#EF4444" />
                <Text className="mt-4 text-xl font-bold text-gray-800">Lỗi thanh toán</Text>
                <Text className="mt-2 text-gray-500 text-center">{error}</Text>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="mt-8 bg-gray-100 px-8 py-3 rounded-full"
                >
                    <Text className="text-gray-700 font-bold">Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const qrSize = windowWidth - 80;

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <View className="items-center mb-6">
                    <Text className="text-2xl font-black text-slate-800">Thanh toán VietQR</Text>
                    <Text className="text-slate-500 mt-1 text-center">
                        Vui lòng quét mã bên dưới để hoàn tất thanh toán
                    </Text>
                </View>

                <View className="bg-white rounded-[32px] p-5 shadow-sm items-center border border-slate-100">
                    {vietQr?.qrData && (
                        <View className="bg-white p-2 rounded-3xl border border-slate-100 shadow-inner mb-4">
                            <Image
                                source={{ uri: vietQr.qrData }}
                                style={{ width: qrSize, height: qrSize }}
                                resizeMode="contain"
                            />
                        </View>
                    )}
                </View>

                <View className="mt-8 gap-4">
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate("PaymentSuccessful")}
                        className="bg-blue-600 py-4 rounded-2xl items-center shadow-lg shadow-blue-200"
                    >
                        <Text className="text-white font-black text-lg">Tôi đã thanh toán</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigation.goBack()}
                        className="py-4 rounded-2xl items-center border border-slate-200"
                    >
                        <Text className="text-slate-500 font-bold">Hủy giao dịch</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-8 items-center">
                    <Text className="text-slate-400 text-[11px] text-center px-8">
                        Lưu ý: Sau khi chuyển khoản, vui lòng giữ lại hóa đơn để đối chiếu nếu cần thiết. Hệ thống sẽ tự động cập nhật trạng thái sau khi nhận được tiền.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}