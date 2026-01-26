import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const imagePlaceholder =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMVFRUXGBgVFxgYGBgXFxoYFxcXGBUXFxcaHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0lICItLS0tLS0tLS0rLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tN//AABEIAKcBLgMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAEBQMGAAIHAQj/xAA9EAABAgQEBAQDBwMDBAMAAAABAhEAAwQhBRIxQQZRYXETIoGRMqGxB0JSwdHh8BQjchZiohUkgvFTkrL/xAAaAQADAQEBAQAAAAAAAAAAAAACAwQBAAUG/8QAKhEAAgICAgEEAQQCAwAAAAAAAQIAEQMhEjEEEyJBUTIFFGGRceGBobH/2gAMAwEAAhEDEQA19SzzkSByH0hhTJe7wow2R5A2jD5iG8iQzER8Tix2/IfErLCSIDKVbXeI5sk7QQRHstbxc2NW7ggweXJyjlC6YRmuXh0hYu8Ja8pBLawjLjGJAVMIGFSqkOIYSKgHT1irCddod4PPezOBqesLw5STU4xslTwvxQNoTbWDp80JEV6urmJDu8OyvXtuYBC6db+sEUyjmhPRVBNoc0ouDDvFF6mNDqsBSY5nx6nJMSobhjHT5khxCjEOFpM9QM0qU2wLD1OsewuFi1mCrVOO0WKGSsKDgE3jpmB4p4yQQFPzALesP6PAKSV8EiWDzIzH3LwyCwLBh2jcniIW5XUcPINVUq9bgP9WP78s9DowitVf2U/wDxLDcl/qI6YZo5wOuvQNTGejiXsxieZmT8Jy5P2PzHfxZQHQKMOKD7NVyvhmyu+UxdRiqDoXjabiKUhzAl/GIJvQ/mE/keS44n/wAlTVwJNOs2WfRQhPiH2ZVCnKJkr1Kh+UX+VjCFRMvEUDUwWPN4wTkpFf5i1fyE9s4fW/ZZiaVZkolrb8MwP8wIgqOGsQljz0s3/wAQFD/iTHek16DoqJRVjnDiMT7Edg/UM+A6nzDiCp0lQK0rQeRBH1iz4VOmVMtJyKOzsbR3aamXMDKSlXcA/WNP6KU2VKQkf7QBC8niq40YOfznzNbCpxccGTZzlLJfVSvyEEyvs/8ACSVCcpShdgA0dQn4KW/tqD/7/wBop3EiayUlRVKUU80eYfK4iVsOVRVTMZxsbJk+F1EuTKDAJttqe5hVi/EwSCxaKJM4gUUhId7wCsrWbmFjAx/KVAqOoyxHFpk5TAsIZ4PhoQHOpgXCcNA8yrmHqBFSIFGot2uehEZlMSoTG/hwy4FSDKeUalEElJjADyjOU2oCRHsuSVaAmCV722Jg7hvDZ89GZCCR+InKCeQJ19I2yepoUVZNS74VStLQ/WNP6KU2VKQkf7QBC8niq40YOfznzNbCpxccGTZzlLJfVSvyEEyvs/8ACSVCcpShdgA0dQn4KW/tqD/7/wBop3EiayUlRVKUU80eYfK4iVsOVRVTMZxsbJk+F1EuTKDAJttqe5hVi/EwSCxaKJM4gUUhId7wCsrWbmFjAx/KVAqOoyxHFpk5TAsIZ4PhoQHOpgXCcNA8yrmHqBFSIFGot2uehEZlMSoTG/hwy4FSDKeUalEElJjADyjOU2oCRHsuSVaAmCV722Jg7hvDZ89GZCCR+InKCeQJ19I2yepoUVZNS74VStLQ/wB4";

const morningDishes = [
  {
    id: 1,
    name: "Bánh mì chiên",
    price: "20.000đ",
    category: "Khai vị",
    image: imagePlaceholder,
  },
  {
    id: 2,
    name: "Súp gà ngô kem",
    price: "15.000đ",
    category: "Súp",
    image: imagePlaceholder,
  },
  {
    id: 3,
    name: "Cà phê Muối",
    price: "30.000đ",
    category: "Đồ uống",
    image: imagePlaceholder,
  },
  {
    id: 4,
    name: "Súp lươn",
    price: "20.000đ",
    category: "Súp",
    image: imagePlaceholder,
  },
];

