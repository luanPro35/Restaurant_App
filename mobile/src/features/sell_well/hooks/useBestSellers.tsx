import { useState, useCallback, useEffect } from "react";
import productApi from "../../../services/api/apiProducts";

export interface BestSellerItem {
  id: string;
  name: string;
  price: string;
  rawPrice: number;
  image: string;
  description: string;
  soldCount: number;
  rating: number;
  rank: number;
}

export const useBestSellers = () => {
  const [items, setItems] = useState<BestSellerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBestSellers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productApi.getAll({ limit: 50 });
      const allProducts = Array.isArray(response) ? response : response.data || [];
      
      if (!allProducts || allProducts.length === 0) {
        setItems([]);
        return;
      }

      let products = allProducts;
      
      const randomizedProducts = [...products]
        .sort(() => 0.5 - Math.random())
        .slice(0, 20);

      const formattedItems = randomizedProducts.map((p: any, index: number) => {
        let imageUrl = "https://via.placeholder.com/400x300/E07B39/ffffff?text=" + encodeURIComponent(p.name);
        try {
          if (p.images) {
            const images = JSON.parse(p.images);
            if (Array.isArray(images) && images.length > 0) {
              imageUrl = images[0];
            } else if (typeof images === 'string') {
                imageUrl = images;
            }
          }
        } catch (e) {
            if (p.images && typeof p.images === 'string') {
                imageUrl = p.images;
            }
        }

        return {
          id: p.id,
          name: p.name,
          price: (p.price || 0).toLocaleString("vi-VN") + "đ",
          rawPrice: p.price || 0,
          image: imageUrl,
          description: p.description || "",
          soldCount: Math.floor(Math.random() * 500) + 100,
          rating: 4 + Math.random() * 1,
          rank: index + 1,
        } as BestSellerItem;
      });

      setItems(formattedItems);
    } catch (err: any) {
      console.error("Fetch best sellers error:", err);
      setError("Không thể tải danh sách món ăn bán chạy");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBestSellers();
  }, [fetchBestSellers]);

  return { items, loading, error, refresh: fetchBestSellers };
};
