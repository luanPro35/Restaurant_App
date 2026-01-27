import Header from "../../home/screens/Header";
import React, { useState } from "react";
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
import TableCard from "../components/TableCard";
import QuickActions from "../components/QuickActions";
import CurrentOrder from "../components/CurrentOrder";
import MenuSection from "../components/MenuSection";

type TabType = "tables" | "order" | "menu";

export default function AtRestaurant() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<TabType>("order");
  const [currentTable, setCurrentTable] = useState("A1");

  const tables = [
    { number: "A1", capacity: 4, status: "occupied" as const },
    { number: "A2", capacity: 2, status: "available" as const },
    { number: "A3", capacity: 6, status: "reserved" as const },
    { number: "B1", capacity: 4, status: "available" as const },
    { number: "B2", capacity: 8, status: "occupied" as const },
    { number: "B3", capacity: 2, status: "available" as const },
  ];

  const orderItems = [
    {
      id: "1",
      name: "Phở Bò Đặc Biệt",
      quantity: 2,
      price: 65000,
      status: "served" as const,
    },
    {
      id: "2",
      name: "Bún Chả Hà Nội",
      quantity: 1,
      price: 55000,
      status: "preparing" as const,
    },
    {
      id: "3",
      name: "Trà Đá",
      quantity: 3,
      price: 10000,
      status: "ready" as const,
    },
  ];

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
              {tables.map((table) => (
                <TableCard
                  key={table.number}
                  tableNumber={table.number}
                  capacity={table.capacity}
                  status={table.status}
                  onPress={() => {
                    setCurrentTable(table.number);
                    setActiveTab("order");
                  }}
                />
              ))}
            </View>
          </ScrollView>
        );

      case "order":
        return (
          <ScrollView className="flex-1 pt-4">
            <QuickActions />
            <CurrentOrder items={orderItems} tableNumber={currentTable} />
          </ScrollView>
        );

      case "menu":
        return <MenuSection />;

      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9F6E7]">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Header */}
      <View className="bg-[#E07B39] pt-12 pb-6 px-4 rounded-b-3xl shadow-lg">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-3"
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
            <Text className="text-white text-2xl font-bold ml-3">Tại Quán</Text>
          </View>
          <View className="flex-row items-center bg-white/20 px-3 py-2 rounded-full">
            <MaterialCommunityIcons
              name="table-furniture"
              size={20}
              color="white"
            />
            <Text className="text-white font-semibold ml-1">
              Bàn {currentTable}
            </Text>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="bg-white mx-4 mt-4 rounded-2xl shadow-md flex-row">
        <TouchableOpacity
          onPress={() => setActiveTab("tables")}
          className={`flex-1 py-4 items-center rounded-2xl ${
            activeTab === "tables" ? "bg-orange-500" : ""
          }`}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="table-furniture"
            size={24}
            color={activeTab === "tables" ? "white" : "#9CA3AF"}
          />
          <Text
            className={`mt-1 font-semibold ${
              activeTab === "tables" ? "text-white" : "text-gray-400"
            }`}
          >
            Bàn
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("order")}
          className={`flex-1 py-4 items-center rounded-2xl ${
            activeTab === "order" ? "bg-orange-500" : ""
          }`}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="receipt"
            size={24}
            color={activeTab === "order" ? "white" : "#9CA3AF"}
          />
          <Text
            className={`mt-1 font-semibold ${
              activeTab === "order" ? "text-white" : "text-gray-400"
            }`}
          >
            Đơn hàng
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("menu")}
          className={`flex-1 py-4 items-center rounded-2xl ${
            activeTab === "menu" ? "bg-orange-500" : ""
          }`}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="food"
            size={24}
            color={activeTab === "menu" ? "white" : "#9CA3AF"}
          />
          <Text
            className={`mt-1 font-semibold ${
              activeTab === "menu" ? "text-white" : "text-gray-400"
            }`}
          >
            Thực đơn
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 mt-2">{renderTabContent()}</View>
    </SafeAreaView>
  );
}
