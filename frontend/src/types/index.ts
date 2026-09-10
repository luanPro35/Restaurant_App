export type PackageStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COOKING'
  | 'DELIVERING'
  | 'RECEIVED'
  | 'COMPLETED'
  | 'CANCELED';

export type TableStatus = 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';

export type Role = 'ADMIN' | 'STAFF' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  icon?: string;
  itemCount?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  images?: string | string[];
  image?: string;
  categoryId?: string;
  category?: Category | { name: string };
  isAvailable: boolean;
  isBestSeller?: boolean;
  preparationTime?: number;
  rating?: number;
  createdAt?: string;
}

export interface PackageItem {
  id: string;
  packageId?: string;
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  note?: string;
}

export interface Package {
  id: string;
  tableId?: string;
  tableName?: string;
  status: PackageStatus;
  totalPrice: number;
  items: PackageItem[];
  customerName?: string;
  customerPhone?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Table {
  id: string | number;
  name: string;
  number?: number;
  capacity: number;
  status: TableStatus;
  floor?: string | number;
  location?: string;
  currentPackageId?: string;
  currentPackage?: Package;
  packages?: Package[];
  activeOrderCount?: number;
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  discountPercent?: number;
  discountAmount?: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount?: number;
}

export interface PaymentTransaction {
  id: string;
  orderId?: string;
  packageId?: string;
  amount: number;
  method: 'CASH' | 'VIETQR' | 'CREDIT_CARD' | 'MOMO';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  customerName?: string;
  tableName?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  message: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

// Utility function to extract real image from URL, Base64, or JSON Array
export function getProductImage(item: any): string {
  const fallback =
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80';
  if (!item) return fallback;

  // 1. Direct string passed (Base64 data URI, HTTP URL, JSON array string)
  if (typeof item === 'string') {
    const trimmed = item.trim();
    if (!trimmed) return fallback;

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
          return parsed[0].trim() || fallback;
        }
      } catch (e) {}
    }
    return trimmed;
  }

  // 2. Direct array passed
  if (Array.isArray(item) && item.length > 0) {
    return getProductImage(item[0]);
  }

  // 3. Object with image property
  if (item.image && typeof item.image === 'string' && item.image.trim().length > 0) {
    return getProductImage(item.image);
  }

  // 4. Object with images property
  if (item.images) {
    return getProductImage(item.images);
  }

  // 5. Nested product object (e.g. order item)
  if (item.product) {
    return getProductImage(item.product);
  }

  return fallback;
}
