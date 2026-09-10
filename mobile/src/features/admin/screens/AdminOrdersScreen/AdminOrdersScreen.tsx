import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../../../app/navigation/AdminNavigator";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAdminPackage } from "../../hooks/useAdminPackage";
import packageApi, { Package, PackageStatusType } from "../../../../services/api/package-api";
import { LinearGradient } from "expo-linear-gradient";
import AdminOrderStatusFilter from "./AdminOrderStatusFilter";
import AdminOrderCard from "./AdminOrderCard";
import PackageStatusModal from "../../../package/components/PackageStatusModal";

export default function AdminOrdersScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const { packages, loading, refresh } = useAdminPackage();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedPkgForModal, setSelectedPkgForModal] = useState<Package | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [])
  );

  // Lọc danh sách theo Tab đang chọn
  const filteredPackages = packages.filter((pkg) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "CONFIRMED") {
      return pkg.status === "CONFIRMED" || pkg.status === "PENDING";
    }
    return pkg.status === activeTab;
  });

  // Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (pkgId: string, newStatus: PackageStatusType) => {
    setUpdatingId(pkgId);
    try {
      await packageApi.update(pkgId, { status: newStatus });
      refresh();
    } catch (error: any) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error?.response?.data || error?.message || error);
      const serverMsg = Array.isArray(error?.response?.data?.message)
        ? error.response.data.message.join("\n")
        : error?.response?.data?.message;
      Alert.alert("Lỗi", serverMsg || "Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.");
    } finally {
      setUpdatingId(null);
      setSelectedPkgForModal(null);
    }
  };

  const renderHeader = () => (
    <View className="bg-[#FDFCF7]">
      <LinearGradient
        colors={["#E07B39", "#C96A2E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pb-6 px-6 shadow-2xl"
        style={{
          paddingTop: Math.max(insets.top, 20) + 5,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
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
              Quản lý đơn hàng
            </Text>
            <Text className="text-white/80 text-[9px] font-bold uppercase tracking-[2.5px] mt-0.5">
              {packages.length} đơn hàng tổng cộng
            </Text>
          </View>
          <TouchableOpacity
            onPress={refresh}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/30"
          >
            <MaterialCommunityIcons name="refresh" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center pt-20">
      <View className="w-20 h-20 bg-orange-50 rounded-full items-center justify-center mb-4">
        <MaterialCommunityIcons
          name="clipboard-off-outline"
          size={40}
          color="#E07B39"
        />
      </View>
      <Text className="text-gray-600 font-bold text-base mb-1">
        Không có đơn hàng nào
      </Text>
      <Text className="text-gray-400 text-xs text-center px-8">
        Không tìm thấy đơn hàng nào ở mục này.
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      {renderHeader()}

      {/* Thanh bộ lọc trạng thái (Tabs Filter) */}
      <AdminOrderStatusFilter
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        packages={packages}
      />

      {loading && packages.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E07B39" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 60 }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              colors={["#E07B39"]}
            />
          }
        >
          {filteredPackages.length === 0
            ? renderEmpty()
            : filteredPackages.map((pkg) => (
                <AdminOrderCard
                  key={pkg.id}
                  pkg={pkg}
                  updatingId={updatingId}
                  onUpdateStatus={handleUpdateStatus}
                  onOpenStatusModal={(targetPkg) => setSelectedPkgForModal(targetPkg)}
                />
              ))}
        </ScrollView>
      )}

      {/* Modal chọn trạng thái bất kỳ cho Admin / Staff */}
      {selectedPkgForModal && (
        <PackageStatusModal
          visible={!!selectedPkgForModal}
          currentStatus={selectedPkgForModal.status}
          packageId={selectedPkgForModal.id}
          onClose={() => setSelectedPkgForModal(null)}
          onSelectStatus={(newStatus) =>
            handleUpdateStatus(selectedPkgForModal.id, newStatus)
          }
        />
      )}
    </View>
  );
}
