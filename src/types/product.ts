export interface CreateProductDTO {
  name: string;
  model: string;
  description: string;
  notes: string;
  normalPrice: number;
  discount?: number;
  caseMaterial: string;
  braceletMaterial: string;
  strapMaterial: string;
  caseSize: number;
  cristal: string;
  movement: string;
  waterResistance: string;
  stock: number;
}

export interface ProductoCardDTO {
  name: string;
  slug: string;
  notes: string;
  model: string;
  normalPrice: number;
  discountPrice: number;
  images: SingleImageDTO[];
}

export interface SingleImageDTO {
  url: string;
  alt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  model: string;
  description: string;
  notes: string;
  normalPrice: number;
  discount: number;
  discountPrice: number;
  caseMaterial: string;
  braceletMaterial: string;
  strapMaterial: string;
  caseSize: number;
  cristal: string;
  movement: string;
  waterResistance: string;
  stock: number;
  isDeleted: boolean;
  images: Image[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Image {
  id: string;
  url: string;
  productId: string;
  path: string;
}