const lunchDishes = [
  {
    id: 5,
    name: "Gà hấp lá chanh",
    price: "200.000đ",
    category: "Gà ta",
    image: imagePlaceholder,
  },
  {
    id: 6,
    name: "Rau bò khai xào tỏi",
    price: "50.000đ",
    category: "Rau",
    image: imagePlaceholder,
  },
  {
    id: 7,
    name: "Nộm ngó sen tôm thịt",
    price: "120.000đ",
    category: "Nộm",
    image: imagePlaceholder,
  },
  {
    id: 8,
    name: "Gà rang muối",
    price: "230.000đ",
    category: "Gà ta",
    image: imagePlaceholder,
  },
];

const dinnerDishes = [
  {
    id: 9,
    name: "Lẩu gà đen dân tộc",
    price: "700.000đ",
    category: "Gà đen",
    image: imagePlaceholder,
  },
  {
    id: 10,
    name: "Gà nướng ngũ vị",
    price: "400.000đ",
    category: "Gà ta",
    image: imagePlaceholder,
  },
  {
    id: 11,
    name: "Rượu Táo Mèo",
    price: "150.000đ",
    category: "Đồ uống",
    image: imagePlaceholder,
  },
  {
    id: 12,
    name: "Gà đen nướng mọi",
    price: "500.000đ",
    category: "Gà đen",
    image: imagePlaceholder,
  },
];

type MealTime = "morning" | "lunch" | "dinner";

export default function MealOption() {
  const [selectedMeal, setSelectedMeal] = useState<MealTime>("morning");

  const getDishes = () => {
    switch (selectedMeal) {
      case "morning":
        return morningDishes;
      case "lunch":
        return lunchDishes;
      case "dinner":
        return dinnerDishes;
      default:
        return morningDishes;
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity className="mr-4 bg-white rounded-2xl shadow-sm w-[180px] my-2">
      <View className="h-32 w-full relative">
        <Image
          source={{ uri: item.image }}
          className="w-full h-full rounded-t-2xl"
          resizeMode="cover"
        />
        <View className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full">
          <Text className="text-[10px] font-bold text-[#E07B39]">
            {item.category}
          </Text>
        </View>
      </View>

      <View className="p-3 space-y-1">
        <Text className="text-sm font-bold text-gray-800" numberOfLines={1}>
          {item.name}
        </Text>

        <View className="flex-row items-center justify-between">
          <Text className="text-[#E07B39] font-bold text-sm">{item.price}</Text>
          <View className="bg-[#E07B39] p-1.5 rounded-full">
            <MaterialCommunityIcons name="plus" size={16} color="white" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="py-4">
      <View className="px-4 mb-4">
        <Text className="text-2xl font-bold text-[#2D2D2D] mb-4">
          Gợi ý theo bữa
        </Text>
      </View>

      <View className="flex-row px-4 mb-4 space-x-3">
        <TouchableOpacity
          onPress={() => setSelectedMeal("morning")}
          className={`px-6 py-2 rounded-full border ${
            selectedMeal === "morning"
              ? "bg-orange-500 border-orange-500"
              : "bg-white border-gray-200"
          }`}
        >
          <Text
            className={`font-semibold ${
              selectedMeal === "morning" ? "text-white" : "text-gray-600"
            }`}
          >
            Sáng
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedMeal("lunch")}
          className={`px-6 py-2 rounded-full border ${
            selectedMeal === "lunch"
              ? "bg-orange-500 border-orange-500"
              : "bg-white border-gray-200"
          }`}
        >
          <Text
            className={`font-semibold ${
              selectedMeal === "lunch" ? "text-white" : "text-gray-600"
            }`}
          >
            Trưa
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedMeal("dinner")}
          className={`px-6 py-2 rounded-full border ${
            selectedMeal === "dinner"
              ? "bg-orange-500 border-orange-500"
              : "bg-white border-gray-200"
          }`}
        >
          <Text
            className={`font-semibold ${
              selectedMeal === "dinner" ? "text-white" : "text-gray-600"
            }`}
          >
            Tối
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={getDishes()}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
}
