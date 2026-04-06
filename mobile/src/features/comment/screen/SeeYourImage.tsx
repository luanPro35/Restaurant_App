import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useComment } from "../hooks/useComment";
import { useAuth } from "../../../app/context/AuthContext";

const { width } = Dimensions.get("window");
const COLUMN_SIZE = (width - 32 - 16) / 3;

const SeeYourImage: React.FC<{ showHeader?: boolean }> = ({ showHeader = true }) => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { comments, loading, getCommentsByUserId, deleteComment } = useComment();

  const brandColor = "#E07B39";

  useEffect(() => {
    if (user?.id) {
      getCommentsByUserId(user.id);
    }
  }, [user?.id]);

  const handleEdit = (comment: any) => {
    navigation.navigate("EditComment", { comment });
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa bài viết này không?",
      [
        { text: "Hủy", style: "cancel" },
        { 
          text: "Xóa", 
          style: "destructive", 
          onPress: async () => {
            await deleteComment(id);
            if (user?.id) getCommentsByUserId(user.id);
          }
        }
      ]
    );
  };

  const commentImages = comments;

  return (
    <View 
      className="flex-1 bg-white" 
      style={{ paddingTop: showHeader ? insets.top : 0 }}
    >
      {showHeader && (
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100 shadow-sm bg-white">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
            <Ionicons name="chevron-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Ảnh của bạn</Text>
          <View className="w-10" />
        </View>
      )}

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={brandColor} />
        </View>
      ) : commentImages.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <View className="bg-gray-50 p-8 rounded-full mb-4 shadow-sm">
            <Ionicons name="images-outline" size={64} color="#D1D5DB" />
          </View>
          <Text className="text-gray-500 text-center font-bold text-xl">Chưa có hình ảnh nào</Text>
        </View>
      ) : (
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row flex-wrap" style={{ gap: 8 }}>
            {commentImages.map((comment) => (
              <View 
                key={comment.id} 
                className="bg-gray-100 rounded-2xl overflow-hidden relative border border-gray-50 shadow-sm"
                style={{ width: COLUMN_SIZE, height: COLUMN_SIZE }}
              >
                {comment.imageUrl ? (
                <Image
                  source={{ uri: comment.imageUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-gray-100 items-center justify-center">
                  <Ionicons name="document-text-outline" size={32} color="#ccc" />
                </View>
              )}
                
                <View className="absolute inset-0 bg-black/10 flex-row justify-between p-2 items-end">
                  <TouchableOpacity 
                    onPress={() => handleEdit(comment)}
                    className="bg-white/95 p-1.5 rounded-xl shadow-md border border-white"
                  >
                    <Ionicons name="create" size={18} color={brandColor} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={() => handleDelete(comment.id)}
                    className="bg-white/95 p-1.5 rounded-xl shadow-md border border-white"
                  >
                    <Ionicons name="trash" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default SeeYourImage;
