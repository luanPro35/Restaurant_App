import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  useWindowDimensions,
  Linking,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useVietQr } from "../hooks/useVietQr";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { paymentApi } from "../../../services/api/api-payment";

export default function VietQrScreen({ route }: { route: any }) {
  const navigation = useNavigation<any>();
  const { width: windowWidth } = useWindowDimensions();
  const { packageId, orderId } = route.params || {};
  const { vietQr, loading, error, createVietQrForPackage, createVietQrForOrder } =
    useVietQr();

  const [checking, setChecking] = useState(false);
  const hasNavigatedRef = useRef(false);

  // Khởi tạo mã QR
  useEffect(() => {
    if (packageId) {
      createVietQrForPackage(packageId);
    } else if (orderId) {
      createVietQrForOrder(orderId);
    }
  }, [packageId, orderId]);

  // Hàm kiểm tra trạng thái thanh toán từ SePay
  const checkStatus = useCallback(
    async (isManual = false) => {
      if (hasNavigatedRef.current) return;
      if (isManual) setChecking(true);

      try {
        const res = await paymentApi.checkStatus({ packageId, orderId });
        if (res?.isPaid && !hasNavigatedRef.current) {
          hasNavigatedRef.current = true;
          navigation.replace("PaymentSuccessful");
          return;
        }

        if (isManual) {
          Alert.alert(
            "Đang chờ ngân hàng",
            "Hệ thống đang chờ SePay ghi nhận biến động số dư từ ngân hàng (thường mất 5-15 giây). Vui lòng đợi trong giây lát hoặc thử bấm kiểm tra lại sau ít giây!",
            [{ text: "Đã hiểu" }]
          );
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra thanh toán:", err);
      } finally {
        if (isManual) setChecking(false);
      }
    },
    [packageId, orderId, navigation]
  );

  // Tự động kiểm tra (Auto-polling) mỗi 2.5 giây sau khi khách quét mã
  useEffect(() => {
    const interval = setInterval(() => {
      checkStatus(false);
    }, 2500);

    return () => clearInterval(interval);
  }, [checkStatus]);

  const handleOpenBankingApp = async () => {
    if (vietQr?.deeplink) {
      Linking.openURL(vietQr.deeplink).catch((err) => {
        console.log("Lỗi mở app ngân hàng:", err);
        Alert.alert(
          "Thông báo",
          "Không tìm thấy ứng dụng ngân hàng tương ứng. Bạn vui lòng chụp màn hình hoặc quét mã QR thủ công.",
          [{ text: "OK" }]
        );
      });
    } else {
      Alert.alert(
        "Lỗi",
        "Không tìm thấy thông tin chuyển khoản (Deeplink trống)."
      );
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#E07B39" />
        <Text className="mt-4 text-gray-500 font-medium">
          Đang tạo mã thanh toán VietQR...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6">
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={64}
          color="#EF4444"
        />
        <Text className="mt-4 text-xl font-bold text-gray-800">
          Lỗi thanh toán
        </Text>
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
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 50 }}>
        {/* Tiêu đề */}
        <View className="items-center mb-5">
          <Text className="text-2xl font-black text-slate-800">
            Thanh toán VietQR
          </Text>
          <Text className="text-slate-500 mt-1 text-center text-xs px-4">
            Quét mã hoặc mở App Ngân hàng để thanh toán tự động qua SePay
          </Text>
        </View>

        {/* Khung mã QR */}
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

          {vietQr?.deeplink && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenBankingApp}
              className="bg-blue-50 flex-row items-center justify-center py-3.5 px-6 rounded-2xl w-full border border-blue-100"
            >
              <MaterialCommunityIcons name="bank" size={22} color="#2563EB" />
              <Text className="text-blue-700 font-bold ml-2 text-sm">
                Mở App Ngân hàng
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Trạng thái xác nhận tự động SePay */}
        <View className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 flex-row items-center justify-center my-4">
          <ActivityIndicator size="small" color="#059669" />
          <View className="ml-3 flex-1">
            <Text className="text-emerald-800 font-black text-xs">
              Tự động duyệt đơn qua SePay
            </Text>
            <Text className="text-emerald-600 text-[11px] mt-0.5 font-medium">
              Chuyển khoản xong hệ thống sẽ tự động duyệt đơn & gửi Telegram ngay lập tức.
            </Text>
          </View>
        </View>

        {/* Cụm nút thao tác */}
        <View className="gap-3">
          {/* Nút chính: Tôi đã chuyển khoản */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => checkStatus(true)}
            disabled={checking}
            className="bg-[#E07B39] py-4 rounded-2xl items-center shadow-lg shadow-orange-200 flex-row justify-center"
          >
            {checking ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={20}
                  color="white"
                />
                <Text className="text-white font-black text-base ml-2">
                  Tôi đã chuyển khoản - Kiểm tra ngay
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Nút hủy giao dịch */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            className="py-3 rounded-2xl items-center border border-slate-200 bg-white"
          >
            <Text className="text-slate-500 font-bold text-sm">Hủy giao dịch</Text>
          </TouchableOpacity>

          {/* Link dự phòng: Chỉ dùng khi gặp sự cố mạng */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              navigation.navigate("UploadImagePayment", { orderId, packageId })
            }
            className="py-2 items-center"
          >
            <Text className="text-slate-400 font-medium text-[11px] underline">
              Gặp sự cố chuyển khoản? Tải ảnh biên lai thủ công
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}