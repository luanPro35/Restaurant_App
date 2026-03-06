import React, { useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  SectionList,
  Animated,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../Header/Header";
import Category_Food from "./Category_Food";
import List_Food from "./List_Food";

export default function DeliveryScreen() {
  const navigation = useNavigation();
  const listRef = useRef<SectionList>(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleScrollToCategory = (index: number) => {
    listRef.current?.scrollToLocation({
      sectionIndex: index,
      itemIndex: 0,
      animated: true,
      viewOffset: 160,
    });
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false },
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F9F6E7]">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <Header scrollY={scrollY} />

      <List_Food
        ref={listRef}
        onScroll={onScroll}
        ListHeaderComponent={
          <View className="bg-[#F9F6E7] pb-2 pt-10">
            <Category_Food onSelectCategory={handleScrollToCategory} />
          </View>
        }
      />
      <View
        className="absolute bottom-16 left-0 right-0 items-center"
        pointerEvents="box-none"
      >
        <Animated.View
          style={{
            opacity: scrollY.interpolate({
              inputRange: [400, 800],
              outputRange: [0, 1],
              extrapolate: "clamp",
            }),
            marginBottom: 16,
            transform: [
              {
                scale: scrollY.interpolate({
                  inputRange: [400, 800],
                  outputRange: [0.5, 1],
                  extrapolate: "clamp",
                }),
              },
            ],
          }}
        >
          <TouchableOpacity
            onPress={() => {
              listRef.current?.scrollToLocation({
                sectionIndex: 0,
                itemIndex: 0,
                animated: true,
                viewOffset: 160,
              });
            }}
            className="bg-white/90 p-3 rounded-full shadow-lg border border-gray-100"
            activeOpacity={0.8}
            disabled={false}
          >
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name="arrow-up"
                size={24}
                color="#E07B39"
              />
              <Text className="text-[#E07B39]">Trở về trang đầu</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>

    </SafeAreaView>
  );
}
