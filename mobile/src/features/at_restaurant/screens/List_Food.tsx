import React, { forwardRef, useRef, useImperativeHandle } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { MENU_SECTIONS } from "../../../data/dish";

const ITEM_HEIGHT = 140;
const HEADER_HEIGHT = 50;

const List_Food = forwardRef(
  (
    {
      onScroll,
      ListHeaderComponent,
    }: { onScroll?: any; ListHeaderComponent?: any },
    ref,
  ) => {
    const sectionListRef = useRef<SectionList>(null);

    useImperativeHandle(ref, () => ({
      scrollToLocation: (params: any) => {
        sectionListRef.current?.scrollToLocation(params);
      },
      scrollToOffset: (params: any) => {
        sectionListRef.current?.getScrollResponder()?.scrollTo({
          y: params.offset,
          animated: params.animated,
        });
      },
    }));

    const getItemLayout = (data: any, index: number) => {
      let offset = 0;
      let categoryIndex = 0;
      let itemIndex = 0;
      let globalIndex = 0;

      for (let i = 0; i < MENU_SECTIONS.length; i++) {
        if (globalIndex === index) {
          return { length: HEADER_HEIGHT, offset, index };
        }
        offset += HEADER_HEIGHT;
        globalIndex++;

        const sectionData = MENU_SECTIONS[i].data;
        for (let j = 0; j < sectionData.length; j++) {
          if (globalIndex === index) {
            return { length: ITEM_HEIGHT, offset, index };
          }
          offset += ITEM_HEIGHT;
          globalIndex++;
        }
      }

      return { length: ITEM_HEIGHT, offset, index };
    };

    return (
      <View className="flex-1 bg-[#F9F6E7]">
        <Animated.SectionList
          ref={sectionListRef}
          sections={MENU_SECTIONS}
          keyExtractor={(item) => item.id.toString()}
          stickySectionHeadersEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 280 }}
          ListHeaderComponent={ListHeaderComponent}
          getItemLayout={getItemLayout}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderSectionHeader={({ section: { title } }) => (
            <View
              className="bg-[#F9F6E7] py-3 px-4 shadow-sm border-b border-gray-100"
              style={{ height: HEADER_HEIGHT }}
            >
              <View className="flex-row items-center h-full">
                <View className="w-1 h-6 bg-[#E07B39] rounded-full mr-2" />
                <Text className="text-xl font-bold text-[#2D2D2D]">
                  {title}
                </Text>
              </View>
            </View>
          )}
          renderItem={({ item }) => (
            <View
              className="px-4 py-3 bg-white mb-2 mx-4 rounded-xl shadow-sm border border-gray-50 flex-row"
              style={{ height: ITEM_HEIGHT - 8 }}
            >
              <View className="w-24 h-24 bg-orange-50 rounded-lg justify-center items-center mr-3">
                <MaterialCommunityIcons
                  name="food"
                  size={32}
                  color="#E07B39"
                  style={{ opacity: 0.5 }}
                />
              </View>

              <View className="flex-1 justify-between py-1">
                <View>
                  <Text
                    className="text-lg font-bold text-[#2D2D2D]"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text
                    className="text-[#888888] text-xs mt-1"
                    numberOfLines={2}
                  >
                    {item.description || "Món ăn ngon hấp dẫn"}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-[#E07B39] font-bold text-base">
                    {item.price}
                  </Text>

                  <TouchableOpacity className="bg-[#E07B39] rounded-full p-1.5 shadow-md active:opacity-80">
                    <Ionicons name="add" size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>
    );
  },
);

export default List_Food;
