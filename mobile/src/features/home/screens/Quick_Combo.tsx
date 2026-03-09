import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { productApi } from "../../../services/api/apiProducts";
import { seededShuffle, getDailySeed } from "../../../utils/random";
import { formatCurrency } from "../../../shared/utils";
import { useCart } from "../../../app/context/CartContext";
import { CustomerStackParamList } from "../../../app/navigation/CustomerNavigator";

const SimpleProductCard = ({ item, navigation }: { item: any, navigation: any }) => {
  const { addToCart } = useCart();
  
  const imageUrl = (item.images || item.image) && ((item.images || item.image).startsWith('http') || (item.images || item.image).startsWith('data:'))
    ? (item.images || item.image)
    : "https://res.cloudinary.com/dt9v7896q/image/upload/v1710502127/placeholder_food.png";

  return (
    <View className="mr-5 bg-white rounded-[32px] shadow-sm w-[180px] my-3 overflow-hidden border border-gray-100/50">
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => navigation.navigate("DetailProduct", { id: item.id.toString() })}
      >
        <View className="h-40 w-full bg-gray-50 relative">
          <Image
            source={{ uri: imageUrl }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          <View className="absolute top-3 left-3 bg-white/80 px-2 py-1 rounded-full border border-white/50">
            <Text className="text-[9px] font-black text-[#E07B39] uppercase">
              Combo
            </Text>
          </View>
        </View>

        <View className="p-4 pb-0 bg-white">
          <Text className="text-gray-800 text-[15px] font-black mb-1 truncate" numberOfLines={1}>
            {item.name}
          </Text>
        </View>
      </TouchableOpacity>

      <View className="p-4 pt-2 bg-white">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-[#E07B39] font-black text-[16px]">
              {typeof item.price === "number" ? formatCurrency(item.price) : item.price}
            </Text>
          </View>
          
          <TouchableOpacity 
            className="bg-[#E07B39] w-10 h-10 rounded-2xl items-center justify-center shadow-lg shadow-orange-200 active:scale-90"
            onPress={() => addToCart(item)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="cart-plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function Quick_Combo({ navigation }: { navigation: any }) {
  const [combos, setCombos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await productApi.getAll({ limit: 1000 });
        const allProducts = Array.isArray(response) ? response : response.data || [];
        
        if (allProducts.length > 0) {
          const shuffled = seededShuffle(allProducts, getDailySeed() + "_combo");
          setCombos(shuffled.slice(0, 8));
        }
      } catch (err) {
        console.error("Quick_Combo fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCombos();
  }, []);

  return (
    <View className="py-2">
      <View className="px-4 mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-1.5 h-7 bg-[#E07B39] rounded-full mr-3 shadow-sm" />
          <View>
            <Text className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Quick Combo</Text>
            <Text className="text-[#E07B39] text-[10px] font-bold uppercase tracking-[2px] mt-0.5">Ngon miệng và Tiện lợi</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View className="h-40 items-center justify-center">
          <ActivityIndicator size="small" color="#E07B39" />
        </View>
      ) : (
        <FlatList
          data={combos}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <SimpleProductCard item={item} navigation={navigation} />}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          snapToInterval={200}
          decelerationRate="fast"
        />
      )}
    </View>
  );
}
