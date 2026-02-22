import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { UserItem } from "./UserItem";
import { UserModal } from "./UserModal";
import { useAdminUsers } from "../../hooks/useAdminUsers";
import {
  AdminUser,
  CreateAdminUserDto,
  UpdateAdminUserDto,
} from "../../types/admin-user.types";

export default function AdminUsersScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const {
    users,
    loading,
    refreshing,
    search,
    setSearch,
    onRefresh,
    handleLoadMore,
    deleteUser,
    saveUser,
  } = useAdminUsers();

  const handleEdit = (user: AdminUser) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleDelete = (user: AdminUser) => {
    Alert.alert(
      "Xác nhận xóa",
      `Bạn có chắc chắn muốn xóa người dùng ${user.name}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => deleteUser(user.id),
        },
      ],
    );
  };

  const handleModalSubmit = async (
    data: CreateAdminUserDto | UpdateAdminUserDto,
  ) => {
    try {
      await saveUser(data, selectedUser?.id);
      setModalVisible(false);
    } catch (error) {}
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FDFCF7]">
      <View className="px-6 py-4 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-gray-100"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={28}
              color="#374151"
            />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-gray-900 ml-4">
            Quản lý User
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setSelectedUser(null);
            setModalVisible(true);
          }}
          className="w-10 h-10 bg-orange-500 rounded-full items-center justify-center shadow-md shadow-orange-500/30"
        >
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View className="px-6 mb-4">
        <View className="bg-white flex-row items-center px-4 py-3 rounded-2xl border border-gray-100 shadow-sm">
          <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Tìm kiếm theo tên..."
            className="flex-1 ml-3 text-gray-900 font-medium"
            value={search}
            onChangeText={setSearch}
          />
          {search !== "" && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserItem user={item} onEdit={handleEdit} onDelete={handleDelete} />
        )}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#E07B39"]}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View className="items-center justify-center py-20">
              <MaterialCommunityIcons
                name="account-search-outline"
                size={80}
                color="#E5E7EB"
              />
              <Text className="text-gray-400 mt-4 font-medium">
                Không tìm thấy người dùng nào
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading && users.length > 0 ? (
            <ActivityIndicator color="#E07B39" className="py-4" />
          ) : null
        }
      />

      {loading && users.length === 0 && (
        <View className="absolute inset-0 items-center justify-center bg-[#FDFCF7]/80">
          <ActivityIndicator size="large" color="#E07B39" />
        </View>
      )}

      <UserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        user={selectedUser}
      />
    </SafeAreaView>
  );
}
