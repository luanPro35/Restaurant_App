import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  StatusBar,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { useAdminCategories } from "../../hooks/useAdminCategories";
import { Category } from "../../../../services/api/category.api";
import { AdminCategoryCard } from "../../components/AdminCategoryCard";
import { AdminCategoryDetailModal } from "../../components/AdminCategoryDetailModal";
import { AdminCategoryFormModal } from "../../components/AdminCategoryFormModal";

export default function AdminCategoriesScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const {
    categories,
    loading,
    refreshing,
    handleRefresh,
    getCategoryDetail,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useAdminCategories();

  // Search state
  const [search, setSearch] = useState("");

  // Modals state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const [formModalVisible, setFormModalVisible] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  // Filter categories by search keyword
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase().trim();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.slug && c.slug.toLowerCase().includes(q))
    );
  }, [categories, search]);

  // Total products count across categories
  const totalProducts = useMemo(() => {
    return categories.reduce((sum, c) => {
      const count = c._count?.products ?? (c.products?.length || 0);
      return sum + count;
    }, 0);
  }, [categories]);

  // Handlers
  const handleOpenDetail = (category: Category) => {
    setSelectedCategory(category);
    setDetailModalVisible(true);
  };

  const handleOpenCreate = () => {
    setCategoryToEdit(null);
    setFormModalVisible(true);
  };

  const handleOpenEdit = (category: Category) => {
    setCategoryToEdit(category);
    setFormModalVisible(true);
  };

  const handleDelete = async (category: Category) => {
    await deleteCategory(category.id, category.name);
  };

  const handleFormSubmit = async (data: {
    name: string;
    description?: string;
    image?: string;
    order?: number;
    slug?: string;
  }) => {
    if (categoryToEdit) {
      return await updateCategory(categoryToEdit.id, data);
    } else {
      return await createCategory(data);
    }
  };

  const renderHeader = () => (
    <View
      style={{ paddingTop: insets.top + (Platform.OS === "android" ? 10 : 0) }}
      className="px-5 pb-4 bg-[#FDFCF7] border-b border-gray-100"
    >
      {/* Top Bar */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-11 h-11 bg-white shadow-sm rounded-2xl items-center justify-center border border-gray-100"
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={26}
            color="#1F2937"
          />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[2px]">
            Quản trị thực đơn
          </Text>
          <Text className="text-xl font-black text-gray-900 tracking-tight">
            Danh mục món ăn
          </Text>
        </View>

        {/* Refresh Button */}
        <TouchableOpacity
          onPress={handleRefresh}
          className="w-11 h-11 bg-white shadow-sm rounded-2xl items-center justify-center border border-gray-100"
        >
          <MaterialCommunityIcons
            name="refresh"
            size={22}
            color="#E07B39"
          />
        </TouchableOpacity>
      </View>

      {/* KPI / Summary Banner */}
      <View className="flex-row space-x-3 mb-4">
        <View className="flex-1 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm flex-row items-center">
          <View className="w-10 h-10 rounded-xl bg-orange-50 items-center justify-center mr-3 border border-orange-100">
            <MaterialCommunityIcons
              name="view-grid-outline"
              size={20}
              color="#E07B39"
            />
          </View>
          <View>
            <Text className="text-gray-400 text-[10px] font-bold uppercase">
              Tổng danh mục
            </Text>
            <Text className="text-gray-900 text-lg font-black">
              {categories.length}
            </Text>
          </View>
        </View>

        <View className="flex-1 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm flex-row items-center">
          <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center mr-3 border border-blue-100">
            <MaterialCommunityIcons
              name="food-fork-drink"
              size={20}
              color="#2563EB"
            />
          </View>
          <View>
            <Text className="text-gray-400 text-[10px] font-bold uppercase">
              Món liên kết
            </Text>
            <Text className="text-gray-900 text-lg font-black">
              {totalProducts} món
            </Text>
          </View>
        </View>
      </View>

      {/* Search Input Bar & Add Button */}
      <View className="flex-row items-center space-x-2.5">
        <View className="flex-1 flex-row items-center bg-white h-[48px] px-4 rounded-2xl shadow-sm border border-gray-100">
          <MaterialCommunityIcons name="magnify" size={20} color="#E07B39" />
          <TextInput
            className="flex-1 ml-3 text-gray-800 font-semibold text-sm"
            placeholder="Tìm danh mục theo tên, mô tả..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color="#D1D5DB"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Create Button (L003) */}
        <TouchableOpacity
          onPress={handleOpenCreate}
          activeOpacity={0.85}
          className="w-[48px] h-[48px] bg-[#E07B39] shadow-sm rounded-2xl items-center justify-center shadow-orange-500/30"
        >
          <MaterialCommunityIcons name="plus" size={26} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-[#FDFCF7]">
      <StatusBar barStyle="dark-content" />

      {/* Header with Search and Stats */}
      {renderHeader()}

      {/* Content List */}
      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#E07B39" />
          <Text className="text-gray-400 font-medium text-xs mt-3">
            Đang tải danh mục thực đơn...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCategories}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: insets.bottom + 40,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <AdminCategoryCard
              category={item}
              onPress={() => handleOpenDetail(item)}
              onEdit={() => handleOpenEdit(item)}
              onDelete={() => handleDelete(item)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#E07B39"
            />
          }
          ListEmptyComponent={
            <View className="mt-16 items-center justify-center px-6">
              <View className="w-20 h-20 rounded-full bg-orange-50 items-center justify-center mb-4">
                <MaterialCommunityIcons
                  name="tag-off-outline"
                  size={42}
                  color="#FDBA74"
                />
              </View>
              <Text className="text-gray-800 text-base font-bold mb-1">
                {search.length > 0
                  ? "Không tìm thấy danh mục phù hợp"
                  : "Chưa có danh mục nào"}
              </Text>
              <Text className="text-gray-400 text-xs text-center mb-6 leading-5">
                {search.length > 0
                  ? `Không có danh mục nào chứa từ khóa "${search}". Hãy thử tìm kiếm với từ khóa khác.`
                  : "Tạo danh mục để phân loại các món ăn trong thực đơn của nhà hàng."}
              </Text>

              {search.length === 0 && (
                <TouchableOpacity
                  onPress={handleOpenCreate}
                  className="bg-[#E07B39] px-5 py-3 rounded-2xl flex-row items-center shadow-sm shadow-orange-500/20"
                >
                  <MaterialCommunityIcons name="plus" size={18} color="white" />
                  <Text className="text-white font-black text-xs ml-1.5">
                    Thêm danh mục mới ngay
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}


      {/* L002 - Modal Xem chi tiết danh mục */}
      <AdminCategoryDetailModal
        visible={detailModalVisible}
        category={selectedCategory}
        onClose={() => setDetailModalVisible(false)}
        onEdit={(cat) => {
          setDetailModalVisible(false);
          handleOpenEdit(cat);
        }}
        onDelete={(cat) => {
          setDetailModalVisible(false);
          handleDelete(cat);
        }}
        fetchDetailFn={getCategoryDetail}
      />

      {/* L003 & L004 - Modal Tạo mới / Chỉnh sửa danh mục */}
      <AdminCategoryFormModal
        visible={formModalVisible}
        categoryToEdit={categoryToEdit}
        onClose={() => setFormModalVisible(false)}
        onSubmit={handleFormSubmit}
      />
    </View>
  );
}
