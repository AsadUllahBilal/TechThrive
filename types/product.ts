export type CategoryType = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
};

export type UserType = {
  name: string;
  email: string;
  profilePicture: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  category?: CategoryType;
  brand: string;
  stock: number;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
  createdAt?: string;
  updatedAt?: string;
};

export type Review = {
  _id: string;
  user?: UserType;
  rating: number;
  comment: string;
  createdAt?: string;
  product?: Product;
};
