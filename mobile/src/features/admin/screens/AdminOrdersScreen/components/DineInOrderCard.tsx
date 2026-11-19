import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Order } from "../../../../../services/api/api-order";

interface DineInOrderCardProps {
  ord: Order;
  isUpdating: boolean;
  onUpdateStatus: (orderId: string, newStatus: string) => void;
}

function DineInOrderCard({
  ord,
  isUpdating,
  onUpdateStatus,
}: DineInOrderCardProps) {
  const tableName =
    ord.tableName || (ord.tableId ? `Bàn #${ord.tableId}` : "Khách tại quầy");

  const handleConfirm = useCallback(() => {
    onUpdateStatus(ord.id, "CONFIRMED");
  }, [ord.id, onUpdateStatus]);

  const handleComplete = useCallback(() => {
    onUpdateStatus(ord.id, "COMPLETED");
  }, [ord.id, onUpdateStatus]);

  const handleCancel = useCallback(() => {
    Alert.alert(
      "Hủy đơn hàng",
      "Bạn có chắc muốn hủy đơn gọi món này không?",
      [
        { text: "Đóng", style: "cancel" },
        {
          text: "Hủy đơn",
          style: "destructive",
          onPress: () => onUpdateStatus(ord.id, "CANCELLED"),
        },
      ]
    );
  }, [ord.id, onUpdateStatus]);

  return (
    <View
      className="bg-white rounded-3xl p-4 mb-3.5 border border-gray-100 shadow-sm"
      style={{
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      }}
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

        <View className="flex-row items-center gap-x-2">
          {ord.status === "PENDING" && (
            <TouchableOpacity
              onPress={handleConfirm}
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
              onPress={handleComplete}
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
              onPress={handleCancel}
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
}

export default React.memo(DineInOrderCard);
