import React from "react";
import { View, FlatList, Image, Text } from "react-native";

import Banner1 from "../../../../assets/Banner1.png";
import Banner2 from "../../../../assets/Banner2.png";
import Banner3 from "../../../../assets/Banner3.png";

const List_Banner = [
  {
    id: 1,
    image: Banner1,
    description: "Mua ngay",
  },
  {
    id: 2,
    image: Banner2,
    description: "Mua ngay",
  },
  {
    id: 3,
    image: Banner3,
    description: "Ưu đãi hot. Mua ngay",
  },
];

export default function Banner_Introduce() {
  return (
    <View className="py-2">
      <FlatList
        data={List_Banner}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        snapToInterval={300 + 16}
        decelerationRate="fast"
        pagingEnabled={false}
        renderItem={({ item }) => (
          <View className="mr-4">
            <Text className="text-[20px] text-[#2D2D2D] font-semibold mb-2">
              {item.description}
            </Text>
            <Image
              source={item.image}
              className="w-[300px] h-[150px] rounded-2xl"
              resizeMode="cover"
            />
          </View>
        )}
      />
    </View>
  );
}
