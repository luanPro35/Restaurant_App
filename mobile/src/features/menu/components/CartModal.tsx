import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  TextInput,
  Platform,
  UIManager,
  LayoutAnimation,
} from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CartItem } from "../types";
import { formatCurrency } from "../../../shared/utils";
import { Promotion as Voucher } from "../../promotion/types/promotion.types";
import { usePromotion } from "../../promotion/hooks/usePromotion";
import { useMilestones } from "../../profile/games/hooks/useMilestones";
import { MILESTONES } from "../../profile/games/constants/milestones";
import { useUsedVouchers } from "../../promotion/hooks/useUsedVouchers";

const { height } = Dimensions.get("window");

interface CartModalProps {
  visible: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  selectedVoucher: Voucher | null;
  onApplyVoucher: (voucher: Voucher) => void;
  onRemoveVoucher: () => void;
  discountAmount: number;
  subtotal: number;
  totalPrice: number;
}

export default function CartModal({
  visible,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  selectedVoucher,
  onApplyVoucher,
  onRemoveVoucher,
  discountAmount,
  subtotal,
  totalPrice,
}: CartModalProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const [quantityInput, setQuantityInput] = React.useState("");
  const [isVoucherModalVisible, setIsVoucherModalVisible] = React.useState(false);

  const { promotions } = usePromotion();
  const { claimedIds } = useMilestones();
  const { usedCodes } = useUsedVouchers();

  const availableVouchers = React.useMemo(() => {
    const promoVouchers = promotions.filter(p => !!p.code).map(p => ({
      ...p,
      isUsed: usedCodes.includes(p.code || ""),
      isApplicable: subtotal >= (p.minOrder || 0)
    }));

    const milestoneVouchers = MILESTONES.filter(m => claimedIds.includes(m.id)).map(m => {
      const code = `REWARD${m.id}`;
      return {
        id: `m-${m.id}`,
        name: `Mốc ${m.label}`,
        discount: parseInt(m.reward.replace("k", "000")),
        code,
        description: "Phần thưởng thử thách",
        minOrder: 0,
        until: "Vô thời hạn",
        isUsed: usedCodes.includes(code),
        isApplicable: true
      } as any;
    });
    return [...promoVouchers, ...milestoneVouchers];
  }, [promotions, claimedIds, usedCodes, subtotal]);

  const totalQuantity = React.useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  React.useEffect(() => {
    setQuantityInput(String(totalQuantity));
  }, [totalQuantity]);

  const handleTotalQuantitySubmit = () => {
    const newTotal = parseInt(quantityInput);
    if (isNaN(newTotal) || newTotal < 1 || totalQuantity === 0) {
      setQuantityInput(String(totalQuantity));
      return;
    }
    const ratio = newTotal / totalQuantity;
    items.forEach((item) => {
      const newQty = Math.max(1, Math.round(item.quantity * ratio));
      onUpdateQuantity(item.id, newQty);
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />

        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            height: height * 0.85, // Use fixed height to ensure ScrollView expands
          }}
          className="bg-[#FDFCF7] rounded-t-[32px] shadow-2xl"
        >
          <View className="items-center pt-3 pb-1 flex-shrink-0">
            <View className="w-10 h-1 rounded-full bg-gray-300" />
          </View>

          <View className="flex-row justify-between items-center px-6 pb-4 pt-2 border-b border-gray-100 flex-shrink-0">
            <View className="flex-row items-center">
              <View className="w-11 h-11 rounded-2xl bg-[#FFF3E8] items-center justify-center mr-3">
                <MaterialCommunityIcons
                  name="cart-outline"
                  size={24}
                  color="#E07B39"
                />
              </View>
              <View>
                <Text className="text-xl font-black text-gray-800">
                  Giỏ hàng
                </Text>
                <Text className="text-xs text-gray-400 mt-0.5">
                  {totalQuantity > 0
                    ? `${totalQuantity} món · ${items.length} loại`
                    : "Chưa có món nào"}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center"
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="close" size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingVertical: 16,
              paddingBottom: 30,
            }}
            showsVerticalScrollIndicator={false}
          >
            {items.length === 0 ? (
              <View className="items-center justify-center py-20">
                <View className="w-28 h-28 rounded-full bg-gray-100 items-center justify-center mb-5">
                  <MaterialCommunityIcons
                    name="cart-remove"
                    size={56}
                    color="#D1D5DB"
                  />
                </View>
                <Text className="text-lg font-bold text-gray-400">
                  Giỏ hàng trống
                </Text>
                <Text className="text-sm text-gray-300 mt-1">
                  Hãy thêm món ăn yêu thích của bạn
                </Text>
              </View>
            ) : (
              <View className="flex-1">
                <View className="mb-6">
                  {items.map((item, index) => (
                    <View
                      key={item.id}
                      className={`flex-row bg-white rounded-3xl p-4 shadow-sm border border-gray-50 ${
                        index < items.length - 1 ? "mb-3" : ""
                      }`}
                      style={{ elevation: 2, minHeight: 100 }}
                    >
                      <View className="flex-1 ml-1 justify-between">
                        <View>
                          <Text
                            className="text-[15px] font-bold text-gray-800"
                            numberOfLines={1}
                          >
                            {item.name}
                          </Text>
                          <Text className="text-[12px] text-gray-400 mt-0.5">
                            {formatCurrency(item.price)}
                          </Text>
                        </View>

                        <View className="flex-row items-center justify-between mt-2">
                          <View className="flex-row items-center bg-gray-50 rounded-xl px-1 py-0.5">
                            <TouchableOpacity
                              onPress={() =>
                                onUpdateQuantity(item.id, item.quantity - 1)
                              }
                              className="w-8 h-8 rounded-lg bg-white justify-center items-center shadow-sm"
                              activeOpacity={0.7}
                            >
                              <MaterialCommunityIcons
                                name="minus"
                                size={16}
                                color="#E07B39"
                              />
                            </TouchableOpacity>

                            <TextInput
                              className="mx-2 text-[14px] font-black text-gray-800 min-w-[30px] text-center bg-transparent"
                              value={String(item.quantity)}
                              keyboardType="numeric"
                              onChangeText={(text) => {
                                const val = parseInt(text);
                                if (!isNaN(val)) onUpdateQuantity(item.id, val);
                              }}
                            />

                            <TouchableOpacity
                              onPress={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                              }
                              className="w-8 h-8 rounded-lg bg-[#E07B39] justify-center items-center shadow-sm"
                              activeOpacity={0.7}
                            >
                              <MaterialCommunityIcons
                                name="plus"
                                size={16}
                                color="white"
                              />
                            </TouchableOpacity>
                          </View>

                          <View className="flex-row items-center">
                            <Text className="text-[16px] font-black text-[#E07B39] mr-2">
                              {formatCurrency(item.price * item.quantity)}
                            </Text>

                            <TouchableOpacity
                              onPress={() => {
                                LayoutAnimation.configureNext(
                                  LayoutAnimation.Presets.spring,
                                );
                                onRemoveItem(item.id);
                              }}
                              className="bg-red-50 p-2 rounded-lg"
                              activeOpacity={0.7}
                            >
                              <MaterialCommunityIcons
                                name="trash-can-outline"
                                size={20}
                                color="#EF4444"
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                <View className="mb-6">
                  <View className="flex-row items-center mb-3 ml-1">
                    <View className="w-1.5 h-5 bg-[#E07B39] rounded-full mr-3" />
                    <Text className="text-[14px] font-black text-slate-800 uppercase tracking-widest">
                      Chi tiết hóa đơn
                    </Text>
                  </View>

                  <View className="bg-white rounded-3xl p-4 shadow-sm border border-gray-50">
                    <View className="flex-row justify-between items-center mb-4 px-1">
                      <Text className="text-[14px] font-bold text-slate-400">
                        Tạm tính
                      </Text>
                      <Text className="text-lg font-black text-slate-800">
                        {formatCurrency(subtotal)}
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center mb-4 px-1">
                      <Text className="text-[14px] font-bold text-slate-400">
                        Phí giao hàng
                      </Text>
                      <Text className="text-[14px] font-bold text-green-500">
                        Miễn phí
                      </Text>
                    </View>

                    {selectedVoucher && (
                      <View className="flex-row justify-between items-center mb-4 px-1">
                        <View className="flex-row items-center">
                          <Text className="text-[14px] font-bold text-slate-400 mr-2">
                            Giảm giá
                          </Text>
                          <View className="bg-red-50 px-2 py-0.5 rounded-lg border border-red-100">
                            <Text className="text-[10px] font-black text-red-500 uppercase">
                              {selectedVoucher.code}
                            </Text>
                          </View>
                        </View>
                        <Text className="text-base font-black text-red-500">
                          -{formatCurrency(discountAmount)}
                        </Text>
                      </View>
                    )}

                    <View className="border-t border-dashed border-gray-200 my-4" />

                    <View className="flex-row justify-between items-center px-1">
                      <Text className="text-base font-bold text-gray-800">
                        Tổng thanh toán
                      </Text>
                      <Text className="text-xl font-black text-[#E07B39]">
                        {formatCurrency(totalPrice)}
                      </Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setIsVoucherModalVisible(true)}
                  activeOpacity={0.7}
                  className="bg-orange-50/50 border border-dashed border-orange-200 rounded-2xl p-4 mb-5 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 rounded-xl bg-orange-100 items-center justify-center mr-3">
                      <MaterialCommunityIcons
                        name="ticket-percent"
                        size={20}
                        color="#E07B39"
                      />
                    </View>
                    <View>
                      <Text className="text-[14px] font-black text-gray-800">
                        {selectedVoucher
                          ? `Đã áp dụng: ${selectedVoucher.name}`
                          : "Dùng mã giảm giá"}
                      </Text>
                      <Text className="text-[11px] text-orange-500 font-bold">
                        {selectedVoucher
                          ? "Nhấn để đổi mã khác"
                          : "Chọn voucher để được giảm giá thêm"}
                      </Text>
                    </View>
                  </View>
                  {selectedVoucher ? (
                    <TouchableOpacity onPress={onRemoveVoucher} className="p-1">
                      <MaterialCommunityIcons
                        name="close-circle"
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                  ) : (
                    <MaterialCommunityIcons
                      name="chevron-right"
                      size={20}
                      color="#E07B39"
                    />
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          {items.length > 0 && (
            <View 
              className="px-6 pt-5 bg-white border-t border-gray-50 flex-shrink-0"
              style={{ 
                paddingBottom: Math.max(insets.bottom, 24),
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -8 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 10
              }}
            >
              <TouchableOpacity 
                onPress={onCheckout} 
                activeOpacity={0.8}
                style={{ borderRadius: 20, overflow: 'hidden' }}
              >
                <LinearGradient
                  colors={["#E07B39", "#C96A2E"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ height: 58, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}
                >
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={22}
                    color="white"
                  />
                  <Text 
                    className="text-white text-[16px] font-black ml-2 uppercase tracking-tight"
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    Đặt đơn ngay · {formatCurrency(totalPrice)}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
      <Modal
        visible={isVoucherModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVoucherModalVisible(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-[32px] p-6 h-[70%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-black text-gray-800">Chọn Voucher</Text>
              <TouchableOpacity onPress={() => setIsVoucherModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {availableVouchers.length === 0 ? (
                <View className="py-10 items-center">
                  <MaterialCommunityIcons name="ticket-outline" size={48} color="#ccc" />
                  <Text className="text-gray-400 mt-2">Bạn không có voucher nào</Text>
                </View>
              ) : (
                availableVouchers.map(v => (
                  <TouchableOpacity
                    key={v.id}
                    disabled={v.isUsed || !v.isApplicable}
                    onPress={() => {
                      onApplyVoucher(v);
                      setIsVoucherModalVisible(false);
                    }}
                    className={`p-4 rounded-2xl mb-3 border-2 ${selectedVoucher?.id === v.id ? 'border-orange-500 bg-orange-50' : 'border-gray-100 bg-gray-50'}`}
                    style={{ opacity: (v.isUsed || !v.isApplicable) ? 0.4 : 1 }}
                  >
                    <View className="flex-row justify-between items-center">
                      <View style={{ flex: 1 }}>
                        <View className="flex-row items-center mb-1">
                          <Text className="font-black text-gray-800 text-base mr-2">{v.name}</Text>
                          {v.isUsed && (
                            <View className="bg-gray-200 px-2 py-0.5 rounded-md">
                              <Text className="text-[10px] font-bold text-gray-500">ĐÃ DÙNG</Text>
                            </View>
                          )}
                          {!v.isApplicable && !v.isUsed && (
                            <View className="bg-red-50 px-2 py-0.5 rounded-md">
                              <Text className="text-[10px] font-bold text-red-500">KHÔNG ĐỦ MIN</Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-orange-500 font-bold">-{v.discount > 100 ? formatCurrency(v.discount) : `${v.discount}%`}</Text>
                        <Text className="text-[11px] text-gray-400 mt-1">{v.description || "Dùng cho mọi đơn hàng"}</Text>
                        {!v.isApplicable && !v.isUsed && (
                          <Text className="text-[10px] text-red-500 mt-1 font-bold">Cần thêm {formatCurrency((v.minOrder || 0) - subtotal)} nữa</Text>
                        )}
                      </View>
                      {selectedVoucher?.id === v.id && (
                        <MaterialCommunityIcons name="check-circle" size={24} color="#E07B39" />
                      )}
                      {(v.isUsed || !v.isApplicable) && !selectedVoucher?.id === v.id && (
                        <MaterialCommunityIcons name="lock-outline" size={20} color="#ccc" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
