export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string;
  currency: string;
  sku: string;
  category: string;
  stock: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListResponse {
  data: Product[];
  meta: ProductListMeta;
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  currency?: string;
  sku: string;
  category: string;
  stock?: number;
  imageUrl?: string;
}
