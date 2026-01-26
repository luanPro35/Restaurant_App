import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

export default function Utilities() {
  return (
    <View className="flex-row items-center ml-2 gap-2">
      <TouchableOpacity className="p-2 bg-white rounded-full opacity-80">
        <MaterialIcons name="favorite-border" size={22} color="black" />
      </TouchableOpacity>
      <TouchableOpacity className="p-2 bg-white rounded-full opacity-80">
        <MaterialIcons name="confirmation-number" size={22} color="black" />
      </TouchableOpacity>
    </View>
  );
}
