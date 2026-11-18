import React, { useState, useRef } from "react";
import { View, Alert, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { packageApi, Package, PackageStatusType } from "../../../services/api/package-api";
import { useAuth } from "../../../app/context/AuthContext";
import PackageHeader from "./PackageHeader";
import PackageProgressStep, { PACKAGE_STEPS } from "./PackageProgressStep";
import PackageStatusCard from "./PackageStatusCard";
import PackageStatusModal from "./PackageStatusModal";

interface PackageItemProps {
  pack: Package;
  onRefresh?: () => void;
}

export default function PackageItem({ pack, onRefresh }: PackageItemProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const cancelInFlight = useRef(false);
  const canCancel = ["PENDING", "CONFIRMED"].includes(pack.status);
  const handleCancel = () => {
    if (cancelInFlight.current) return;
    Alert.alert("Hủy đơn hàng?", "Bạn có thể hủy khi quán chưa bắt đầu nấu. Nếu đã chuyển khoản, quán sẽ đối soát và hoàn tiền; việc hoàn tiền không diễn ra tự động.", [
      { text: "Giữ đơn", style: "cancel" },
      { text: "Hủy đơn", style: "destructive", onPress: async () => {
        if (cancelInFlight.current) return;
        cancelInFlight.current = true;
        setLoading(true);
        try {
          const result = await packageApi.cancel(pack.id);
          Alert.alert("Đã hủy đơn", result.refundPending
            ? "Quán sẽ đối soát và hoàn tiền. Vui lòng liên hệ nhà hàng để xác nhận thời gian nhận tiền."
            : "Đơn hàng đã được hủy thành công.");
        } catch (error: any) {
          const message = Array.isArray(error?.response?.data?.message)
            ? error.response.data.message.join("\n")
            : error?.response?.data?.message;
          Alert.alert("Không thể hủy đơn", message || "Vui lòng kiểm tra kết nối và thử lại.");
        } finally {
          cancelInFlight.current = false;
          setLoading(false);
          onRefresh?.();
        }
      } },
    ]);
  };
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  // Chỉ Admin hoặc Staff mới có quyền cập nhật trạng thái
  const isAdminOrStaff = user?.role === "ADMIN" || user?.role === "STAFF";
  const statusKey = pack.status || "PENDING";

  const stepOrder = ["CONFIRMED", "COOKING", "DELIVERING", "RECEIVED", "COMPLETED"];
  const currentStepIndex = statusKey === "CANCELED" ? -1 : Math.max(0, stepOrder.indexOf(statusKey));

  // Hàm cập nhật trạng thái (Dành riêng cho Admin / Staff)
  const handleUpdateStatus = async (newStatus: PackageStatusType) => {
    if (!isAdminOrStaff) {
      Alert.alert("Thông báo", "Chỉ quản trị viên hoặc nhân viên mới có quyền cập nhật trạng thái.");
      return;
    }

    if (newStatus === pack.status) {
      setStatusModalVisible(false);
      return;
    }

    setLoading(true);
    setStatusModalVisible(false);
    try {
      await packageApi.update(pack.id, { status: newStatus });
      onRefresh?.();
    } catch (error: any) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error?.response?.data || error?.message || error);
      const serverMsg = Array.isArray(error?.response?.data?.message)
        ? error.response.data.message.join("\n")
        : error?.response?.data?.message;
      Alert.alert("Lỗi", serverMsg || "Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Chuyển nhanh sang nấc tiếp theo
  const handleNextStep = () => {
    if (currentStepIndex < stepOrder.length - 1) {
      const nextStatus = stepOrder[currentStepIndex + 1] as PackageStatusType;
      handleUpdateStatus(nextStatus);
    }
  };

  return (
    <View className="bg-white rounded-3xl mx-4 mb-6 shadow-xl elevation-5 overflow-hidden border border-gray-100">
      {/* 1. Header hiển thị mã đơn & tổng tiền */}
      <PackageHeader pack={pack} />

      {/* 2. Thanh tiến trình 5 bước hoặc cảnh báo đơn hủy */}
      <PackageProgressStep status={statusKey} />

      {/* 3. Thẻ mô tả trạng thái & Nút thao tác (hoặc Banner dành cho khách) */}
      <PackageStatusCard
        status={statusKey}
        isAdminOrStaff={isAdminOrStaff}
        loading={loading}
        onOpenStatusModal={() => setStatusModalVisible(true)}
        onNextStep={handleNextStep}
      />
      {!isAdminOrStaff && canCancel && <View className="mx-4 mb-4">
        <Text className="text-xs text-gray-500 mb-2">Bạn có thể hủy trước khi nhà hàng bắt đầu nấu.</Text>
        <TouchableOpacity onPress={handleCancel} disabled={loading} accessibilityRole="button"
          className="border border-red-300 bg-red-50 rounded-2xl p-3 items-center">
          {loading ? <ActivityIndicator color="#DC2626" /> : <Text className="text-red-600 font-bold">Hủy đơn hàng</Text>}
        </TouchableOpacity>
      </View>}
      {pack.refundPending && <Text className="mx-4 mb-4 text-sm text-red-600">Đơn đã hủy. Quán cần đối soát và hoàn tiền cho bạn; chưa xác nhận hoàn tiền.</Text>}

      {/* 4. Modal chọn trạng thái (Chỉ kích hoạt khi là Admin / Staff) */}
      {isAdminOrStaff && (
        <PackageStatusModal
          visible={statusModalVisible}
          currentStatus={pack.status}
          packageId={pack.id}
          onClose={() => setStatusModalVisible(false)}
          onSelectStatus={handleUpdateStatus}
        />
      )}
    </View>
  );
}
