// src/lib/types.ts
export interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string; 
  featured?: boolean;
  popular?: boolean;
  rating?: number; 
  category?: string;
  description?: string;
}

export interface CategoryProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  rating?: number;
  category?: string;
  stock?: number;
}


// src/lib/types.ts (optional, or just in InstagramFeed.tsx)
export interface InstagramPost {
  id: string;
  image: string;
}

export interface ParentCategory {
  id: string;
  title: string;
  slug: string;
  price: number;
  image: string;
  hoverImage: string;  // ✅ FIXED MISSING PROPERTY
  discount?: number;
  featured?: boolean;


}
export interface ShopItem {
  id: string;
  title: string;
  price: number;
  discount?: number;
  category: string;
  image: string;
  featured?: boolean;


}

