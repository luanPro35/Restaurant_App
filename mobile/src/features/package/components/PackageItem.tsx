import React, { useEffect, useRef } from "react";
import { View, Text, Image, Animated } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type StepStatus = "pending" | "preparing" | "delivering" | "received";

interface Step {
  id: StepStatus;
  title: string;
  time: string;
  icon: string;
}

interface PackageItemProps {
  id: string;
  status: StepStatus;
  estimatedTime: string;
  driver?: {
    name: string;
    phone: string;
    rating: number;
    avatar: string;
    plate: string;
  };
}

const STEPS: Step[] = [
  {
    id: "pending",
    title: "Đã đặt",
    time: "18:30",
    icon: "clipboard-check-outline",
  },
  { id: "preparing", title: "Đang bếp", time: "18:35", icon: "chef-hat" },
  { id: "delivering", title: "Đang giao", time: "18:50", icon: "moped" },
  { id: "received", title: "Đã nhận", time: "--:--", icon: "flag-checkered" },
];

export default function PackageItem({
  id,
  status,
  estimatedTime,
  driver,
}: PackageItemProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const stepIndex = STEPS.findIndex((s) => s.id === status);
    Animated.timing(progressAnim, {
      toValue: stepIndex,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [status]);

  const getCurrentStepIndex = () => STEPS.findIndex((s) => s.id === status);

  return (
    <View className="bg-white rounded-2xl mx-4 mb-4 shadow-lg elevation-4 overflow-hidden border border-gray-100">
      <View className="bg-[#E07B39] p-4 flex-row justify-between items-center">
        <View>
          <Text className="text-white font-bold text-lg">Đơn hàng #{id}</Text>
          <Text className="text-white/80 text-sm">
            Dự kiến giao: {estimatedTime}
          </Text>
        </View>
        <View className="bg-white/20 p-2 rounded-full">
          <MaterialCommunityIcons name="clock-fast" size={24} color="white" />
        </View>
      </View>

      <View className="p-6">
        <View className="flex-row justify-between items-center relative mb-8">
          <View className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded-full" />

          <Animated.View
            style={{
              position: "absolute",
              top: 16, 
              left: 0,
              height: 4,
              backgroundColor: "#E07B39",
              borderRadius: 2,
              width: progressAnim.interpolate({
                inputRange: [0, 3],
                outputRange: ["0%", "100%"],
              }),
            }}
          />

          {STEPS.map((step, index) => {
            const isActive = index <= getCurrentStepIndex();
            const isCurrent = index === getCurrentStepIndex();

            return (
              <View
                key={step.id}
                className="items-center"
                style={{ width: 60 }}
              >
                <View
                  className={`w-8 h-8 rounded-full justify-center items-center mb-2 z-10 ${isActive ? "bg-[#E07B39]" : "bg-gray-200"} ${isCurrent ? "border-4 border-[#FFDbb5]" : ""}`}
                >
                  <MaterialCommunityIcons
                    name={step.icon as any}
                    size={14}
                    color={isActive ? "white" : "#9ca3af"}
                  />
                </View>
                <Text
                  className={`text-[10px] font-bold text-center mb-1 ${isActive ? "text-[#E07B39]" : "text-gray-400"}`}
                >
                  {step.title}
                </Text>
                <Text className="text-[10px] text-gray-400">
                  {isActive ? step.time : "--:--"}
                </Text>
              </View>
            );
          })}
        </View>

        {driver && (
          <View className="flex-row items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
            <Image
              source={{ uri: driver.avatar }}
              className="w-12 h-12 rounded-full bg-gray-200 mr-3"
            />
            <View className="flex-1">
              <Text className="font-bold text-[#2D2D2D]">{driver.name}</Text>
              <View className="flex-row items-center mt-1">
                <MaterialCommunityIcons name="star" size={12} color="#F59E0B" />
                <Text className="text-xs text-gray-500 ml-1">
                  {driver.rating} • {driver.plate}
                </Text>
              </View>
            </View>
            <View className="flex-row">
              <View className="bg-green-100 p-2 rounded-full mr-2">
                <MaterialCommunityIcons
                  name="phone"
                  size={20}
                  color="#16a34a"
                />
              </View>
              <View className="bg-blue-100 p-2 rounded-full">
                <MaterialCommunityIcons
                  name="message-text"
                  size={20}
                  color="#2563eb"
                />
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
