'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { Category, Product } from '../../types';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  categories: Category[];
  onSave: (productData: Partial<Product>) => Promise<void>;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  categories,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [prepTime, setPrepTime] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setCategoryId(product.categoryId || (categories[0]?.id ?? ''));
      setDescription(product.description || '');
      setImageUrl(
        typeof product.images === 'string'
          ? product.images
          : Array.isArray(product.images)
          ? product.images[0]
          : ''
      );
      setIsAvailable(product.isAvailable ?? true);
      setPrepTime(product.preparationTime || 15);
    } else {
      setName('');
      setPrice(100000);
      setCategoryId(categories[0]?.id || '');
      setDescription('');
      setImageUrl('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80');
      setIsAvailable(true);
      setPrepTime(15);
    }
  }, [product, categories, isOpen]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSave({
        name,
        price: Number(price),
        categoryId,
        description,
        images: imageUrl,
        isAvailable,
        preparationTime: Number(prepTime),
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Ăn Mới'}
      subtitle="Cập nhật hình ảnh, giá bán và trạng thái món trong thực đơn"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Tên món ăn *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="VD: Bò Wagyu A5 sốt tiêu đen..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Danh mục món *</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Giá bán (VNĐ) *</label>
            <input
              type="number"
              min="0"
              step="1000"
              required
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-bold text-[#E07B39] focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Thời gian nấu (phút)</label>
            <input
              type="number"
              min="1"
              max="120"
              value={prepTime}
              onChange={(e) => setPrepTime(parseInt(e.target.value) || 15)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
            />
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="isAvailable"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="w-4 h-4 text-[#E07B39] rounded border-slate-300 focus:ring-[#E07B39]"
            />
            <label htmlFor="isAvailable" className="text-xs font-bold text-slate-700 cursor-pointer">
              Đang có sẵn / Phục vụ
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Ảnh món ăn (URL hoặc Tải lên)</label>
          <div className="flex items-start gap-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Preview"
                className="w-20 h-20 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0 bg-slate-100"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}

            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Dán đường dẫn ảnh URL..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
              />
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors shadow-sm">
                <UploadCloud className="w-4 h-4 text-[#E07B39]" />
                <span>Chọn ảnh từ máy tính</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả món ăn</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mô tả nguyên liệu, hương vị đặc sắc..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]"
          />
        </div>

        <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-[#E07B39] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20 disabled:opacity-50"
          >
            {product ? 'Lưu thay đổi' : 'Tạo món ăn'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
