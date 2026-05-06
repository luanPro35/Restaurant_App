import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useComment } from "../hooks/useComment";

const { width } = Dimensions.get("window");
const IMAGE_WIDTH = width - 32;

const SeeImage: React.FC = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { comments, loading, getComments } = useComment();

  const brandColor = "#E07B39";

  useEffect(() => {
    getComments();
  }, []);

  const feedItems = comments;

  return (
    <View
      className="flex-1 bg-white"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-1">
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Cộng đồng</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Comment")}
          className="bg-orange-50 p-2 rounded-full"
        >
          <Ionicons name="add-circle" size={28} color={brandColor} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={brandColor} />
        </View>
      ) : feedItems.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <View className="bg-gray-50 p-8 rounded-full mb-4">
            <Ionicons name="images-outline" size={64} color="#D1D5DB" />
          </View>
          <Text className="text-gray-500 text-center font-semibold text-lg">Chưa có bài viết nào</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Comment")}
            className="mt-6 px-6 py-3 rounded-full"
            style={{ backgroundColor: brandColor }}
          >
            <Text className="text-white font-bold">Hãy là người đầu tiên đăng bài</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {feedItems.map((comment) => (
            <View
              key={comment.id}
              className="bg-white rounded-3xl mb-6 p-4 border border-gray-50 shadow-sm"
              style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 }}
            >
              <View className="flex-row items-center mb-3">
                <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center mr-3">
                  <Ionicons name="person" size={20} color={brandColor} />
                </View>
                <View>
                  <Text className="font-bold text-gray-800">Cư dân cộng đồng</Text>
                </View>
              </View>

              <Text className="text-gray-700 text-base leading-relaxed mb-4">
                {comment.content}
              </Text>

              {comment.imageUrl && (
                <TouchableOpacity
                  onPress={() => navigation.navigate("WatchImage", { imageUrl: comment.imageUrl })}
                  className="rounded-2xl overflow-hidden bg-gray-100"
                >
                  <Image
                    source={{ uri: comment.imageUrl }}
                    style={{ width: IMAGE_WIDTH - 32, height: (IMAGE_WIDTH - 32) * 0.75 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}

            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default SeeImage;
