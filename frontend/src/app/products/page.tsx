'use client';

import React, { useEffect, useState } from 'react';
import { Product, Category, getProductImage } from '../../types';
import apiService from '../../services/api';
import { Badge } from '../../components/common/Badge';
import { ProductModal } from './ProductModal';
import { Search, Plus, UtensilsCrossed, Edit2, Trash2, CheckCircle2, XCircle, RefreshCw, Star, Clock } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProductsData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsData();
  }, []);

  const handleToggleAvailability = async (product: Product) => {
    await apiService.toggleProductAvailability(product.id, !product.isAvailable);
    fetchProductsData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa món này khỏi thực đơn?')) {
      await apiService.deleteProduct(id);
      fetchProductsData();
    }
  };

  const handleSaveProduct = async (data: Partial<Product>) => {
    if (editingProduct) {
      await apiService.updateProduct(editingProduct.id, data);
    } else {
      await apiService.createProduct(data);
    }
    fetchProductsData();
  };

  const formatVND = (num: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);

  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'ALL' || prod.categoryId === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <UtensilsCrossed className="w-7 h-7 text-[#E07B39]" />
            Thực Đơn & Món Ăn
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Đồng bộ dữ liệu thời gian thực từ cơ sở dữ liệu ({products.length} món ăn).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-[#E07B39] hover:bg-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm món mới</span>
          </button>
          <button
            onClick={fetchProductsData}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#E07B39]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên món ăn..."
            className="w-full bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#E07B39] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((prod) => {
          const imgUrl = getProductImage(prod);
          const categoryName =
            (typeof prod.category === 'object' && prod.category?.name) ||
            categories.find((c) => c.id === prod.categoryId)?.name ||
            'Món ăn';

          return (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Product Image Cover */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-semibold text-[10px]">
                      {categoryName}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge status={prod.isAvailable} type="boolean" />
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-slate-800 line-clamp-1">{prod.name}</h3>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {prod.description || 'Hương vị thơm ngon tinh tế chuẩn phong cách nhà hàng.'}
                  </p>

                  <div className="flex items-center gap-3 pt-2 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {prod.preparationTime || 15} phút
                    </span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {prod.rating || 5.0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 pt-0 border-t border-slate-50 flex items-center justify-between mt-3">
                <span className="text-lg font-black text-[#E07B39]">{formatVND(prod.price)}</span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleAvailability(prod)}
                    title={prod.isAvailable ? 'Đổi sang Tạm hết món' : 'Đổi sang Còn món'}
                    className={`p-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      prod.isAvailable
                        ? 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                        : 'border-slate-200 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {prod.isAvailable ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        categories={categories}
        onSave={handleSaveProduct}
      />
    </div>
  );
}
