import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import categoryApi, { Category } from "../../../services/api/category.api";
import { resolveImageUrl } from "../../../shared/utils";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface AdminCategoryFormModalProps {
  visible: boolean;
  categoryToEdit: Category | null;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description?: string;
    image?: string;
    order?: number;
    slug?: string;
  }) => Promise<boolean>;
}

export const AdminCategoryFormModal: React.FC<AdminCategoryFormModalProps> = ({
  visible,
  categoryToEdit,
  onClose,
  onSubmit,
}) => {
  const isEdit = !!categoryToEdit;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("0");
  const [image, setImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Helper to generate slug from name
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  useEffect(() => {
    if (visible) {
      if (categoryToEdit) {
        setName(categoryToEdit.name || "");
        setSlug(categoryToEdit.slug || "");
        setDescription(categoryToEdit.description || "");
        setOrder(
          categoryToEdit.order !== undefined
            ? String(categoryToEdit.order)
            : "0"
        );
        setImage(categoryToEdit.image || "");
      } else {
        setName("");
        setSlug("");
        setDescription("");
        setOrder("0");
        setImage("");
      }
    }
  }, [visible, categoryToEdit]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit || !slug) {
      setSlug(generateSlug(val));
    }
  };

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Quyền truy cập",
          "Ứng dụng cần quyền truy cập thư viện ảnh để tải lên ảnh danh mục."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await handleUpload(result.assets[0].uri);
      }
    } catch (err) {
      console.error("Error picking image:", err);
      Alert.alert("Lỗi", "Không thể mở thư viện ảnh.");
    }
  };

  const handleUpload = async (uri: string) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      const filename = uri.split("/").pop() || "category.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("file", {
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
        name: filename,
        type,
      } as any);

      const response = await categoryApi.uploadImage(formData);
      if (response?.url) {
        setImage(response.url);
        Alert.alert("Thành công", "Đã tải ảnh lên Cloudinary!");
      }
    } catch (error: any) {
      console.error("Upload category image error:", error);
      Alert.alert(
        "Lỗi tải ảnh",
        "Không thể tải ảnh lên máy chủ. Bạn có thể dán link ảnh trực tiếp vào ô bên dưới."
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tên danh mục món ăn.");
      return;
    }

    setSubmitting(true);
    try {
      const success = await onSubmit({
        name: name.trim(),
        slug: slug.trim() || generateSlug(name.trim()),
        description: description.trim(),
        order: parseInt(order, 10) || 0,
        image: image.trim(),
      });

      if (success) {
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const displayImageUrl = image ? resolveImageUrl(image) : null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-end"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          className="flex-1"
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            className="bg-[#FDFCF7] rounded-t-[36px] overflow-hidden"
            style={{
              height: SCREEN_HEIGHT * 0.85,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 20,
            }}
          >
            {/* Header Bar */}
            <View className="flex-row items-center justify-between px-6 pt-5 pb-3 border-b border-gray-100 bg-white">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-2xl bg-orange-50 items-center justify-center mr-3 border border-orange-200">
                  <MaterialCommunityIcons
                    name={isEdit ? "pencil" : "plus-circle-outline"}
                    size={22}
                    color="#E07B39"
                  />
                </View>
                <View>
                  <Text className="text-gray-900 font-extrabold text-lg">
                    {isEdit ? "Chỉnh sửa danh mục" : "Tạo mới danh mục"}
                  </Text>
                  <Text className="text-gray-400 text-[11px] font-medium">
                    {isEdit
                      ? "Cập nhật thông tin phân loại thực đơn"
                      : "Thêm nhóm món ăn mới vào nhà hàng"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={onClose}
                disabled={submitting || uploadingImage}
                className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center"
              >
                <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView
              className="flex-1 px-6 pt-4"
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 60 }}
            >

            {/* Image Upload Section */}
            <View className="mb-5">
              <Text className="text-gray-700 font-bold text-xs uppercase tracking-wider mb-2">
                Ảnh đại diện danh mục
              </Text>

              <View className="w-full h-44 rounded-3xl bg-white border border-dashed border-gray-300 overflow-hidden items-center justify-center relative">
                {uploadingImage ? (
                  <View className="items-center">
                    <ActivityIndicator size="large" color="#E07B39" />
                    <Text className="text-gray-500 text-xs mt-3 font-semibold">
                      Đang tải ảnh lên Cloudinary...
                    </Text>
                  </View>
                ) : displayImageUrl ? (
                  <View className="w-full h-full relative">
                    <Image
                      source={{ uri: displayImageUrl }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                    <View className="absolute bottom-3 right-3 flex-row space-x-2">
                      <TouchableOpacity
                        onPress={pickImage}
                        className="bg-black/70 px-3 py-1.5 rounded-xl flex-row items-center"
                      >
                        <MaterialCommunityIcons
                          name="camera-flip"
                          size={14}
                          color="white"
                        />
                        <Text className="text-white text-xs font-bold ml-1">
                          Đổi ảnh
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setImage("")}
                        className="bg-red-500/80 px-2.5 py-1.5 rounded-xl items-center justify-center"
                      >
                        <MaterialCommunityIcons
                          name="trash-can"
                          size={14}
                          color="white"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={pickImage}
                    className="items-center justify-center w-full h-full p-4"
                  >
                    <View className="w-12 h-12 rounded-2xl bg-orange-50 items-center justify-center mb-2">
                      <MaterialCommunityIcons
                        name="camera-plus-outline"
                        size={24}
                        color="#E07B39"
                      />
                    </View>
                    <Text className="text-gray-800 font-bold text-sm">
                      Chọn ảnh từ thiết bị
                    </Text>
                    <Text className="text-gray-400 text-xs mt-1 text-center">
                      Hỗ trợ JPG, PNG, WEBP (Tự động lưu lên Cloudinary)
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Direct image url input */}
              <View className="mt-2 flex-row items-center bg-white px-3 py-2 rounded-xl border border-gray-100">
                <MaterialCommunityIcons
                  name="link-variant"
                  size={16}
                  color="#9CA3AF"
                />
                <TextInput
                  value={image}
                  onChangeText={setImage}
                  placeholder="Hoặc dán URL ảnh trực tiếp..."
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 ml-2 text-xs text-gray-800"
                />
                {image.length > 0 && (
                  <TouchableOpacity onPress={() => setImage("")}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={14}
                      color="#D1D5DB"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Form Fields */}
            <View className="space-y-4">
              {/* Name */}
              <View>
                <Text className="text-gray-700 font-bold text-xs uppercase tracking-wider mb-1.5">
                  Tên danh mục <Text className="text-red-500">*</Text>
                </Text>
                <View className="bg-white rounded-2xl px-4 py-3 border border-gray-200">
                  <TextInput
                    value={name}
                    onChangeText={handleNameChange}
                    placeholder="Ví dụ: Món Khai Vị, Món Chính, Đồ Uống..."
                    placeholderTextColor="#9CA3AF"
                    className="text-gray-900 font-bold text-sm"
                  />
                </View>
              </View>

              {/* Slug */}
              <View>
                <Text className="text-gray-700 font-bold text-xs uppercase tracking-wider mb-1.5">
                  Slug định danh (URL)
                </Text>
                <View className="bg-white rounded-2xl px-4 py-3 border border-gray-200 flex-row items-center">
                  <Text className="text-gray-400 font-mono text-sm mr-1">/</Text>
                  <TextInput
                    value={slug}
                    onChangeText={setSlug}
                    placeholder="mon-khai-vi"
                    placeholderTextColor="#9CA3AF"
                    className="flex-1 text-gray-900 font-mono text-xs"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Order */}
              <View>
                <Text className="text-gray-700 font-bold text-xs uppercase tracking-wider mb-1.5">
                  Thứ tự sắp xếp hiển thị
                </Text>
                <View className="bg-white rounded-2xl px-4 py-3 border border-gray-200 flex-row items-center">
                  <MaterialCommunityIcons
                    name="sort-numeric-ascending"
                    size={18}
                    color="#9CA3AF"
                    style={{ marginRight: 8 }}
                  />
                  <TextInput
                    value={order}
                    onChangeText={setOrder}
                    placeholder="0"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    className="flex-1 text-gray-900 font-bold text-sm"
                  />
                </View>
                <Text className="text-gray-400 text-[11px] mt-1 ml-1">
                  Số nhỏ hơn sẽ hiển thị trước trên thanh điều hướng thực đơn.
                </Text>
              </View>

              {/* Description */}
              <View>
                <Text className="text-gray-700 font-bold text-xs uppercase tracking-wider mb-1.5">
                  Mô tả danh mục
                </Text>
                <View className="bg-white rounded-2xl px-4 py-3 border border-gray-200">
                  <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Mô tả ngắn gọn về nhóm món ăn này..."
                    placeholderTextColor="#9CA3AF"
                    multiline={true}
                    numberOfLines={3}
                    textAlignVertical="top"
                    className="text-gray-900 text-xs min-h-[70px]"
                  />
                </View>
              </View>
            </View>

            {/* Submit & Cancel Buttons */}
            <View className="flex-row space-x-3 mt-6">
              <TouchableOpacity
                onPress={onClose}
                disabled={submitting || uploadingImage}
                className="flex-1 bg-gray-100 py-3.5 rounded-2xl items-center justify-center"
              >
                <Text className="text-gray-600 font-black text-sm">Hủy bỏ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={submitting || uploadingImage}
                className="flex-1 bg-[#E07B39] py-3.5 rounded-2xl items-center justify-center flex-row shadow-sm shadow-orange-500/30"
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="check-circle-outline"
                      size={18}
                      color="white"
                    />
                    <Text className="text-white font-black text-sm ml-1.5">
                      {isEdit ? "Lưu thay đổi" : "Tạo danh mục"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  </Modal>
);
};


export default AdminCategoryFormModal;
