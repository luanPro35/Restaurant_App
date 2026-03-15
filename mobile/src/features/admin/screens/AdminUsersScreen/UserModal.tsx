import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AdminUser,
  UserRole,
  CreateAdminUserDto,
  UpdateAdminUserDto,
} from "../../types/admin-user.types";

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAdminUserDto | UpdateAdminUserDto) => void;
  user?: AdminUser | null;
  defaultRole?: UserRole;
}

export const UserModal = ({
  visible,
  onClose,
  onSubmit,
  user,
  defaultRole = UserRole.USER,
}: UserModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>(defaultRole);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
      setPassword("");
    } else {
      setName("");
      setEmail("");
      setRole(defaultRole);
      setPassword("");
    }
  }, [user, visible, defaultRole]);

  const handleSubit = () => {
    if (user) {
      onSubmit({ name, role });
    } else {
      onSubmit({ name, email, password, role });
    }
  };

  const renderRoleButton = (r: UserRole, label: string) => {
    const isSelected = role === r;
    return (
      <TouchableOpacity
        onPress={() => setRole(r)}
        className={`flex-1 py-3 rounded-2xl border ${
          isSelected
            ? "bg-orange-50 border-orange-500"
            : "bg-white border-gray-100"
        } items-center justify-center`}
      >
        <Text
          className={`font-bold text-[10px] ${isSelected ? "text-orange-600" : "text-gray-500"}`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-[#FDFCF7] rounded-t-[40px] p-6 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">
                {user ? "Chỉnh sửa" : "Thêm mới"} {defaultRole === UserRole.STAFF ? "Nhân viên" : "Người dùng"}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="p-2 bg-gray-100 rounded-full"
              >
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color="#374151"
                />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="text-gray-600 font-bold text-sm mb-2 ml-1">
                  Họ và tên
                </Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  className="bg-white border border-gray-100 p-4 rounded-2xl text-gray-900 shadow-sm"
                  placeholder="Nhập họ tên..."
                />
              </View>

              {!user && (
                <>
                  <View className="mb-4">
                    <Text className="text-gray-600 font-bold text-sm mb-2 ml-1">
                      Email
                    </Text>
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="bg-white border border-gray-100 p-4 rounded-2xl text-gray-900 shadow-sm"
                      placeholder="example@gmail.com"
                    />
                  </View>

                  <View className="mb-4">
                    <Text className="text-gray-600 font-bold text-sm mb-2 ml-1">
                      Mật khẩu
                    </Text>
                    <TextInput
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      className="bg-white border border-gray-100 p-4 rounded-2xl text-gray-900 shadow-sm"
                      placeholder="Nhập ít nhất 8 ký tự..."
                    />
                  </View>
                </>
              )}

              <View className="mb-8">
                <Text className="text-gray-600 font-bold text-sm mb-3 ml-1">
                  Vai trò
                </Text>
                <View className="flex-row space-x-2 gap-x-2">
                  {renderRoleButton(UserRole.USER, "Khách")}
                  {renderRoleButton(UserRole.STAFF, "Nhân viên")}
                  {renderRoleButton(UserRole.ADMIN, "Quản trị")}
                </View>
              </View>

              <TouchableOpacity
                onPress={handleSubit}
                className="bg-orange-500 py-4 rounded-2xl items-center shadow-lg shadow-orange-500/30"
              >
                <Text className="text-white font-bold text-base">
                  {user ? "Lưu thay đổi" : "Tạo tài khoản"}
                </Text>
              </TouchableOpacity>

              <View className="h-10" />
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
