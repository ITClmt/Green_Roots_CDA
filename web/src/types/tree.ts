export interface Tree {
  id: string;
  name: string;
  species: string;
  description: string | null;
  region: string | null;
  co2PerYear: number;
  price: string;
  imageUrl: string | null;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
