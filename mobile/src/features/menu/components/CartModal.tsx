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
import { CartItem } from "../types";
import { formatCurrency } from "../../../shared/utils";
import { useNavigation } from "@react-navigation/native";

const { height } = Dimensions.get("window");

interface CartModalProps {
  visible: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export default function CartModal({
  visible,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartModalProps) {
  const slideAnim = React.useRef(new Animated.Value(height)).current;
  const [quantityInput, setQuantityInput] = React.useState("");
  const [name, setName] = React.useState("");

  const totalPrice = React.useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

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
            maxHeight: height * 0.85,
          }}
          className="bg-[#FDFCF7] rounded-t-[32px] shadow-2xl flex-shrink-1"
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
              items.map((item, index) => (
                <View
                  key={item.id}
                  className={`flex-row bg-white rounded-3xl p-3 shadow-sm border border-gray-50 ${
                    index < items.length - 1 ? "mb-3" : ""
                  }`}
                  style={{ elevation: 1 }}
                >
                  <View className="relative">
                    <View className="absolute -top-1 -right-1 bg-[#E07B39] rounded-full w-6 h-6 items-center justify-center shadow-sm">
                      <TextInput
                        className="text-sm text-gray-500 font-semibold border border-orange-400 rounded-lg px-2 py-1.5 min-w-[36px] text-center"
                        value={quantityInput}
                        keyboardType="numeric"
                        onChangeText={setQuantityInput}
                        onSubmitEditing={handleTotalQuantitySubmit}
                        onBlur={handleTotalQuantitySubmit}
                        selectTextOnFocus
                      />
                    </View>
                  </View>

                  <View className="flex-1 ml-3 justify-between">
                    <View>
                      <Text
                        className="text-[15px] font-bold text-gray-800"
                        numberOfLines={2}
                      >
                        {item.name}
                      </Text>
                      <Text className="text-[13px] text-gray-400 mt-0.5">
                        Đơn giá: {formatCurrency(item.price)}
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
                          className="mx-3 text-[15px] font-black text-gray-800 min-w-[28px] text-center bg-transparent"
                          defaultValue={String(item.quantity)}
                          keyboardType="numeric"
                          onSubmitEditing={(e) => {
                            const newQty = parseInt(e.nativeEvent.text);
                            if (!isNaN(newQty) && newQty > 0) {
                              onUpdateQuantity(item.id, newQty);
                            } else {
                              onUpdateQuantity(item.id, item.quantity);
                            }
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
                        <Text className="text-[17px] font-black text-[#E07B39] mr-2">
                          {formatCurrency(item.price * item.quantity)}
                        </Text>

                        <TouchableOpacity
                          onPress={() => {
                            LayoutAnimation.configureNext(
                              LayoutAnimation.Presets.spring,
                            );
                            onRemoveItem(item.id);
                          }}
                          className="bg-red-50 p-2 rounded-lg -mr-2"
                          activeOpacity={0.7}
                        >
                          <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={22}
                            color="#EF4444"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {items.length > 0 && (
            <View className="px-6 pt-4 pb-8 bg-white border-t border-gray-100 rounded-t-3xl shadow-lg flex-shrink-0">
              <View className="mb-6">
                <View className="flex-row items-center mb-3 ml-1">
                  <View className="w-1.5 h-5 bg-[#E07B39] rounded-full mr-3" />
                  <Text className="text-[14px] font-black text-slate-800 uppercase tracking-widest">
                    Chi tiết hóa đơn
                  </Text>
                </View>

                <View className="bg-slate-50/50 rounded-[32px] p-2 border border-slate-100">
                  {items.map((i, idx) => (
                    <View
                      key={i.id}
                      className={`flex-row items-center justify-between p-4 ${
                        idx !== items.length - 1
                          ? "border-b border-white/60"
                          : ""
                      }`}
                    >
                      <View className="flex-1 mr-4">
                        <Text
                          className="text-[14px] font-bold text-slate-800 mb-1"
                          numberOfLines={1}
                        >
                          {i.name}
                        </Text>
                        <View className="flex-row items-center">
                          <TextInput
                            className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[11px] font-black text-slate-600 min-w-[36px] text-center"
                            defaultValue={String(i.quantity)}
                            keyboardType="numeric"
                            onEndEditing={(e) => {
                              const val = parseInt(e.nativeEvent.text);
                              if (!isNaN(val) && val > 0)
                                onUpdateQuantity(i.id, val);
                            }}
                          />
                          <Text className="text-[11px] text-slate-400 font-bold ml-2">
                            × {formatCurrency(i.price)}
                          </Text>
                        </View>
                      </View>

                      <View className="flex-row items-center">
                        <Text className="text-[15px] font-black text-slate-800 mr-4">
                          {formatCurrency(i.price * i.quantity)}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            LayoutAnimation.configureNext(
                              LayoutAnimation.Presets.spring,
                            );
                            onRemoveItem(i.id);
                          }}
                          className="w-10 h-10 rounded-2xl bg-red-50 justify-center items-center active:bg-red-100"
                        >
                          <MaterialCommunityIcons
                            name="trash-can-outline"
                            size={20}
                            color="#EF4444"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View className="flex-row items-center justify-between mb-4 px-2">
                <View className="flex-row items-center">
                  <Text className="text-[14px] font-bold text-slate-400 mr-3">
                    Tạm tính
                  </Text>
                  <View className="flex-row items-center bg-orange-50 px-3 py-1.5 rounded-2xl">
                    <TextInput
                      className="text-sm font-black text-[#E07B39] min-w-[24px] text-center"
                      value={quantityInput}
                      keyboardType="numeric"
                      onChangeText={setQuantityInput}
                      onSubmitEditing={handleTotalQuantitySubmit}
                      onBlur={handleTotalQuantitySubmit}
                      selectTextOnFocus
                    />
                    <Text className="text-[11px] font-black text-[#E07B39] ml-1 uppercase">
                      Món
                    </Text>
                  </View>
                </View>
                <Text className="text-xl font-black text-slate-800">
                  {formatCurrency(totalPrice)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-sm text-gray-400">Phí giao hàng</Text>
                <Text className="text-sm text-green-500 font-semibold">
                  Miễn phí
                </Text>
              </View>

              <View className="border-t border-dashed border-gray-200 mb-4" />

              <View className="flex-row justify-between items-center mb-5">
                <Text className="text-base font-bold text-gray-800">
                  Tổng thanh toán
                </Text>
                <Text className="text-2xl font-black text-[#E07B39]">
                  {formatCurrency(totalPrice)}
                </Text>
              </View>

              <TouchableOpacity onPress={onCheckout} activeOpacity={0.8}>
                <LinearGradient
                  colors={["#E07B39", "#C96A2E"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="rounded-2xl py-[15px] flex-row items-center justify-center shadow-lg"
                  style={{ elevation: 4 }}
                >
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={22}
                    color="white"
                  />
                  <Text className="text-white text-[17px] font-black ml-2">
                    ĐẶT MÓN · {formatCurrency(totalPrice)}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}
