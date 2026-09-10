import axios from 'axios';
import {
  Product,
  Category,
  Table,
  Package,
  PackageStatus,
  User,
  Promotion,
  PaymentTransaction,
  Conversation,
  ChatMessage,
} from '../types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token =
      localStorage.getItem('accessToken') ||
      localStorage.getItem('token') ||
      localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const apiService = {
  // --- 1. DASHBOARD & STATS (Real Backend) ---
  async getDashboardStats() {
    try {
      const [productsRes, tablesRes, packagesRes, revenueTodayRes, totalPackageTodayRes] =
        await Promise.allSettled([
          this.getProducts(),
          this.getTables(),
          this.getPackages(),
          apiClient.get('/payments/total-amount-today'),
          apiClient.get('/payments/total-package-today'),
        ]);

      const prods = productsRes.status === 'fulfilled' ? productsRes.value : [];
      const tbls = tablesRes.status === 'fulfilled' ? tablesRes.value : [];
      const pkgs = packagesRes.status === 'fulfilled' ? packagesRes.value : [];

      const revenueFromApi =
        revenueTodayRes.status === 'fulfilled' && revenueTodayRes.value?.data
          ? Number(revenueTodayRes.value.data.total || revenueTodayRes.value.data) || 0
          : 0;

      const calculatedRevenue = pkgs
        .filter((p) => p.status === 'COMPLETED' || p.status === 'RECEIVED')
        .reduce((sum, p) => sum + (Number(p.totalPrice) || 0), 0);

      const totalRevenue = revenueFromApi > 0 ? revenueFromApi : calculatedRevenue;

      const activeOrders = pkgs.filter(
        (p) => p.status !== 'COMPLETED' && p.status !== 'CANCELED'
      ).length;

      const occupiedTables = tbls.filter((t) => t.status === 'OCCUPIED').length;

      return {
        revenueToday: totalRevenue,
        orderCountToday: pkgs.length,
        activeOrders,
        occupiedTables,
        totalTables: tbls.length,
        topProducts: prods.slice(0, 4),
        recentPackages: pkgs.slice(0, 5),
      };
    } catch (e) {
      console.error('Error fetching dashboard stats:', e);
      return {
        revenueToday: 0,
        orderCountToday: 0,
        activeOrders: 0,
        occupiedTables: 0,
        totalTables: 0,
        topProducts: [],
        recentPackages: [],
      };
    }
  },

  // --- 2. PRODUCTS (Real Backend: /products) ---
  async getProducts(): Promise<Product[]> {
    try {
      const res = await apiClient.get('/products');
      let rawList: any[] = [];
      if (res.data?.data && Array.isArray(res.data.data)) {
        rawList = res.data.data;
      } else if (Array.isArray(res.data)) {
        rawList = res.data;
      }

      return rawList.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price) || 0,
        description: p.description || '',
        images: p.images || p.image || '',
        categoryId: p.categoryId,
        category: p.category,
        isAvailable: p.isAvailable ?? true,
        preparationTime: p.preparationTime || 15,
        rating: p.rating || 5.0,
        createdAt: p.createdAt,
      }));
    } catch (e) {
      console.error('API Error [getProducts]:', e);
      return [];
    }
  },

  async createProduct(data: Partial<Product>): Promise<Product> {
    const res = await apiClient.post('/products', {
      name: data.name,
      price: Number(data.price),
      categoryId: data.categoryId,
      description: data.description,
      isAvailable: data.isAvailable ?? true,
      preparationTime: data.preparationTime ? Number(data.preparationTime) : 15,
      images: typeof data.images === 'string' ? data.images : JSON.stringify(data.images || []),
    });
    return res.data;
  },

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const res = await apiClient.patch(`/products/${id}`, data);
    return res.data;
  },

  async deleteProduct(id: string): Promise<boolean> {
    await apiClient.delete(`/products/${id}`);
    return true;
  },

  async toggleProductAvailability(id: string, isAvailable: boolean): Promise<Product> {
    const res = await apiClient.patch(`/products/${id}/availability`, { isAvailable });
    return res.data;
  },

  // --- 3. CATEGORIES (Real Backend: /categories) ---
  async getCategories(): Promise<Category[]> {
    try {
      const res = await apiClient.get('/categories');
      let rawList: any[] = [];
      if (Array.isArray(res.data)) {
        rawList = res.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        rawList = res.data.data;
      } else if (res.data?.value && Array.isArray(res.data.value)) {
        rawList = res.data.value;
      }

      return rawList.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        icon: 'UtensilsCrossed',
        itemCount: 0,
      }));
    } catch (e) {
      console.error('API Error [getCategories]:', e);
      return [];
    }
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    const res = await apiClient.post('/categories', data);
    return res.data;
  },

  // --- 4. TABLES (Real Backend: /tables & /admin/tables) ---
  async getTables(): Promise<Table[]> {
    try {
      const res = await apiClient.get('/tables');
      let rawList: any[] = [];
      if (res.data?.data && Array.isArray(res.data.data)) {
        rawList = res.data.data;
      } else if (Array.isArray(res.data)) {
        rawList = res.data;
      }

      return rawList.map((t) => ({
        id: t.id,
        name: t.name,
        number: Number(t.number || t.id),
        capacity: Number(t.capacity) || 4,
        status: t.status || 'AVAILABLE',
        floor: t.location || t.floor || 'Tầng 1',
        location: t.location || 'Tầng 1',
        currentPackageId: t.status === 'OCCUPIED' ? `PKG-${t.id}` : undefined,
      }));
    } catch (e) {
      console.error('API Error [getTables]:', e);
      return [];
    }
  },

  async updateTableStatus(id: string | number, status: Table['status']): Promise<any> {
    const res = await apiClient.patch(`/tables/${id}`, { status });
    return res.data;
  },

  async createTable(data: Partial<Table>): Promise<Table> {
    const res = await apiClient.post('/admin/tables', {
      name: data.name,
      capacity: Number(data.capacity),
      location: data.floor || data.location || 'Tầng 1',
      status: data.status || 'AVAILABLE',
    });
    return res.data;
  },

  async addFoodToTable(tableId: string | number, items: { productId: string; quantity: number }[]) {
    try {
      // Calls create or update order/package for this table
      const res = await apiClient.post('/packages', {
        name: `Bàn ${tableId}`,
        address: `Tại chỗ - Bàn ${tableId}`,
        tableId: String(tableId),
        items,
        status: 'CONFIRMED',
      });
      await this.updateTableStatus(tableId, 'OCCUPIED');
      return res.data;
    } catch (e) {
      console.warn('Fallback table order creation:', e);
      await this.updateTableStatus(tableId, 'OCCUPIED');
      return null;
    }
  },

  // --- 5. PACKAGES & ORDERS (Real Backend: /packages/people & /orders) ---
  async getTableOrders(): Promise<any[]> {
    try {
      const res = await apiClient.get('/orders');
      let rawList: any[] = [];
      if (res.data?.data && Array.isArray(res.data.data)) {
        rawList = res.data.data;
      } else if (Array.isArray(res.data)) {
        rawList = res.data;
      }
      return rawList;
    } catch (e) {
      console.error('API Error [getTableOrders]:', e);
      return [];
    }
  },

  async getPackages(): Promise<Package[]> {
    try {
      const [packagesRes, ordersRes] = await Promise.allSettled([
        apiClient.get('/packages/people'),
        apiClient.get('/orders'),
      ]);

      let packageList: any[] = [];
      if (packagesRes.status === 'fulfilled') {
        const val = packagesRes.value.data;
        if (Array.isArray(val)) packageList = val;
        else if (val?.data && Array.isArray(val.data)) packageList = val.data;
      }

      let orderList: any[] = [];
      if (ordersRes.status === 'fulfilled') {
        const val = ordersRes.value.data;
        if (Array.isArray(val)) orderList = val;
        else if (val?.data && Array.isArray(val.data)) orderList = val.data;
      }

      const formattedPackages: Package[] = packageList.map((pkg) => {
        const dishLines = (pkg.description || '').split('\n').map((l: string) => l.trim()).filter(Boolean);
        const parsedItems = dishLines.map((line: string, idx: number) => {
          const match = line.match(/^(\d+)\s*x\s*(.+)$/i);
          const qty = match ? parseInt(match[1]) || 1 : 1;
          const dishName = match ? match[2].trim() : line;
          return {
            id: `item-${pkg.id}-${idx}`,
            name: dishName,
            quantity: qty,
            price: Math.round(Number(pkg.price) / (dishLines.length || 1)),
            packageId: pkg.id,
            productId: `prod-${idx}`,
          };
        });

        return {
          id: pkg.id,
          tableId: pkg.tableId ? String(pkg.tableId) : undefined,
          tableName: pkg.tableId ? `Bàn ${pkg.tableId}` : 'Giao hàng / Mang đi',
          status: (pkg.status as PackageStatus) || 'CONFIRMED',
          totalPrice: Number(pkg.price || pkg.totalPrice) || 0,
          customerName: pkg.name || pkg.customerName || 'Khách hàng',
          customerPhone: pkg.customerPhone || pkg.phone || '',
          note: pkg.description || (pkg.address ? `Địa chỉ: ${pkg.address}` : ''),
          createdAt: pkg.createdAt || new Date().toISOString(),
          updatedAt: pkg.updatedAt || new Date().toISOString(),
          items: Array.isArray(pkg.items) && pkg.items.length > 0 ? pkg.items : parsedItems,
        };
      });

      const formattedOrders: Package[] = orderList.map((ord) => ({
        id: ord.id,
        tableId: ord.tableId ? String(ord.tableId) : undefined,
        tableName: ord.table?.name || (ord.tableId ? `Bàn ${ord.tableId}` : 'Ăn tại bàn'),
        status: (ord.status as PackageStatus) || 'CONFIRMED',
        totalPrice: Number(ord.totalAmount) || 0,
        customerName: ord.user?.name || (ord.table ? `Khách tại ${ord.table.name}` : 'Khách tại bàn'),
        customerPhone: ord.user?.phone || '',
        note: ord.note || (ord.type === 'DINE_IN' ? 'Ăn tại bàn' : 'Mang về'),
        createdAt: ord.createdAt || new Date().toISOString(),
        updatedAt: ord.updatedAt || new Date().toISOString(),
        items: Array.isArray(ord.items) ? ord.items : [],
      }));

      // Return unified list sorted newest first
      const combined = [...formattedPackages, ...formattedOrders];
      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return combined;
    } catch (e) {
      console.error('API Error [getPackages]:', e);
      return [];
    }
  },

  async updatePackageStatus(id: string, status: PackageStatus): Promise<any> {
    const res = await apiClient.patch(`/packages/${id}`, { status });
    return res.data;
  },

  async addFoodToPackage(packageId: string, items: { productId: string; quantity: number }[]) {
    try {
      const res = await apiClient.post(`/packages/${packageId}/items`, { items });
      return res.data;
    } catch (e) {
      console.error('API Error [addFoodToPackage]:', e);
      return null;
    }
  },

  // --- 6. PROMOTIONS (Real Backend: /admin/promotions) ---
  async getPromotions(): Promise<Promotion[]> {
    try {
      const res = await apiClient.get('/admin/promotions');
      let rawList: any[] = [];
      if (res.data?.data && Array.isArray(res.data.data)) {
        rawList = res.data.data;
      } else if (Array.isArray(res.data)) {
        rawList = res.data;
      }

      return rawList.map((p) => ({
        id: p.id,
        code: p.code || '',
        title: p.name || p.title || 'Ưu đãi',
        discountPercent: p.discount ?? p.discountPercent ?? 10,
        discountAmount: p.discountAmount,
        minOrderAmount: Number(p.minOrder ?? p.minOrderAmount) || 0,
        maxDiscount: p.maxDiscount,
        startDate: p.createdAt ? new Date(p.createdAt).toISOString().split('T')[0] : '',
        endDate: p.until ? new Date(p.until).toISOString().split('T')[0] : (p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : ''),
        isActive: p.isActive ?? true,
        usageLimit: p.usageLimit || 100,
        usageCount: p.usageCount || 0,
      }));
    } catch (e) {
      console.error('API Error [getPromotions]:', e);
      return [];
    }
  },

  async createPromotion(data: Partial<Promotion>): Promise<Promotion> {
    const res = await apiClient.post('/admin/promotions', data);
    return res.data;
  },

  // --- 7. USERS & STAFF (Real Backend: /admin/users) ---
  async getUsers(): Promise<User[]> {
    try {
      let res: any;
      try {
        res = await apiClient.get('/admin/users');
      } catch (err) {
        res = await apiClient.get('/users');
      }

      let rawList: any[] = [];
      if (res.data?.data && Array.isArray(res.data.data)) {
        rawList = res.data.data;
      } else if (Array.isArray(res.data)) {
        rawList = res.data;
      }

      return rawList.map((u) => ({
        id: u.id,
        name: u.name || u.fullName || u.email,
        email: u.email,
        phone: u.phone || '',
        avatar: u.avatar || '',
        role: u.role || 'USER',
        createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '',
      }));
    } catch (e) {
      console.error('API Error [getUsers]:', e);
      return [];
    }
  },

  async updateUserRole(userId: string, role: User['role']): Promise<User> {
    const res = await apiClient.patch(`/admin/users/${userId}`, { role });
    return res.data;
  },

  // --- 8. PAYMENTS (Real Backend: /payments) ---
  async getPayments(limit: number = 200): Promise<PaymentTransaction[]> {
    try {
      const res = await apiClient.get('/payments', { params: { limit } });
      let rawList: any[] = [];
      if (res.data?.data && Array.isArray(res.data.data)) {
        rawList = res.data.data;
      } else if (Array.isArray(res.data)) {
        rawList = res.data;
      }

      return rawList.map((p) => ({
        id: p.id,
        orderId: p.orderId || p.packageId,
        packageId: p.packageId,
        amount: Number(p.amount) || 0,
        method: p.method || p.paymentMethod || 'VIETQR',
        status: p.status || 'SUCCESS',
        customerName: p.customerName || p.user?.name || (p.package?.name) || 'Khách hàng',
        tableName: p.tableName || (p.order?.tableId ? `Bàn ${p.order.tableId}` : (p.package ? 'Đơn giao hàng' : 'Tại bàn')),
        createdAt: p.createdAt || new Date().toISOString(),
      }));
    } catch (e) {
      console.error('API Error [getPayments]:', e);
      return [];
    }
  },

  // --- 9. CHAT & CONVERSATIONS (Real Backend: /chat/conversations) ---
  async getConversations(): Promise<Conversation[]> {
    try {
      const res = await apiClient.get('/chat/conversations');
      let rawList: any[] = [];
      if (Array.isArray(res.data)) {
        rawList = res.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        rawList = res.data.data;
      }

      return rawList.map((c) => ({
        id: c.id,
        userId: c.userId || c.customerId || c.id,
        userName: c.userName || c.user?.name || 'Thực khách',
        userAvatar: c.userAvatar || c.user?.avatar || '',
        lastMessage: c.lastMessage || c.content || '',
        lastMessageAt: c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'Vừa xong',
        unreadCount: Number(c.unreadCount) || 0,
      }));
    } catch (e) {
      console.error('API Error [getConversations]:', e);
      return [];
    }
  },

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    try {
      const res = await apiClient.get(`/chat/messages/${conversationId}`);
      let rawList: any[] = [];
      if (Array.isArray(res.data)) {
        rawList = res.data;
      } else if (res.data?.data && Array.isArray(res.data.data)) {
        rawList = res.data.data;
      }

      return rawList.map((m) => ({
        id: m.id,
        conversationId: m.conversationId || conversationId,
        senderId: m.senderId || m.userId,
        senderName: m.senderName || (m.senderRole === 'ADMIN' ? 'Lễ Tân Quán' : 'Thực khách'),
        senderRole: m.senderRole || (m.isAdmin ? 'ADMIN' : 'USER'),
        message: m.message || m.content || '',
        createdAt: m.createdAt ? new Date(m.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '',
      }));
    } catch (e) {
      console.error('API Error [getMessages]:', e);
      return [];
    }
  },

  async sendMessage(conversationId: string, message: string): Promise<ChatMessage> {
    try {
      const res = await apiClient.post('/chat/messages', { conversationId, message });
      return res.data;
    } catch (e) {
      return {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: 'admin-id',
        senderName: 'Lễ Tân Quán',
        senderRole: 'ADMIN',
        message,
        createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
    }
  },
};

export default apiService;
