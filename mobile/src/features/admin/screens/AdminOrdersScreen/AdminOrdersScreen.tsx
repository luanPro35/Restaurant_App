import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
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
import DineInOrderCard from "./components/DineInOrderCard";
import PackageStatusModal from "../../../package/components/PackageStatusModal";

const DINE_IN_TABS = [
  { id: "ALL", label: "Tất cả" },
  { id: "PENDING", label: "Chờ xác nhận" },
  { id: "CONFIRMED", label: "Đang phục vụ" },
  { id: "COMPLETED", label: "Hoàn tất" },
  { id: "CANCELLED", label: "Đã hủy" },
];

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

  // Tải dữ liệu khi màn hình được Focus, ngăn chặn vòng lặp vô hạn
  useFocusEffect(
    useCallback(() => {
      refreshPackages();
      fetchDineInOrders();
    }, [refreshPackages, fetchDineInOrders])
  );

  // Filter Delivery Packages (Memoized)
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      if (activeTab === "ALL") return true;
      return pkg.status === activeTab;
    });
  }, [packages, activeTab]);

  // Filter Dine-in Orders (Memoized)
  const filteredDineInOrders = useMemo(() => {
    return dineInOrders.filter((ord) => {
      if (dineInTab === "ALL") return true;
      return ord.status === dineInTab;
    });
  }, [dineInOrders, dineInTab]);

  // Update Package Status
  const handleUpdatePackageStatus = useCallback(
    async (pkgId: string, newStatus: PackageStatusType) => {
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
    },
    [refreshPackages]
  );

  // Update Dine-in Order Status
  const handleUpdateDineInStatus = useCallback(
    async (orderId: string, newStatus: string) => {
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
    },
    [fetchDineInOrders]
  );

  const handleOpenPackageModal = useCallback((targetPkg: Package) => {
    setSelectedPkgForModal(targetPkg);
  }, []);

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

  const renderEmpty = useCallback((title: string, subtitle: string) => (
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
  ), []);

  const renderPackageItem = useCallback(
    ({ item }: { item: Package }) => (
      <AdminOrderCard
        pkg={item}
        isUpdating={updatingId === item.id}
        onUpdateStatus={handleUpdatePackageStatus}
        onOpenStatusModal={handleOpenPackageModal}
      />
    ),
    [updatingId, handleUpdatePackageStatus, handleOpenPackageModal]
  );

  const renderDineInItem = useCallback(
    ({ item }: { item: Order }) => (
      <DineInOrderCard
        ord={item}
        isUpdating={updatingId === item.id}
        onUpdateStatus={handleUpdateDineInStatus}
      />
    ),
    [updatingId, handleUpdateDineInStatus]
  );

  const packageKeyExtractor = useCallback((item: Package) => item.id, []);
  const dineInKeyExtractor = useCallback((item: Order) => item.id, []);

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

          <FlatList
            key="admin-packages-list"
            data={filteredPackages}
            keyExtractor={packageKeyExtractor}
            renderItem={renderPackageItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 14,
              paddingBottom: 60,
              flexGrow: 1,
            }}
            initialNumToRender={5}
            maxToRenderPerBatch={6}
            windowSize={5}
            removeClippedSubviews={Platform.OS === "android"}
            refreshControl={
              <RefreshControl
                refreshing={pkgLoading}
                onRefresh={refreshPackages}
                colors={["#E07B39"]}
              />
            }
            ListEmptyComponent={
              pkgLoading && packages.length === 0 ? (
                <View className="flex-1 items-center justify-center pt-24">
                  <ActivityIndicator size="large" color="#E07B39" />
                </View>
              ) : (
                renderEmpty(
                  "Không có gói giao hàng nào",
                  "Không tìm thấy gói đơn nào trong bộ lọc này."
                )
              )
            }
          />

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
              {DINE_IN_TABS.map((tab) => {
                const isSelected = dineInTab === tab.id;
                const tabCount =
                  tab.id === "ALL"
                    ? dineInOrders.length
                    : dineInOrders.filter((o) => o.status === tab.id).length;

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
                      {tab.label} {tabCount > 0 ? `(${tabCount})` : ""}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <FlatList
            key="admin-dine-in-list"
            data={filteredDineInOrders}
            keyExtractor={dineInKeyExtractor}
            renderItem={renderDineInItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 14,
              paddingBottom: 60,
              flexGrow: 1,
            }}
            initialNumToRender={5}
            maxToRenderPerBatch={6}
            windowSize={5}
            removeClippedSubviews={Platform.OS === "android"}
            refreshControl={
              <RefreshControl
                refreshing={dineInLoading}
                onRefresh={fetchDineInOrders}
                colors={["#E07B39"]}
              />
            }
            ListEmptyComponent={
              dineInLoading && dineInOrders.length === 0 ? (
                <View className="flex-1 items-center justify-center pt-24">
                  <ActivityIndicator size="large" color="#E07B39" />
                </View>
              ) : (
                renderEmpty(
                  "Không có đơn tại bàn nào",
                  "Chưa có lượt gọi món tại bàn nào trong mục này."
                )
              )
            }
          />
        </>
      )}
    </View>
  );
}
