import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import useMealFood from "../hooks/useMealFood";
import { useNavigation } from "@react-navigation/native";
import { resolveImageUrl } from "../../../shared/utils";

export default function MealFoodScreen() {
  const navigation = useNavigation();
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [budget, setBudget] = useState("");
  const [keyword, setKeyword] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<string>("ALL");

  const { searchMealFood, recommendations, healthMetrics, aiAdvice, loading, error } =
    useMealFood();

  const handleSearch = (mealTypeParam?: string) => {
    const mealTypeToSend = mealTypeParam || selectedMealType;
    searchMealFood({
      height: height ? Number(height) : undefined,
      weight: weight ? Number(weight) : undefined,
      budget: budget ? Number(budget) : undefined,
      mealType: mealTypeToSend !== "ALL" ? mealTypeToSend : undefined,
      keyword: keyword.trim() || undefined,
    });
  };

  const handleSelectMealType = (type: string) => {
    setSelectedMealType(type);
    handleSearch(type);
  };

  const getBmiBadgeColor = (status?: string) => {
    if (!status) return "bg-gray-100 text-gray-700";
    if (status === "Bình thường") return "bg-green-100 text-green-700 border-green-300";
    if (status === "Gầy") return "bg-amber-100 text-amber-700 border-amber-300";
    return "bg-red-100 text-red-700 border-red-300";
  };

  const mealTypes = [
    { id: "ALL", label: "Lịch Trình Cả Ngày 📋" },
    { id: "BREAKFAST", label: "Bữa Sáng 🌅" },
    { id: "LUNCH", label: "Bữa Trưa ☀️" },
    { id: "DINNER", label: "Bữa Tối 🌙" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FA" }}>
      <StatusBar barStyle="light-content" />

      {/* Header chuẩn iPhone Dynamic Island / Notch */}
      <LinearGradient
        colors={["#E07B39", "#F39C12"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          paddingTop: Platform.OS === "ios" ? 12 : 36,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 pr-2">
            <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3 p-1">
              <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
            </TouchableOpacity>
            <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mr-3">
              <MaterialCommunityIcons name="robot-happy-outline" size={24} color="#FFFFFF" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-white" numberOfLines={1}>
                AI Chef & Meal Assistant
              </Text>
              <Text className="text-xs text-white/80 font-medium" numberOfLines={1}>
                Lập Thực Đơn Dinh Dưỡng Trọn Gói 1 Ngày
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Form nhập thông số */}
        <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
          <Text className="text-sm font-bold text-gray-800 mb-3 flex-row items-center">
            <FontAwesome5 name="sliders-h" size={14} color="#E07B39" /> Thông số thể trạng & Ngân sách
          </Text>

          {/* Chip Chọn Bữa Ăn */}
          <Text className="text-[11px] font-semibold text-gray-600 mb-2">Chế độ xem thực đơn</Text>
          <View className="flex-row flex-wrap justify-between mb-3">
            {mealTypes.map((item) => {
              const isSelected = selectedMealType === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleSelectMealType(item.id)}
                  activeOpacity={0.7}
                  style={{
                    width: "48%",
                    marginBottom: 8,
                    paddingVertical: 8,
                    paddingHorizontal: 8,
                    borderRadius: 10,
                    borderWidth: 1,
                    alignItems: "center",
                    backgroundColor: isSelected ? "#E07B39" : "#F9FAFB",
                    borderColor: isSelected ? "#E07B39" : "#E5E7EB",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "700",
                      color: isSelected ? "#FFFFFF" : "#374151",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View className="flex-row justify-between mb-2.5">
            <View className="w-[48%]">
              <Text className="text-[11px] font-semibold text-gray-600 mb-1">Chiều cao (cm)</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2">
                <Ionicons name="resize-outline" size={15} color="#9CA3AF" />
                <TextInput
                  keyboardType="numeric"
                  placeholder="VD: 170"
                  value={height}
                  onChangeText={setHeight}
                  className="flex-1 ml-1.5 text-xs text-gray-800 font-medium"
                />
              </View>
            </View>

            <View className="w-[48%]">
              <Text className="text-[11px] font-semibold text-gray-600 mb-1">Cân nặng (kg)</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2">
                <FontAwesome5 name="weight" size={13} color="#9CA3AF" />
                <TextInput
                  keyboardType="numeric"
                  placeholder="VD: 65"
                  value={weight}
                  onChangeText={setWeight}
                  className="flex-1 ml-1.5 text-xs text-gray-800 font-medium"
                />
              </View>
            </View>
          </View>

          <View className="flex-row justify-between mb-3">
            <View className="w-[48%]">
              <Text className="text-[11px] font-semibold text-gray-600 mb-1">Ngân sách (VNĐ)</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2">
                <Ionicons name="wallet-outline" size={15} color="#9CA3AF" />
                <TextInput
                  keyboardType="numeric"
                  placeholder="VD: 100000"
                  value={budget}
                  onChangeText={setBudget}
                  className="flex-1 ml-1.5 text-xs text-gray-800 font-medium"
                />
              </View>
            </View>

            <View className="w-[48%]">
              <Text className="text-[11px] font-semibold text-gray-600 mb-1">Từ khóa món ăn</Text>
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-2">
                <Ionicons name="search-outline" size={15} color="#9CA3AF" />
                <TextInput
                  placeholder="VD: Cơm, Phở"
                  value={keyword}
                  onChangeText={setKeyword}
                  className="flex-1 ml-1.5 text-xs text-gray-800 font-medium"
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handleSearch()}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#E07B39", "#F39C12"]}
              style={{ paddingVertical: 12, borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "row" }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                  <Text className="text-white font-bold text-sm ml-2">
                    Lập Lịch Trình & Gợi Ý AI
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Thông báo lỗi */}
        {error && (
          <View className="bg-red-50 border border-red-200 p-3 rounded-xl mb-4">
            <Text className="text-red-600 font-medium text-xs">{error}</Text>
          </View>
        )}

        {/* Lời khuyên Dinh Dưỡng từ AI */}
        {aiAdvice && (
          <View className="bg-amber-50/80 border border-amber-200 p-4 rounded-2xl mb-4 shadow-sm">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="lightbulb-on" size={18} color="#D97706" />
              <Text className="text-xs font-bold text-amber-900 ml-2">
                Lời Khuyên & Lịch Trình AI Chef
              </Text>
            </View>
            <Text className="text-xs text-amber-950 leading-5 font-medium">
              {aiAdvice}
            </Text>
          </View>
        )}

        {/* Lịch trình Calo 3 bữa ăn */}
        {healthMetrics && (healthMetrics as any).mealSchedule && selectedMealType === "ALL" && (
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
            <Text className="text-xs font-bold text-gray-800 mb-2.5">
              📋 Lịch Trình Calo 3 Bữa Khuyến Nghị
            </Text>
            <View className="flex-row justify-between">
              <View className="w-[31%] bg-amber-50 p-2 rounded-xl border border-amber-100 items-center">
                <Text className="text-[10px] font-bold text-amber-800">🌅 Sáng</Text>
                <Text className="text-xs font-black text-[#E07B39] mt-0.5">
                  {(healthMetrics as any).mealSchedule.breakfastCalories} kcal
                </Text>
              </View>
              <View className="w-[31%] bg-orange-50 p-2 rounded-xl border border-orange-100 items-center">
                <Text className="text-[10px] font-bold text-orange-800">☀️ Trưa</Text>
                <Text className="text-xs font-black text-[#E07B39] mt-0.5">
                  {(healthMetrics as any).mealSchedule.lunchCalories} kcal
                </Text>
              </View>
              <View className="w-[31%] bg-indigo-50 p-2 rounded-xl border border-indigo-100 items-center">
                <Text className="text-[10px] font-bold text-indigo-800">🌙 Tối</Text>
                <Text className="text-xs font-black text-[#E07B39] mt-0.5">
                  {(healthMetrics as any).mealSchedule.dinnerCalories} kcal
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Dashboard Thống kê Chỉ số Sức khỏe */}
        {healthMetrics && (
          <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
            <Text className="text-xs font-bold text-gray-800 mb-2.5">
              ❤️ Chỉ Số Thể Trạng AI Phân Tích
            </Text>

            <View className="flex-row items-center justify-between bg-orange-50/50 p-3 rounded-xl mb-2.5 border border-orange-100">
              <View>
                <Text className="text-[11px] text-gray-500 font-medium">Chỉ số BMI</Text>
                <Text className="text-xl font-bold text-gray-800">{healthMetrics.bmi}</Text>
              </View>
              <View className={`px-2.5 py-1 rounded-full border ${getBmiBadgeColor(healthMetrics.bmiStatus)}`}>
                <Text className="text-[11px] font-bold">{healthMetrics.bmiStatus}</Text>
              </View>
            </View>

            <View className="flex-row justify-between">
              <View className="w-[48%] bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <Text className="text-[10px] text-gray-500 font-medium">TDEE (Năng lượng/Ngày)</Text>
                <Text className="text-xs font-bold text-gray-800 mt-0.5">
                  {healthMetrics.recommendedDailyCalories} kcal
                </Text>
              </View>

              <View className="w-[48%] bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <Text className="text-[10px] text-gray-500 font-medium">
                  {selectedMealType === "BREAKFAST" ? "Calo Bữa Sáng" : selectedMealType === "LUNCH" ? "Calo Bữa Trưa" : selectedMealType === "DINNER" ? "Calo Bữa Tối" : "Khuyến Nghị 1 Bữa"}
                </Text>
                <Text className="text-xs font-bold text-[#E07B39] mt-0.5">
                  {healthMetrics.suggestedMealCalories} kcal
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Danh sách Món ăn Gợi ý */}
        <View className="mb-6">
          <Text className="text-sm font-bold text-gray-800 mb-2.5">
            Món Ăn Gợi Ý Phù Hợp ({recommendations.length})
          </Text>

          {recommendations.length === 0 && !loading ? (
            <View className="bg-white p-6 rounded-2xl items-center justify-center border border-gray-100">
              <MaterialCommunityIcons name="food-off" size={40} color="#D1D5DB" />
              <Text className="text-gray-400 font-medium mt-2 text-xs text-center">
                Nhập thông số và bấm "Lập Lịch Trình & Gợi Ý AI" để chọn món ăn phù hợp!
              </Text>
            </View>
          ) : (
            recommendations.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => (navigation as any).navigate('DetailProduct', { id: item.id })}
                activeOpacity={0.8}
                className="bg-white p-3 rounded-xl mb-2.5 shadow-sm border border-gray-100 flex-row items-center justify-between"
              >
                <Image
                  source={{ uri: resolveImageUrl(item.image || item.images) }}
                  style={{ width: 68, height: 68, borderRadius: 10, backgroundColor: "#F3F4F6" }}
                  resizeMode="cover"
                />

                <View className="flex-1 ml-3 pr-2">
                  <Text className="text-sm font-bold text-gray-800" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-[11px] text-gray-500 mt-0.5" numberOfLines={2}>
                    {item.description || "Món ăn dinh dưỡng chuẩn vị nhà hàng."}
                  </Text>
                  <Text className="text-xs font-bold text-[#E07B39] mt-1">
                    {item.price ? item.price.toLocaleString("vi-VN") : 0} đ
                  </Text>
                </View>

                <View className="bg-orange-50 p-1.5 rounded-full border border-orange-100">
                  <Ionicons name="chevron-forward" size={14} color="#E07B39" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
