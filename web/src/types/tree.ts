export interface Tree {
  id: string;
  name: string;
  species: string;
  description: string | null;
  location: string | null;
  co2: number;
  oxygen: number;
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
