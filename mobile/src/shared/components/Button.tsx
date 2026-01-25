import React from "react";
import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
}

export const Button = ({ title, ...props }: ButtonProps) => {
  return (
    <TouchableOpacity className="bg-blue-500 p-4 rounded" {...props}>
      <Text className="text-white text-center font-bold">{title}</Text>
    </TouchableOpacity>
  );
};
