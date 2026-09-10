export interface TableOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  isNew?: boolean;
}

export interface ProductItemData {
  id: string;
  name: string;
  price: number;
  image?: string;
  images?: string | string[];
  category?: { name: string };
  isAvailable?: boolean;
}

// Hàm lấy URI ảnh hợp lệ từ product (hỗ trợ cả base64 data URI, JSON array string và URL http)
export function getProductImage(item: any): string | undefined {
  if (!item) return undefined;

  // 1. Kiểm tra trường image (chuỗi đơn)
  if (
    item.image &&
    typeof item.image === "string" &&
    item.image.trim().length > 0
  ) {
    return item.image.trim();
  }

  // 2. Kiểm tra trường images (chuỗi base64 hoặc mảng JSON)
  if (item.images) {
    if (typeof item.images === "string") {
      const trimmed = item.images.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
        } catch (e) {}
      }
      return trimmed;
    } else if (Array.isArray(item.images) && item.images.length > 0) {
      return item.images[0];
    }
  }

  return undefined;
}
