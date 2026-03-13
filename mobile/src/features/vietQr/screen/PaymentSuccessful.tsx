import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

export default function PaymentSuccessful() {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center px-6">
                <Animatable.View
                    animation="bounceIn"
                    duration={1500}
                    className="items-center justify-center mb-8"
                >
                    <View className="w-24 h-24 rounded-full bg-green-100 items-center justify-center">
                        <View className="w-20 h-20 rounded-full bg-green-500 items-center justify-center shadow-lg shadow-green-300">
                            <MaterialCommunityIcons name="check" size={50} color="white" />
                        </View>
                    </View>
                </Animatable.View>

                <Animatable.View
                    animation="fadeInUp"
                    delay={500}
                    className="items-center mb-10"
                >
                    <Text className="text-3xl font-black text-slate-800 text-center">Thanh toán thành công!</Text>
                    <Text className="text-slate-500 mt-2 text-center text-lg">
                        Cảm ơn bạn đã tin dùng dịch vụ của chúng tôi.
                    </Text>
                </Animatable.View>

                <Animatable.View
                    animation="fadeInUp"
                    delay={1200}
                    className="w-full gap-4"
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate("Home")}
                        style={{ borderRadius: 20, overflow: 'hidden' }}
                    >
                        <LinearGradient
                            colors={["#E07B39", "#C96A2E"]}
                            className="py-4 items-center"
                        >
                            <Text className="text-white font-black text-lg uppercase tracking-tight">Quay về Trang chủ</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate("Package")}
                        className="py-4 items-center rounded-2xl border border-slate-200"
                    >
                        <Text className="text-slate-500 font-bold text-lg">Xem chi tiết đơn hàng</Text>
                    </TouchableOpacity>
                </Animatable.View>
            </View>
        </SafeAreaView>
    );
}