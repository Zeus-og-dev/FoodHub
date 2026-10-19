export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  description: string;
  cuisine: string;
  imageUrl: string | null;
  rating: string | number;
  deliveryTimeMinutes: number;
  deliveryFeePaise: number;
  isOpen: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}