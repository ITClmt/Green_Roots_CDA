export interface User {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  firstName: string;
  lastName: string;
}

// Type temporaire
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  treesPlanted: number;
}

export interface BadgeData {
  id: string;
  key: string;
  name: string;
  description: string;
  variant: "green" | "brown";
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface OrderData {
  id: string;
  name: string;
  quantity: number;
  createdAt: string;
  location: string;
}
