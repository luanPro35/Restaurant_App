import React from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { CameraView } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQRScanner } from "../hooks/useQRScanner";

export default function QRScannerScreen() {
  const {
    permission,
    requestPermission,
    scanned,
    handleBarCodeScanned,
    goBack
  } = useQRScanner();

  if (!permission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black justify-center items-center p-6">
        <Text className="text-white text-center mb-6 text-base">
          Chúng tôi cần quyền truy cập camera để quét mã QR
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-[#E07B39] px-8 py-4 rounded-2xl shadow-lg"
        >
          <Text className="text-white font-bold text-lg">Cấp quyền Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "code128", "ean13"],
        }}
      />

      <View style={StyleSheet.absoluteFillObject}>
        <View className="flex-1 bg-black/60" />

        <View className="flex-row h-[250px]">
          <View className="flex-1 bg-black/60" />
          <View className="w-[250px] relative">
            <View className="absolute top-0 left-0 w-10 h-10 border-t-[5px] border-l-[5px] border-[#E07B39]" />
            <View className="absolute top-0 right-0 w-10 h-10 border-t-[5px] border-r-[5px] border-[#E07B39]" />
            <View className="absolute bottom-0 left-0 w-10 h-10 border-b-[5px] border-l-[5px] border-[#E07B39]" />
            <View className="absolute bottom-0 right-0 w-10 h-10 border-b-[5px] border-r-[5px] border-[#E07B39]" />
          </View>
          <View className="flex-1 bg-black/60" />
        </View>

        <View className="flex-1 bg-black/60 items-center pt-8">
          <Text className="text-white text-base font-semibold">
            Đặt khung hình vào mã QR trên bàn
          </Text>
        </View>
      </View>

      <TouchableOpacity
        className="absolute top-14 right-8 bg-black/40 p-3 rounded-full border border-white/20"
        onPress={goBack}
      >
        <MaterialCommunityIcons name="close" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  }
});
