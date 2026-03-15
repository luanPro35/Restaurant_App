import { View, Text, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';

export default function PaymentSuccessful() {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView className="flex-1 bg-[#FDFCF7]">
            <View className="flex-1 items-center justify-center px-8">
                <Animatable.View
                    animation="bounceIn"
                    duration={1500}
                    className="items-center justify-center mb-8"
                >
                    <View className="w-28 h-28 rounded-full bg-green-50 items-center justify-center">
                        <LinearGradient
                            colors={["#10B981", "#059669"]}
                            style={{
                                width: 90,
                                height: 90,
                                borderRadius: 45,
                                alignItems: "center",
                                justifyContent: "center",
                                ...Platform.select({
                                    ios: {
                                        shadowColor: "#10B981",
                                        shadowOffset: { width: 0, height: 10 },
                                        shadowOpacity: 0.4,
                                        shadowRadius: 15,
                                    },
                                    android: { elevation: 10 }
                                })
                            }}
                        >
                            <MaterialCommunityIcons name="check-bold" size={45} color="white" />
                        </LinearGradient>
                    </View>
                </Animatable.View>

                <Animatable.View
                    animation="fadeInUp"
                    delay={500}
                    className="items-center mb-12"
                >
                    <Text className="text-[32px] font-black text-slate-800 text-center leading-tight">Thanh toán{"\n"}thành công!</Text>
                    <View className="w-12 h-1 bg-green-500 rounded-full mt-4 mb-2" />
                    <Text className="text-slate-400 mt-4 text-center text-base font-medium px-4">
                        Cảm ơn bạn đã tin dùng dịch vụ của chúng tôi. Đơn hàng của bạn đang được xử lý.
                    </Text>
                </Animatable.View>

                <Animatable.View
                    animation="fadeInUp"
                    delay={1200}
                    className="w-full gap-5"
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate("Home")}
                        style={{
                            height: 60,
                            borderRadius: 30,
                            ...Platform.select({
                                ios: {
                                    shadowColor: "#E07B39",
                                    shadowOffset: { width: 0, height: 8 },
                                    shadowOpacity: 0.35,
                                    shadowRadius: 12,
                                },
                                android: { elevation: 8 }
                            })
                        }}
                    >
                        <LinearGradient
                            colors={["#E07B39", "#C96A2E"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={{
                                flex: 1,
                                borderRadius: 30,
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: 'hidden'
                            }}
                        >
                            <Text className="text-white font-black text-lg uppercase tracking-wider">Quay về Trang chủ</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => navigation.navigate("Package")}
                        className="py-5 items-center rounded-[30px] border-2 border-slate-100 bg-white"
                        style={{ height: 60, justifyContent: 'center' }}
                    >
                        <Text className="text-slate-400 font-black text-base uppercase tracking-tight">Chi tiết đơn hàng</Text>
                    </TouchableOpacity>
                </Animatable.View>
            </View>
        </SafeAreaView>
    );
}