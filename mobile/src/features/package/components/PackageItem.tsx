import React, { useState } from "react";
import { View, Alert } from "react-native";
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
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  // Chỉ Admin hoặc Staff mới có quyền cập nhật trạng thái
  const isAdminOrStaff = user?.role === "ADMIN" || user?.role === "STAFF";
  const statusKey = (pack.status === "PENDING" ? "CONFIRMED" : pack.status) || "CONFIRMED";

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