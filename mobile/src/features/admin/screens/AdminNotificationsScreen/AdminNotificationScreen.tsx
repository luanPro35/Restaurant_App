import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Switch,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../../../app/navigation/AdminNavigator";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useAdminNotifications } from "../../hooks/useAdminNotifications";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AdminNotification } from "../../../../services/api/admin-notification";

export default function AdminNotificationScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<AdminStackParamList>>();
  const {
    notifications,
    loading,
    refreshing,
    fetchNotifications,
    handleRefresh,
    deleteNotification,
    toggleNotificationStatus,
  } = useAdminNotifications();
  const [search, setSearch] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications({});
    }, []),
  );

  const handleSearch = () => {
    fetchNotifications({ search });
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const renderCard = ({ item }: { item: AdminNotification }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("AdminEditNotificationScreen", {
          notificationId: item.id,
        })
      }
      activeOpacity={0.8}
      className="mb-4"
    >
      <View
        className="bg-white rounded-3xl overflow-hidden border border-gray-100"
        style={{
          elevation: 3,
          shadowColor: "#E07B39",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        }}
      >
        <View
          className={`h-1 ${item.isActive ? "bg-[#E07B39]" : "bg-gray-200"}`}
        />

        <View className="p-4">
          <View className="flex-row items-start justify-between mb-2.5">
            <View className="flex-row items-center flex-1 mr-3">
              <View
                className={`w-9 h-9 rounded-xl items-center justify-center mr-3 ${
                  item.isActive ? "bg-orange-50" : "bg-gray-50"
                }`}
              >
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={18}
                  color={item.isActive ? "#E07B39" : "#9CA3AF"}
                />
              </View>
              <View className="flex-1">
                <Text
                  className="text-[15px] font-bold text-gray-800"
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text
                  className="text-xs text-gray-400 mt-0.5"
                  numberOfLines={1}
                >
                  {item.content}
                </Text>
              </View>
            </View>
            <View
              className={`px-2.5 py-1 rounded-full ${
                item.isActive ? "bg-green-50" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-[10px] font-bold ${
                  item.isActive ? "text-green-600" : "text-gray-400"
                }`}
              >
                {item.isActive ? "Hoạt động" : "Tắt"}
              </Text>
            </View>
          </View>

          {item.description ? (
            <View className="bg-gray-50 rounded-xl px-3 py-2 mb-3 ml-12">
              <Text className="text-xs text-gray-500" numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          ) : null}

          <View className="flex-row items-center ml-12 mb-3">
            <MaterialCommunityIcons
              name="calendar-range"
              size={13}
              color="#D1D5DB"
            />
            <Text className="text-[11px] text-gray-400 ml-1.5 font-medium">
              {formatDate(item.startAt)} → {formatDate(item.endAt)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between pt-3 border-t border-gray-50 ml-12">
            <View className="flex-row items-center">
              <Switch
                value={item.isActive ?? false}
                onValueChange={(val) => toggleNotificationStatus(item.id, val)}
                trackColor={{ false: "#E5E7EB", true: "#FCD9BC" }}
                thumbColor={item.isActive ? "#E07B39" : "#9CA3AF"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
              />
            </View>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AdminEditNotificationScreen", {
                    notificationId: item.id,
                  })
                }
                className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-xl"
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={14}
                  color="#3B82F6"
                />
                <Text className="text-blue-500 font-bold text-[11px] ml-1">
                  Sửa
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteNotification(item.id)}
                className="flex-row items-center bg-red-50 px-3 py-1.5 rounded-xl"
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={14}
                  color="#EF4444"
                />
                <Text className="text-red-500 font-bold text-[11px] ml-1">
                  Xóa
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View className="px-6 pt-14 pb-6 bg-[#FDFCF7]">
      <View className="flex-row items-center justify-between mb-1">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-white shadow-sm rounded-xl items-center justify-center border border-gray-100"
          style={{ elevation: 1 }}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={24}
            color="#1F2937"
          />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-xl font-black text-gray-800">
            Quản lý thông báo
          </Text>
          <Text className="text-[11px] text-gray-400 mt-0.5">
            {notifications.length} thông báo
          </Text>
        </View>
        <View className="w-10" />
      </View>

      <View className="flex-row items-center mt-5 gap-3">
        <View
          className="flex-1 flex-row items-center bg-white h-[48px] px-4 rounded-2xl border border-gray-100"
          style={{
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.04,
            shadowRadius: 4,
          }}
        >
          <MaterialCommunityIcons name="magnify" size={20} color="#E07B39" />
          <TextInput
            className="flex-1 ml-2.5 text-gray-800 font-semibold text-sm"
            placeholder="Tìm theo tiêu đề..."
            placeholderTextColor="#C4C4C4"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearch("");
                fetchNotifications({});
              }}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color="#D1D5DB"
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("AdminAddNotificationsScreen")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#E07B39", "#C96A2E"]}
            className="w-[48px] h-[48px] rounded-2xl items-center justify-center"
            style={{
              elevation: 4,
              shadowColor: "#E07B39",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
            }}
          >
            <MaterialCommunityIcons name="plus" size={26} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center pt-24">
      <View
        className="w-24 h-24 bg-orange-50 rounded-full items-center justify-center mb-5"
        style={{
          shadowColor: "#E07B39",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
        }}
      >
        <MaterialCommunityIcons
          name="bell-off-outline"
          size={44}
          color="#E07B39"
        />
      </View>
      <Text className="text-gray-500 font-bold text-base">
        Chưa có thông báo nào
      </Text>
      <Text className="text-gray-300 text-xs mt-1">
        Nhấn + để tạo thông báo mới
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      {renderHeader()}

      {loading && !refreshing && notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E07B39" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderCard}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 100,
            paddingTop: 4,
          }}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#E07B39"]}
              tintColor="#E07B39"
            />
          }
        />
      )}
    </View>
  );
}
