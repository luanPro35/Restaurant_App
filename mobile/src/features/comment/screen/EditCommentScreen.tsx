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
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useComment } from "../hooks/useComment";
import { Comment } from "../../../services/api/apiComment";

const EditCommentScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { updateComment, loading } = useComment();
  
  const { comment } = route.params as { comment: Comment };

  const [content, setContent] = useState(comment.content);
  const [image, setImage] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(comment.imageUrl || null);

  const brandColor = "#E07B39";

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
      const selectedAsset = result.assets[0];
      setImage(selectedAsset);
      setPreviewImage(selectedAsset.uri);
    }
  };

  const handleUpdate = async () => {
    if (!content.trim()) {
      Alert.alert("Thông báo", "Vui lòng nhập nội dung!");
      return;
    }

    try {
      await updateComment(comment.id, { content: content.trim() }, image);
      Alert.alert("Thành công", "Bài viết đã được cập nhật!", [
        { text: "OK", onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Cập nhật bài viết thất bại.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="flex-1" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 shadow-sm bg-white">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
            <Ionicons name="close" size={28} color="#333" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Sửa bài viết</Text>
          <TouchableOpacity 
            onPress={handleUpdate}
            disabled={loading || !content.trim()}
            className={`px-5 py-2 rounded-full ${loading ? "bg-gray-200" : "bg-orange-500"}`}
            style={!loading && { backgroundColor: brandColor }}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-bold text-base">Lưu</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
          <TextInput
            multiline
            placeholder="Bạn đang nghĩ gì?"
            className="text-lg text-gray-800 min-h-[140px] mb-8 leading-relaxed"
            textAlignVertical="top"
            value={content}
            onChangeText={setContent}
          />

          {previewImage ? (
            <View className="relative mb-8 rounded-3xl overflow-hidden shadow-lg border border-gray-100">
              <Image
                source={{ uri: previewImage }}
                className="w-full aspect-video"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => {
                  setImage(null);
                  setPreviewImage(null);
                }}
                className="absolute top-4 right-4 bg-black/60 w-10 h-10 rounded-full items-center justify-center border border-white/20"
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={pickImage}
                className="absolute bottom-4 right-4 bg-white/95 px-4 py-2.5 rounded-2xl flex-row items-center shadow-lg border border-gray-50"
              >
                <Ionicons name="camera" size={20} color={brandColor} />
                <Text style={{ color: brandColor }} className="ml-2 font-bold">Thay thế ảnh</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={pickImage}
              className="border-2 border-dashed border-gray-200 rounded-3xl h-52 items-center justify-center bg-gray-50 mb-8"
            >
              <View className="items-center">
                <View className="bg-orange-100 w-14 h-14 rounded-full items-center justify-center mb-3">
                  <Ionicons name="cloud-upload" size={28} color={brandColor} />
                </View>
                <Text className="text-gray-500 font-bold text-lg leading-relaxed">Đính kèm hình ảnh</Text>
              </View>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditCommentScreen;
