import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DeviceEventEmitter, Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TableCard from "../components/TableCard";
import QuickActions from "../components/QuickActions";
import CurrentOrder from "../components/CurrentOrder";
import MenuSection from "../components/MenuSection";
import { useTable } from "../hooks/useTable";
import { useRestaurantCart } from "../context/RestaurantCartContext";
import { MenuItem } from "../../menu/types/index";
import { orderApi } from "../../../services/api/api-order";
import { QuickActionsProps } from "../components/QuickActions";

type TabType = "tables" | "order" | "menu";

export default function AtRestaurant() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>("tables");
  const [currentTableId, setCurrentTableId] = useState<string | null>(null);
  const [currentTable, setCurrentTable] = useState<string>("Chưa chọn");
  const [serverOrders, setServerOrders] = useState<any[]>([]);

  const {
    tables,
    loading,
    refreshing,
    pagination,
    updateTable,
    fetchTables,
    handleRefresh,
    getOrdersByTableId,
  } = useTable();

  const {
    restaurantCartItems,
    clearRestaurantCart,
    updateRestaurantQuantity,
    removeRestaurantItem
  } = useRestaurantCart();

  useEffect(() => {
    fetchTables();

    const subscription = DeviceEventEmitter.addListener(
      "checkoutSuccess",
      () => {
        setActiveTab("tables");
        fetchTables();
      },
    );

    return () => {
      subscription.remove();
    };
  }, [fetchTables]);

  useEffect(() => {
    const loadTableOrder = async () => {
      if (currentTableId) {
        try {
          const order = await getOrdersByTableId(currentTableId);
          if (order) {
            setServerOrders(mapOrderItems(order));
          } else {
            setServerOrders([]);
          }
        } catch (error) {
          console.error("Failed to load table order:", error);
          setServerOrders([]);
        }
      }
    };
    loadTableOrder();
  }, [currentTableId, activeTab]);

  const requestBill = (order: any) => {
    if (!order || !order.items) return "Không có thông tin hóa đơn.";
    const itemsSummary = order.items
      .map((item: any) => `• ${item.name} x${item.quantity}: ${(item.price * item.quantity).toLocaleString("vi-VN")}đ`)
      .join("\n");
    const total = order.totalAmount.toLocaleString("vi-VN");

    return `Chi tiết hóa đơn - ${currentTable}:\n\n${itemsSummary}\n\n━━━━━━━━━━━━━━━\nTổng cộng: ${total}đ`;
  };

  const handleRequestBill = () => {
    Alert.alert(
      "Yêu cầu bill",
      "Bạn có chắc chắn muốn yêu cầu bill không?",
      [
        {
          text: "Hủy",
          onPress: () => { },
          style: "cancel",
        },
        {
          text: "Đồng ý",
          onPress: async () => {
            if (!currentTableId) return;
            try {
              const activeOrder = await getOrdersByTableId(currentTableId);
              if (activeOrder && activeOrder.id) {
                await orderApi.updateOrderStatus(activeOrder.id, "COMPLETED");
                await updateTable(currentTableId, { status: "AVAILABLE" });
                setServerOrders([]);
                clearRestaurantCart();
                await fetchTables();
                setActiveTab("tables");

                Alert.alert("Thanh toán thành công", requestBill(activeOrder));
              } else {
                await updateTable(currentTableId, { status: "AVAILABLE" });
                await fetchTables();
                setActiveTab("tables");
                Alert.alert("Thông báo", "Bàn đã được đặt lại trạng thái trống.");
              }
            } catch (error: any) {
              console.error("Failed to request bill FULL ERROR:", error.response?.data || error);
              const errorMessage = error.response?.data?.message
                ? (Array.isArray(error.response.data.message) ? error.response.data.message.join(", ") : error.response.data.message)
                : "Không thể xử lý yêu cầu bill.";
              Alert.alert("Lỗi", errorMessage);
            }
          },
        },
      ]
    );
  };

  const mapOrderItems = (order: any) => {
    const actualOrder = order?.data || order;
    if (!actualOrder || !actualOrder.items) return [];

    return actualOrder.items.map((item: any) => ({
      id: item.id || item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      isServerItem: true,
    }));
  };

  const handleConfirmOrder = async () => {
    if (!currentTableId || restaurantCartItems.length === 0) return;

    try {
      const activeOrder = await getOrdersByTableId(currentTableId);

      const orderItemsToSubmit = restaurantCartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        note: "",
      }));

      if (activeOrder && activeOrder.id) {
        await orderApi.addItemsToOrder(activeOrder.id, orderItemsToSubmit);
      } else {
        await orderApi.createOrder({
          tableId: currentTableId,
          items: orderItemsToSubmit,
          type: "DINE_IN",
        });
      }

      const updatedOrder = await getOrdersByTableId(currentTableId);
      if (updatedOrder) {
        setServerOrders(mapOrderItems(updatedOrder));
      }

      await fetchTables();
      clearRestaurantCart();
      Alert.alert("Thành công", "Đơn hàng đã được ghi nhận");
    } catch (error) {
      console.error("Failed to confirm order:", error);
      Alert.alert("Lỗi", "Không thể gửi đơn hàng");
    }
  };

  const orderItems = useMemo(() => {
    return Array.isArray(restaurantCartItems) ? restaurantCartItems.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      isServerItem: false,
    })) : [];
  }, [restaurantCartItems]);

  const mapStatus = (status: string): "available" | "occupied" => {
    const s = (status || "").toUpperCase();
    switch (s) {
      case "AVAILABLE":
        return "available";
      case "OCCUPIED":
        return "occupied";
      default:
        return "available";
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "tables":
        return (
          <ScrollView className="flex-1 px-4 pt-4">
            <View className="bg-orange-100 rounded-2xl p-4 mb-4 flex-row items-center">
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={40}
                color="#E07B39"
              />
              <View className="flex-1 ml-3">
                <Text className="text-gray-800 font-bold text-base">
                  Quét mã QR
                </Text>
                <Text className="text-gray-600 text-sm">
                  Quét mã QR trên bàn để check-in
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#E07B39"
              />
            </View>

            <Text className="text-xl font-bold text-gray-800 mb-4">
              Chọn bàn
            </Text>
            <View className="flex-row flex-wrap justify-between">
              {Array.isArray(tables) && tables.map((table) => (
                <TableCard
                  key={table.id}
                  tableNumber={table.name}
                  capacity={table.capacity}
                  status={mapStatus(table.status)}
                  onPress={async () => {
                    setCurrentTableId(table.id);
                    setCurrentTable(table.name);
                    const status = (table.status || "").toUpperCase();
                    if (status === "OCCUPIED") {
                      setActiveTab("order");
                    } else {
                      setServerOrders([]);
                      setActiveTab("menu");
                    }
                  }}
                />
              ))}
            </View>
          </ScrollView>
        );

      case "order":
        const allItems = [...(Array.isArray(serverOrders) ? serverOrders : []), ...(Array.isArray(orderItems) ? orderItems : [])];
        return (
          <ScrollView className="flex-1 pt-4">
            <QuickActions onRequestBill={handleRequestBill} />
            <CurrentOrder
              items={allItems}
              tableNumber={currentTable}
              onAddMore={() => setActiveTab("menu")}
              onConfirm={handleConfirmOrder}
              onUpdateQuantity={updateRestaurantQuantity}
              onRemoveItem={removeRestaurantItem}
            />
          </ScrollView>
        );

      case "menu":
        return (
          <MenuSection
            onAddItem={() => {
              setActiveTab("order");
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View className="flex-1 bg-[#F9F6E7]">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <View
        className="bg-[#E07B39] pb-12 px-4 rounded-b-[48px] shadow-2xl"
        style={{ paddingTop: Math.max(insets.top, 20) + 25 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-3 p-1"
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color="white"
              />
            </TouchableOpacity>
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={28}
              color="white"
            />
            <Text className="text-white text-2xl font-black ml-3">Tại Quán</Text>
          </View>
          <View className="flex-row items-center bg-white/30 px-4 py-2.5 rounded-2xl border border-white/20">
            <MaterialCommunityIcons
              name="table-furniture"
              size={22}
              color="white"
            />
            <Text className="text-white font-black ml-2 text-base">
              {currentTable.startsWith("Bàn") ? currentTable : `Bàn ${currentTable}`}
            </Text>
          </View>
        </View>
      </View>

      <View className="bg-white mx-4 mt-4 rounded-2xl shadow-md flex-row">
        <TouchableOpacity
          onPress={() => setActiveTab("tables")}
          className={`flex-1 py-4 items-center rounded-2xl ${activeTab === "tables" ? "bg-orange-500" : ""
            }`}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="table-furniture"
            size={24}
            color={activeTab === "tables" ? "white" : "#9CA3AF"}
          />
          <Text
            className={`mt-1 font-semibold ${activeTab === "tables" ? "text-white" : "text-gray-400"
              }`}
          >
            Bàn
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("order")}
          className={`flex-1 py-4 items-center rounded-2xl ${activeTab === "order" ? "bg-orange-500" : ""
            }`}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="receipt"
            size={24}
            color={activeTab === "order" ? "white" : "#9CA3AF"}
          />
          <Text
            className={`mt-1 font-semibold ${activeTab === "order" ? "text-white" : "text-gray-400"
              }`}
          >
            Đơn hàng
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("menu")}
          className={`flex-1 py-4 items-center rounded-2xl ${activeTab === "menu" ? "bg-orange-500" : ""
            }`}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="food"
            size={24}
            color={activeTab === "menu" ? "white" : "#9CA3AF"}
          />
          <Text
            className={`mt-1 font-semibold ${activeTab === "menu" ? "text-white" : "text-gray-400"
              }`}
          >
            Thực đơn
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 mt-2">{renderTabContent()}</View>
    </View>
  );
}
