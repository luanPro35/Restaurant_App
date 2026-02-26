import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CustomerStackParamList } from "../../../app/navigation/CustomerNavigator";

import { useProfile } from "../hooks/useProfile";
import { useFocusEffect } from "@react-navigation/native";

type ProfileNavigationProp = NativeStackNavigationProp<CustomerStackParamList>;

export default function HeaderProfile() {
  const navigation = useNavigation<ProfileNavigationProp>();
  const { profile, fetchProfile } = useProfile();

  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
    }, [fetchProfile]),
  );

  return (
    <View className="flex-row items-center justify-between px-6 py-6 bg-white shadow-md rounded-3xl border border-gray-100">
      <View className="flex-row items-center flex-1">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ChangeProfile", { item: profile })
          }
          className="w-16 h-16 rounded-full bg-orange-100 items-center justify-center border-2 border-orange-500 shadow-sm"
        >
          <Ionicons name="person" size={32} color="#f97316" />
          <TouchableOpacity className="absolute bottom-0 right-0 bg-orange-500 w-6 h-6 rounded-full items-center justify-center border-2 border-white">
            <Ionicons name="camera" size={12} color="white" />
          </TouchableOpacity>
        </TouchableOpacity>

        <View className="ml-4">
          <Text className="text-xl font-bold text-gray-900">
            {profile?.name || "Luân"}
          </Text>
        </View>
      </View>

      <TouchableOpacity className="bg-orange-50 px-5 py-2.5 rounded-full border border-orange-100 shadow-sm">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ChangeProfile", { item: profile })
          }
        >
          <Text className="text-orange-600 text-sm font-bold text-center">
            Hồ sơ
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}
