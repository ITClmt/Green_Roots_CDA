export interface Tree {
  id: string;
  name: string;
  species: string;
  description: string | null;
  location: string | null;
  co2: number;
  oxygen: number;
  price: number;
  imageUrl: string | null;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTrees {
  data: Tree[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export type TreePayload = {
  name: string;
  species: string;
  description?: string;
  location?: string;
  co2?: number;
  oxygen?: number;
  price: number;
  imageUrl?: string;
  stock?: number;
};

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
