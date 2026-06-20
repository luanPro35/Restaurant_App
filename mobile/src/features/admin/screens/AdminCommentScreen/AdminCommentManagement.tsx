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
import { useComment } from "../../../comment/hooks/useComment";

const { width } = Dimensions.get("window");
const IMAGE_WIDTH = width - 48;

const AdminCommentManagement: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { comments, loading, getComments, deleteComment } = useComment();

  const brandColor = "#E07B39";

  useEffect(() => {
    getComments();
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Xác nhận xóa (Quản trị)",
      "Bạn có chắc chắn muốn xóa bài viết này của người dùng không? Hành động này không thể hoàn tác.",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa vi phạm",
          style: "destructive",
          onPress: async () => {
            await deleteComment(id);
            getComments();
          }
        }
      ]
    );
  };

  return (
    <View
      className="flex-1 bg-gray-50"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-100 shadow-sm">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-xl font-bold text-gray-800">Kiểm duyệt Cộng đồng</Text>
          <Text className="text-gray-400 text-xs uppercase tracking-widest font-bold">Quản trị viên</Text>
        </View>
        <TouchableOpacity onPress={() => getComments()} className="p-1">
          <Ionicons name="refresh" size={24} color={brandColor} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={brandColor} />
          <Text className="mt-4 text-gray-400 font-medium">Đang tải dữ liệu cộng đồng...</Text>
        </View>
      ) : comments.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <Ionicons name="chatbubbles-outline" size={80} color="#D1D5DB" />
          <Text className="text-gray-500 text-center font-bold text-xl mt-4">Cộng đồng đang yên tĩnh</Text>
          <Text className="text-gray-400 text-center mt-2">Chưa có bình luận nào để kiểm duyệt.</Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-orange-100 p-4 rounded-2xl mb-6 flex-row items-center">
            <Ionicons name="shield-checkmark" size={24} color="#C2410C" />
            <Text className="ml-3 text-orange-800 font-medium flex-1">
              Bạn đang xem toàn bộ bài đăng của khách hàng. Hãy xóa những nội dung vi phạm chính sách.
            </Text>
          </View>

          {comments.map((comment) => (
            <View
              key={comment.id}
              className="bg-white rounded-3xl mb-6 p-5 border border-gray-100 shadow-sm relative"
            >
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                    <Ionicons name="person" size={20} color="#1D4ED8" />
                  </View>
                  <View>
                    <Text className="font-bold text-gray-800">Người dùng ẩn danh</Text>
                    <Text className="text-gray-400 text-xs italic">ID: {comment.id.substring(0, 8)}...</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleDelete(comment.id)}
                  className="bg-red-50 p-2.5 rounded-full"
                >
                  <Ionicons name="trash" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <Text className="text-gray-700 text-lg leading-relaxed mb-4 font-medium">
                {comment.content}
              </Text>

              {comment.imageUrl && (
                <View className="rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                  <Image
                    source={{ uri: comment.imageUrl }}
                    style={{ width: width - 82, height: (width - 82) * 0.7 }}
                    resizeMode="cover"
                  />
                </View>
              )}

              <View className="mt-4 pt-4 border-t border-gray-50 flex-row justify-between">
                <Text className="text-gray-300 text-xs uppercase font-bold">Ngày đăng: {new Date().toLocaleDateString()}</Text>
                <View className="flex-row items-center">
                  <Ionicons name="eye-outline" size={14} color="#D1D5DB" />
                  <Text className="text-gray-300 text-xs ml-1">Công khai</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default AdminCommentManagement;
