import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useVietQr } from '../hooks/useVietQr';

export default function UploadImagePayment({ route }: { route: any }) {
    const navigation = useNavigation<any>();
    const { orderId, packageId } = route.params;
    const [image, setImage] = useState<string | null>(null);
    const { uploadReceipt, loading } = useVietQr();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Lỗi', 'Ứng dụng cần quyền truy cập camera để chụp ảnh');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleUpload = async () => {
        if (!image) {
            Alert.alert('Thông báo', 'Vui lòng chọn ảnh minh chứng chuyển khoản');
            return;
        }

        try {
            const formData = new FormData();
            const uriParts = image.split('.');
            const fileType = uriParts[uriParts.length - 1];
            // @ts-ignore
            formData.append('file', {
                uri: image,
                name: `receipt_${orderId || packageId}.${fileType}`,
                type: `image/${fileType}`,
            });

            if (orderId) formData.append('orderId', orderId);
            if (packageId) formData.append('packageId', packageId);

            const response = await uploadReceipt(formData);

            if (response) {
                navigation.navigate('PaymentSuccessful');
            }
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert('Lỗi', 'Không thể gửi ảnh minh chứng. Vui lòng thử lại sau.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <View className="mb-8">
                    <Text className="text-2xl font-black text-slate-800">Minh chứng thanh toán</Text>
                    <Text className="text-slate-500 mt-2">
                        Vui lòng tải lên ảnh màn hình chuyển khoản thành công để chúng tôi xác nhận đơn hàng của bạn.
                    </Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={pickImage}
                    className="w-full aspect-[4/3] bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 items-center justify-center overflow-hidden"
                >
                    {image ? (
                        <Image source={{ uri: image }} className="w-full h-full" />
                    ) : (
                        <View className="items-center">
                            <MaterialCommunityIcons name="image-plus" size={48} color="#94A3B8" />
                            <Text className="text-slate-400 mt-2 font-medium">Nhấn để chọn ảnh từ thư viện</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <View className="flex-row gap-4 mt-6">
                    <TouchableOpacity
                        onPress={takePhoto}
                        className="flex-1 flex-row bg-slate-100 py-4 rounded-2xl items-center justify-center"
                    >
                        <MaterialCommunityIcons name="camera" size={20} color="#475569" />
                        <Text className="text-slate-700 font-bold ml-2">Chụp ảnh</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setImage(null)}
                        className="flex-1 flex-row bg-red-50 py-4 rounded-2xl items-center justify-center"
                    >
                        <MaterialCommunityIcons name="trash-can" size={20} color="#EF4444" />
                        <Text className="text-red-600 font-bold ml-2">Xóa ảnh</Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-12">
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleUpload}
                        disabled={loading}
                        className={`py-4 rounded-2xl items-center shadow-lg ${loading ? 'bg-blue-300' : 'bg-blue-600 shadow-blue-200'}`}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white font-black text-lg">Gửi minh chứng</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigation.goBack()}
                        className="mt-4 py-4 rounded-2xl items-center"
                    >
                        <Text className="text-slate-400 font-bold">Quay lại</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
