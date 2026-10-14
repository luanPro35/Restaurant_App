import React, { useState, useEffect, useCallback } from "react";
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
import { orderApi, Order } from "../../../../services/api/api-order";
import { LinearGradient } from "expo-linear-gradient";
import AdminOrderStatusFilter from "./AdminOrderStatusFilter";
import AdminOrderCard from "./AdminOrderCard";
import PackageStatusModal from "../../../package/components/PackageStatusModal";

export default function AdminOrdersScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const insets = useSafeAreaInsets();

  // Mode: Gói giao hàng (PACKAGE) hoặc Đơn gọi món tại bàn (DINE_IN)
  const [orderMode, setOrderMode] = useState<"PACKAGE" | "DINE_IN">("PACKAGE");

  // Packages state (Delivery)
  const { packages, loading: pkgLoading, refresh: refreshPackages } = useAdminPackage();
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedPkgForModal, setSelectedPkgForModal] = useState<Package | null>(null);

  // Dine-in orders state
  const [dineInOrders, setDineInOrders] = useState<Order[]>([]);
  const [dineInLoading, setDineInLoading] = useState<boolean>(false);
  const [dineInTab, setDineInTab] = useState<string>("ALL");

  const fetchDineInOrders = useCallback(async () => {
    try {
      setDineInLoading(true);
      const res = await orderApi.getAll({ limit: 50 });
      if (res && Array.isArray(res.data)) {
        setDineInOrders(res.data);
      }
    } catch (e) {
      console.error("Error fetching dine-in orders:", e);
    } finally {
      setDineInLoading(false);
    }
  }, []);

  const refreshAll = useCallback(() => {
    refreshPackages();
    fetchDineInOrders();
  }, [refreshPackages, fetchDineInOrders]);

  useFocusEffect(
    useCallback(() => {
      refreshAll();
    }, [refreshAll])
  );

  // Filter Delivery Packages
  const filteredPackages = packages.filter((pkg) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "CONFIRMED") {
      return pkg.status === "CONFIRMED" || pkg.status === "PENDING";
    }
    return pkg.status === activeTab;
  });

  // Filter Dine-in Orders
  const filteredDineInOrders = dineInOrders.filter((ord) => {
    if (dineInTab === "ALL") return true;
    return ord.status === dineInTab;
  });

  // Update Package Status
  const handleUpdatePackageStatus = async (pkgId: string, newStatus: PackageStatusType) => {
    setUpdatingId(pkgId);
    try {
      await packageApi.update(pkgId, { status: newStatus });
      refreshPackages();
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

  // Update Dine-in Order Status
  const handleUpdateDineInStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      fetchDineInOrders();
    } catch (error: any) {
      console.error("Lỗi cập nhật đơn tại bàn:", error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái đơn tại bàn.");
    } finally {
      setUpdatingId(null);
    }
  };

  const renderHeader = () => (
    <View className="bg-[#FDFCF7]">
      <LinearGradient
        colors={["#E07B39", "#C96A2E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pb-5 px-6 shadow-2xl"
        style={{
          paddingTop: Math.max(insets.top, 20) + 5,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}
      >
        <View className="flex-row items-center justify-between mb-4">
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
              {orderMode === "PACKAGE"
                ? `${packages.length} gói giao hàng`
                : `${dineInOrders.length} đơn tại bàn`}
            </Text>
          </View>
          <TouchableOpacity
            onPress={refreshAll}
            className="w-10 h-10 bg-white/20 rounded-full items-center justify-center border border-white/30"
          >
            <MaterialCommunityIcons name="refresh" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Segmented Mode Switcher: Delivery vs Dine-in */}
        <View className="flex-row bg-black/20 p-1 rounded-2xl border border-white/20">
          <TouchableOpacity
            onPress={() => setOrderMode("PACKAGE")}
            className={`flex-1 py-2.5 rounded-xl items-center flex-row justify-center ${
              orderMode === "PACKAGE" ? "bg-white shadow-sm" : ""
            }`}
          >
            <MaterialCommunityIcons
              name="moped"
              size={18}
              color={orderMode === "PACKAGE" ? "#E07B39" : "rgba(255,255,255,0.8)"}
            />
            <Text
              className={`text-xs font-black ml-1.5 ${
                orderMode === "PACKAGE" ? "text-[#E07B39]" : "text-white"
              }`}
            >
              Giao hàng ({packages.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setOrderMode("DINE_IN")}
            className={`flex-1 py-2.5 rounded-xl items-center flex-row justify-center ${
              orderMode === "DINE_IN" ? "bg-white shadow-sm" : ""
            }`}
          >
            <MaterialCommunityIcons
              name="table-furniture"
              size={18}
              color={orderMode === "DINE_IN" ? "#E07B39" : "rgba(255,255,255,0.8)"}
            />
            <Text
              className={`text-xs font-black ml-1.5 ${
                orderMode === "DINE_IN" ? "text-[#E07B39]" : "text-white"
              }`}
            >
              Tại bàn ({dineInOrders.length})
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const renderEmpty = (title: string, subtitle: string) => (
    <View className="flex-1 items-center justify-center pt-20">
      <View className="w-20 h-20 bg-orange-50 rounded-full items-center justify-center mb-4">
        <MaterialCommunityIcons
          name="clipboard-off-outline"
          size={40}
          color="#E07B39"
        />
      </View>
      <Text className="text-gray-700 font-bold text-base mb-1">{title}</Text>
      <Text className="text-gray-400 text-xs text-center px-8">{subtitle}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      {renderHeader()}

      {orderMode === "PACKAGE" ? (
        <>
          {/* Tabs Filter for Packages */}
          <AdminOrderStatusFilter
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            packages={packages}
          />

          {pkgLoading && packages.length === 0 ? (
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
                  refreshing={pkgLoading}
                  onRefresh={refreshPackages}
                  colors={["#E07B39"]}
                />
              }
            >
              {filteredPackages.length === 0
                ? renderEmpty("Không có gói giao hàng nào", "Không tìm thấy gói đơn nào trong bộ lọc này.")
                : filteredPackages.map((pkg) => (
                    <AdminOrderCard
                      key={pkg.id}
                      pkg={pkg}
                      updatingId={updatingId}
                      onUpdateStatus={handleUpdatePackageStatus}
                      onOpenStatusModal={(targetPkg) => setSelectedPkgForModal(targetPkg)}
                    />
                  ))}
            </ScrollView>
          )}

          {/* Modal chọn trạng thái bất kỳ cho Delivery Package */}
          {selectedPkgForModal && (
            <PackageStatusModal
              visible={!!selectedPkgForModal}
              currentStatus={selectedPkgForModal.status}
              packageId={selectedPkgForModal.id}
              onClose={() => setSelectedPkgForModal(null)}
              onSelectStatus={(newStatus) =>
                handleUpdatePackageStatus(selectedPkgForModal.id, newStatus)
              }
            />
          )}
        </>
      ) : (
        /* DINE-IN ORDERS VIEW */
        <>
          {/* Tabs Filter for Dine-in */}
          <View className="py-2.5 px-4 bg-white border-b border-gray-100">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              {[
                { id: "ALL", label: `Tất cả (${dineInOrders.length})` },
                { id: "PENDING", label: "Chờ xác nhận" },
                { id: "CONFIRMED", label: "Đang phục vụ" },
                { id: "COMPLETED", label: "Hoàn tất" },
                { id: "CANCELLED", label: "Đã hủy" },
              ].map((tab) => {
                const isSelected = dineInTab === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    onPress={() => setDineInTab(tab.id)}
                    className={`px-3.5 py-1.5 rounded-full mr-2 border ${
                      isSelected
                        ? "bg-[#E07B39] border-[#E07B39]"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {dineInLoading && dineInOrders.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color="#E07B39" />
            </View>
          ) : (
            <ScrollView
              className="flex-1 px-5"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingTop: 14, paddingBottom: 60 }}
              refreshControl={
                <RefreshControl
                  refreshing={dineInLoading}
                  onRefresh={fetchDineInOrders}
                  colors={["#E07B39"]}
                />
              }
            >
              {filteredDineInOrders.length === 0
                ? renderEmpty("Không có đơn tại bàn nào", "Chưa có lượt gọi món tại bàn nào trong mục này.")
                : filteredDineInOrders.map((ord) => {
                    const tableName =
                      ord.tableName || (ord.tableId ? `Bàn #${ord.tableId}` : "Khách tại quầy");
                    const isUpdating = updatingId === ord.id;

                    return (
                      <View
                        key={ord.id}
                        className="bg-white rounded-3xl p-4 mb-3.5 border border-gray-100 shadow-sm"
                      >
                        {/* Header: Table & Status */}
                        <View className="flex-row items-center justify-between pb-3 border-b border-gray-50 mb-3">
                          <View className="flex-row items-center">
                            <View className="w-10 h-10 rounded-2xl bg-teal-50 items-center justify-center mr-3 border border-teal-100">
                              <MaterialCommunityIcons name="table-chair" size={20} color="#0D9488" />
                            </View>
                            <View>
                              <Text className="text-gray-900 font-black text-sm tracking-tight">
                                {tableName}
                              </Text>
                              <Text className="text-gray-400 text-[10px] font-semibold">
                                #{ord.id.slice(-6).toUpperCase()} • {ord.items?.length || 0} món
                              </Text>
                            </View>
                          </View>

                          <View
                            className={`px-2.5 py-1 rounded-full border ${
                              ord.status === "COMPLETED"
                                ? "bg-emerald-50 border-emerald-200"
                                : ord.status === "CANCELLED"
                                ? "bg-rose-50 border-rose-200"
                                : ord.status === "CONFIRMED"
                                ? "bg-blue-50 border-blue-200"
                                : "bg-amber-50 border-amber-200"
                            }`}
                          >
                            <Text
                              className={`text-[10px] font-black ${
                                ord.status === "COMPLETED"
                                  ? "text-emerald-700"
                                  : ord.status === "CANCELLED"
                                  ? "text-rose-700"
                                  : ord.status === "CONFIRMED"
                                  ? "text-blue-700"
                                  : "text-amber-700"
                              }`}
                            >
                              {ord.status}
                            </Text>
                          </View>
                        </View>

                        {/* Items preview */}
                        {ord.items && ord.items.length > 0 && (
                          <View className="bg-gray-50/70 rounded-2xl p-3 mb-3">
                            {ord.items.slice(0, 3).map((item, idx) => (
                              <View
                                key={idx}
                                className="flex-row items-center justify-between py-1"
                              >
                                <Text
                                  className="text-gray-800 text-xs font-semibold flex-1 mr-2"
                                  numberOfLines={1}
                                >
                                  {item.quantity}x {item.name || `Món ăn #${idx + 1}`}
                                </Text>
                                <Text className="text-gray-500 text-xs font-medium">
                                  {((item.price || 0) * item.quantity).toLocaleString("vi-VN")} đ
                                </Text>
                              </View>
                            ))}
                            {ord.items.length > 3 && (
                              <Text className="text-gray-400 text-[10px] mt-1 font-medium italic">
                                +{ord.items.length - 3} món khác...
                              </Text>
                            )}
                          </View>
                        )}

                        {/* Total Amount & Actions */}
                        <View className="flex-row items-center justify-between pt-1">
                          <View>
                            <Text className="text-gray-400 text-[10px] font-bold uppercase">
                              Tổng cộng
                            </Text>
                            <Text className="text-[#E07B39] font-black text-base">
                              {(ord.totalAmount || 0).toLocaleString("vi-VN")} đ
                            </Text>
                          </View>

                          <View className="flex-row items-center space-x-2">
                            {ord.status === "PENDING" && (
                              <TouchableOpacity
                                onPress={() => handleUpdateDineInStatus(ord.id, "CONFIRMED")}
                                disabled={isUpdating}
                                className="bg-[#E07B39] px-3.5 py-2 rounded-xl flex-row items-center"
                              >
                                {isUpdating ? (
                                  <ActivityIndicator size="small" color="white" />
                                ) : (
                                  <>
                                    <MaterialCommunityIcons name="check" size={16} color="white" />
                                    <Text className="text-white font-bold text-xs ml-1">
                                      Nhận đơn
                                    </Text>
                                  </>
                                )}
                              </TouchableOpacity>
                            )}

                            {ord.status === "CONFIRMED" && (
                              <TouchableOpacity
                                onPress={() => handleUpdateDineInStatus(ord.id, "COMPLETED")}
                                disabled={isUpdating}
                                className="bg-emerald-600 px-3.5 py-2 rounded-xl flex-row items-center"
                              >
                                {isUpdating ? (
                                  <ActivityIndicator size="small" color="white" />
                                ) : (
                                  <>
                                    <MaterialCommunityIcons name="cash-check" size={16} color="white" />
                                    <Text className="text-white font-bold text-xs ml-1">
                                      Hoàn tất
                                    </Text>
                                  </>
                                )}
                              </TouchableOpacity>
                            )}

                            {ord.status !== "COMPLETED" && ord.status !== "CANCELLED" && (
                              <TouchableOpacity
                                onPress={() => {
                                  Alert.alert(
                                    "Hủy đơn hàng",
                                    "Bạn có chắc muốn hủy đơn gọi món này không?",
                                    [
                                      { text: "Đóng", style: "cancel" },
                                      {
                                        text: "Hủy đơn",
                                        style: "destructive",
                                        onPress: () => handleUpdateDineInStatus(ord.id, "CANCELLED"),
                                      },
                                    ]
                                  );
                                }}
                                disabled={isUpdating}
                                className="bg-rose-50 border border-rose-200 px-3 py-2 rounded-xl ml-2"
                              >
                                <MaterialCommunityIcons name="close" size={16} color="#E11D48" />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    );
                  })}
            </ScrollView>
          )}
        </>
      )}
    </View>
  );
}
