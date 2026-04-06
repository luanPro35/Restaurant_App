import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useComment } from "../hooks/useComment";

const UploadComment: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { createComment, loading } = useComment();
  
  const [content, setContent] = useState("");
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "see" | "your">("upload");

  const brandColor = "#E07B39";

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Thông báo", "Cần quyền truy cập Camera!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Thông báo", "Cần quyền truy cập thư viện ảnh!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      "Thêm hình ảnh",
      "Bạn muốn chọn ảnh từ đâu?",
      [
        { text: "Chụp ảnh mới", onPress: takePhoto },
        { text: "Chọn từ thư viện", onPress: pickImage },
        { text: "Hủy", style: "cancel" }
      ]
    );
  };

  const handlePost = async () => {
    if (!content.trim() && !image) {
      Alert.alert("Thông báo", "Vui lòng nhập nội dung hoặc chọn ảnh");
      return;
    }

    await createComment({ content: content.trim() }, image);
    setContent("");
    setImage(null);
  };

  const renderTabContent = () => {
    return (
      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row mb-6">
          <View className="w-12 h-12 rounded-full bg-orange-100 items-center justify-center mr-3">
            <Ionicons name="person" size={24} color={brandColor} />
          </View>
          <View className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <TextInput
              multiline
              placeholder="Bạn đang nghĩ gì?"
              className="text-lg text-gray-800 min-h-[120px]"
              textAlignVertical="top"
              value={content}
              onChangeText={setContent}
            />
          </View>
        </View>

        {image ? (
          <View className="relative mb-6 rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
            <Image
              source={{ uri: image.uri }}
              className="w-full aspect-square"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setImage(null)}
              className="absolute top-3 right-3 bg-black/50 w-8 h-8 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={showImagePicker}
            className="border-2 border-dashed border-gray-200 rounded-2xl h-60 items-center justify-center bg-gray-50 mb-6"
          >
            <View className="items-center">
              <View className="bg-orange-100 w-16 h-16 rounded-full items-center justify-center mb-3">
                <Ionicons name="image" size={32} color={brandColor} />
              </View>
              <Text className="text-gray-500 font-semibold text-lg">Thêm ảnh vào bài viết</Text>
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 shadow-sm bg-white">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Cộng đồng</Text>
          <TouchableOpacity
            onPress={handlePost}
            disabled={loading || (!content.trim() && !image)}
            className={`px-5 py-2 rounded-full ${loading ? "bg-gray-200" : "bg-orange-500"}`}
            style={!loading && { backgroundColor: brandColor }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-bold">Đăng</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row px-4 border-b border-gray-50 bg-white">
          <TouchableOpacity
            onPress={() => navigation.navigate("SeeImage")}
            className="flex-1 py-3 items-center"
          >
            <Text className="text-gray-500 font-bold">Xem cộng đồng</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("SeeYourImage")}
            className="flex-1 py-3 items-center"
          >
            <Text className="text-gray-500 font-bold">Ảnh của bạn</Text>
          </TouchableOpacity>
        </View>

        {renderTabContent()}
      </View>
    </KeyboardAvoidingView>
  );
};

export default UploadComment;