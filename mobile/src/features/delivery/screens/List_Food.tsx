import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
} from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  Image,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useDelivery } from "../hooks/useDelivery";

const ITEM_HEIGHT = 160;
const HEADER_HEIGHT = 60;

const List_Food = forwardRef(
  (
    {
      onScroll,
      ListHeaderComponent,
    }: { onScroll?: any; ListHeaderComponent?: any },
    ref,
  ) => {
    const { menu, loading, fetchMenu } = useDelivery();
    const sectionListRef = useRef<SectionList>(null);

    useEffect(() => {
      fetchMenu();
    }, [fetchMenu]);

    const MENU_SECTIONS = React.useMemo(() => {
      if (!menu || menu.length === 0) return [];

      const grouped = menu.reduce((acc: any, item: any) => {
        const categoryName = item.category?.name || "Đặc sắc";
        if (!acc[categoryName]) {
          acc[categoryName] = [];
        }
        acc[categoryName].push(item);
        return acc;
      }, {});

      return Object.keys(grouped).map((title) => ({
        title,
        data: grouped[title],
      }));
    }, [menu]);

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

    const formatPrice = (price: any) => {
      if (typeof price === "string") return price;
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
    };

    if (loading && menu.length === 0) {
      return (
        <View className="flex-1 justify-center items-center bg-[#FDFCF7]">
          <ActivityIndicator size="large" color="#E07B39" />
          <Text className="mt-4 text-[#888888] font-medium italic">
            Đang chuẩn bị thực đơn...
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-1 bg-[#FDFCF7]">
        <Animated.SectionList
          ref={sectionListRef}
          sections={MENU_SECTIONS}
          keyExtractor={(item) =>
            item.id ? item.id.toString() : Math.random().toString()
          }
          stickySectionHeadersEnabled={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 280, paddingBottom: 100 }}
          ListHeaderComponent={ListHeaderComponent}
          getItemLayout={getItemLayout}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderSectionHeader={({ section: { title } }) => (
            <View className="bg-[#FDFCF7]/95 py-4 px-6 h-[60px] border-b border-gray-50 flex-row items-center">
              <View className="w-1.5 h-6 bg-[#E07B39] rounded-full mr-3" />
              <Text className="text-xl font-bold text-[#1A1A1A]">{title}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity activeOpacity={0.7} className="px-4 py-3">
              <View className="bg-white rounded-[32px] p-4 flex-row shadow-sm border border-gray-100/50">
                <View className="relative">
                  <View className="w-24 h-24 bg-[#F9F6E7] rounded-3xl overflow-hidden justify-center items-center">
                    {item.images ? (
                      <Image
                        source={{
                          uri:
                            typeof item.images === "string" &&
                            item.images.startsWith("[")
                              ? JSON.parse(item.images)[0]
                              : item.images,
                        }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="food-outline"
                        size={32}
                        color="#E07B39"
                        className="opacity-40"
                      />
                    )}
                  </View>
                  {item.isBestSeller && (
                    <View className="absolute -top-1 -left-1 bg-red-500 px-2 py-0.5 rounded-full shadow-sm">
                      <Text className="text-[8px] text-white font-black">
                        HOT
                      </Text>
                    </View>
                  )}
                </View>

                <View className="flex-1 ml-4 justify-between py-1">
                  <View>
                    <Text
                      className="text-lg font-bold text-[#1A1A1A]"
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text
                      className="text-[#9CA3AF] text-xs mt-1 leading-4"
                      numberOfLines={2}
                    >
                      {item.description ||
                        "Hương vị truyền thống đậm đà khó cưỡng từ bếp nhà"}
                    </Text>
                  </View>

                  <View className="flex-row items-end justify-between">
                    <Text className="text-[#E07B39] font-black text-lg">
                      {formatPrice(item.price)}
                    </Text>

                    <TouchableOpacity className="bg-[#E07B39] w-9 h-9 rounded-2xl justify-center items-center shadow-lg shadow-orange-200 active:scale-90">
                      <Ionicons name="add" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() =>
            !loading && (
              <View className="flex-1 justify-center items-center pt-20">
                <MaterialCommunityIcons
                  name="food-off-outline"
                  size={64}
                  color="#D1D5DB"
                />
                <Text className="mt-4 text-[#9CA3AF] font-medium">
                  Hiện tại thực đơn đang trống
                </Text>
              </View>
            )
          }
        />
      </View>
    );
  },
);

export default List_Food;
