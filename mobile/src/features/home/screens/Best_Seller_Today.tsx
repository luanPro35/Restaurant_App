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
import { IP } from "../../../config/ip";

const SimpleProductCard = ({ item, navigation }: { item: any, navigation: any }) => {
  const { addToCart } = useCart();
  
  const getImageUrl = (item: any) => {
    const imageInput = item.image || item.images;
    if (!imageInput) return "https://via.placeholder.com/400";
    
    let url = "";
    if (Array.isArray(imageInput)) {
      url = imageInput[0];
    } else if (typeof imageInput === 'string') {
      if (imageInput.startsWith('http') || imageInput.startsWith('data:')) {
        url = imageInput;
      } else {
        try {
          const parsed = JSON.parse(imageInput);
          url = Array.isArray(parsed) ? parsed[0] : (typeof parsed === 'string' ? parsed : "");
        } catch {
          url = imageInput;
        }
      }
    } else {
      url = String(imageInput);
    }

    if (!url || typeof url !== 'string') return "https://via.placeholder.com/400";
    return url.replace('localhost', IP);
  };

  const imageUrl = getImageUrl(item);

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
              Hot
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

export default function Best_Seller_Today({ navigation }: { navigation: any }) {
  const [dishes, setDishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await productApi.getAll({ limit: 1000 });
        const allProducts = Array.isArray(response) ? response : response.data || [];
        
        if (allProducts.length > 0) {
          const shuffled = seededShuffle(allProducts, getDailySeed() + "_bestseller");
          setDishes(shuffled.slice(0, 10));
        }
      } catch (err) {
        console.error("Best_Seller_Today fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBestSellers();
  }, []);

  return (
    <View className="py-2">
      <View className="px-4 mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-1.5 h-7 bg-[#E07B39] rounded-full mr-3 shadow-sm" />
          <View>
            <Text className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Bán chạy nhất</Text>
            <Text className="text-[#E07B39] text-[10px] font-bold uppercase tracking-[2px] mt-0.5">Xu hướng nổi bật hôm nay</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <View className="h-40 items-center justify-center">
          <ActivityIndicator size="small" color="#E07B39" />
        </View>
      ) : (
        <FlatList
          data={dishes}
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
