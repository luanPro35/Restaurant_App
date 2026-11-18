import React, { useMemo, useCallback } from "react";
import { View, Alert, Text } from "react-native";
import { Package, PackageStatusType } from "../../../../services/api/package-api";
import {
  STATUS_MAP,
  NEXT_ACTION_MAP,
  parseOrderItems,
} from "./components/adminOrder.constants";
import AdminOrderHeader from "./components/AdminOrderHeader";
import AdminOrderItemsList from "./components/AdminOrderItemsList";
import AdminOrderInfo from "./components/AdminOrderInfo";
import AdminOrderActions from "./components/AdminOrderActions";

interface AdminOrderCardProps {
  pkg: Package;
  isUpdating?: boolean;
  updatingId?: string | null;
  onUpdateStatus: (pkgId: string, newStatus: PackageStatusType) => void;
  onOpenStatusModal: (pkg: Package) => void;
}

function AdminOrderCard({
  pkg,
  isUpdating: isUpdatingProp,
  updatingId,
  onUpdateStatus,
  onOpenStatusModal,
}: AdminOrderCardProps) {
  const isUpdating = isUpdatingProp !== undefined ? isUpdatingProp : updatingId === pkg.id;
  const statusKey = pkg.status || "PENDING";
  const statusInfo = STATUS_MAP[statusKey] || STATUS_MAP.CONFIRMED;
  const nextAction = NEXT_ACTION_MAP[statusKey];

  const isCompleted = statusKey === "COMPLETED";
  const isCanceled = statusKey === "CANCELED";

  const orderItems = useMemo(() => parseOrderItems(pkg.description), [pkg.description]);
  const totalItemCount = useMemo(
    () =>
      orderItems.reduce(
        (acc, cur) => acc + (cur.quantity ? parseInt(cur.quantity, 10) : 1),
        0
      ),
    [orderItems]
  );

  const handleCancel = useCallback(() => {
    Alert.alert(
      "Xác nhận hủy đơn",
      `Bạn có chắc chắn muốn hủy đơn hàng #${pkg.id.slice(-8).toUpperCase()} của ${
        pkg.name || "khách hàng"
      }?`,
      [
        { text: "Không", style: "cancel" },
        {
          text: "Hủy đơn",
          style: "destructive",
          onPress: () => onUpdateStatus(pkg.id, "CANCELED"),
        },
      ]
    );
  }, [pkg.id, pkg.name, onUpdateStatus]);

  const formattedDate = useMemo(() => {
    return pkg.createdAt
      ? `${new Date(pkg.createdAt).toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        })} - ${new Date(pkg.createdAt).toLocaleDateString("vi-VN")}`
      : "Vừa xong";
  }, [pkg.createdAt]);

  const handleNextStep = useCallback(
    (status: PackageStatusType) => onUpdateStatus(pkg.id, status),
    [pkg.id, onUpdateStatus]
  );

  const handleOpenModal = useCallback(
    () => onOpenStatusModal(pkg),
    [pkg, onOpenStatusModal]
  );

  return (
    <View
      className="bg-white rounded-[28px] p-5 border border-gray-100 shadow-sm overflow-hidden"
      style={{
        marginBottom: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      }}
    >
      {/* 1. HEADER: Khách hàng + Mã đơn + Badge Trạng Thái */}
      <AdminOrderHeader
        name={pkg.name}
        orderId={pkg.id}
        totalItemCount={totalItemCount}
        statusInfo={statusInfo}
      />

      {/* 2. DANH SÁCH MÓN ĂN ĐÃ ĐẶT */}
      <AdminOrderItemsList orderItems={orderItems} />
      {!!pkg.note && <View className="bg-orange-50 rounded-xl p-3 mb-3">
        <Text className="font-bold text-gray-700">Ghi chú của khách</Text>
        <Text className="text-gray-800 mt-1">{pkg.note}</Text>
      </View>}
      {pkg.refundPending && <Text className="text-red-600 font-bold mb-3">Cần đối soát và hoàn tiền cho khách. Chưa xác nhận hoàn tiền.</Text>}

      {/* 3. THÔNG TIN GIAO HÀNG, THANH TOÁN & TỔNG TIỀN */}
      <AdminOrderInfo
        formattedDate={formattedDate}
        address={pkg.address}
        paymentMethod={pkg.paymentMethod}
        price={pkg.price}
      />

      {/* 4. CỤM NÚT THAO TÁC (ACTIONS) */}
      <AdminOrderActions
        nextAction={nextAction}
        isUpdating={isUpdating}
        isCompleted={isCompleted}
        isCanceled={isCanceled}
        onNextStep={handleNextStep}
        onOpenModal={handleOpenModal}
        onCancel={handleCancel}
      />
    </View>
  );
}

export default React.memo(AdminOrderCard);
