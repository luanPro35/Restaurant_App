import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    StatusBar,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function WatchImage() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const insets = useSafeAreaInsets();
    const { imageUrl } = route.params || {};

    if (!imageUrl) {
        return (
            <View className="flex-1 bg-black items-center justify-center">
                <Text className="text-white">Không tìm thấy hình ảnh</Text>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    className="mt-4 bg-white/20 px-6 py-2 rounded-full"
                >
                    <Text className="text-white font-bold">Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle="light-content" />
            
            {/* Header */}
            <View 
                className="absolute top-0 left-0 right-0 z-10 flex-row items-center justify-between px-4 pb-4 bg-black/40"
                style={{ paddingTop: insets.top + 10 }}
            >
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 items-center justify-center rounded-full bg-black/20"
                >
                    <Ionicons name="close" size={28} color="white" />
                </TouchableOpacity>
                <Text className="text-white font-bold text-lg">Xem ảnh</Text>
                <View className="w-10" />
            </View>

            {/* Image Viewer */}
            <View className="flex-1 items-center justify-center">
                <Image
                    source={{ uri: imageUrl }}
                    style={{ width: width, height: height * 0.8 }}
                    resizeMode="contain"
                />
            </View>

            {/* Bottom Actions (Optional) */}
            <View 
                className="absolute bottom-0 left-0 right-0 p-6 bg-black/40"
                style={{ paddingBottom: insets.bottom + 20 }}
            >
                <TouchableOpacity 
                    className="flex-row items-center justify-center bg-white/10 py-3 rounded-2xl border border-white/20"
                    onPress={() => {
                        // Logic to save image could go here
                    }}
                >
                    <Ionicons name="download-outline" size={20} color="white" className="mr-2" />
                    <Text className="text-white font-semibold ml-2">Lưu hình ảnh</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
