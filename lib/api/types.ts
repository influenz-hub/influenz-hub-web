/** Response shapes returned by influenz-hub-server. */

export type Envelope<T> = { data: T; meta?: { nextCursor?: string | null; total?: number } };

export type Role = "USER" | "BUSINESS" | "ADMIN";
export type TargetType = "PROFILE" | "STORE" | "PRODUCT" | "SERVICE" | "POST";
export type GrowthLevel = "EMERGING" | "GROWING" | "INFLUENTIAL" | "FEATURED";
export type ReportStatus = "OPEN" | "RESOLVED" | "DISMISSED";

export type NotificationType =
  | "LIKE"
  | "COMMENT"
  | "FOLLOW"
  | "REVIEW"
  | "NEW_PRODUCT"
  | "NEW_POST"
  | "VERIFIED"
  | "FEATURED";

export type SessionUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  role: Role;
  createdAt: string;
  profile?: { id: string; slug: string; businessName: string; logo: string | null } | null;
};

export type AuthResult = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: SessionUser;
};

export type Category = { id: string; name: string; slug: string; icon: string | null };

export type CreatorCard = {
  id: string;
  slug: string;
  businessName: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  location: string | null;
  verified: boolean;
  featured: boolean;
  createdAt: string;
  category: Category | null;
  followerCount: number;
  likeCount: number;
  storeCount: number;
  serviceCount: number;
  growthLevel: GrowthLevel;
  viewerIsFollowing?: boolean;
  personalized?: boolean;
};

export type StoreCard = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  images: string[];
  location: string | null;
  createdAt: string;
  category: Category | null;
  profile: { slug: string; businessName: string; verified: boolean; logo: string | null };
  likeCount: number;
  followerCount: number;
  productCount: number;
  viewerHasLiked?: boolean;
};

export type ProductCard = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  images: string[];
  price: string;
  stock: number;
  available: boolean;
  createdAt: string;
  category: Category | null;
  store: { slug: string; name: string; profile: { slug: string; businessName: string } };
  likeCount: number;
  viewerHasLiked?: boolean;
};

export type ServiceCard = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  images: string[];
  priceMin: string | null;
  priceMax: string | null;
  contactMethod: string | null;
  createdAt: string;
  category: Category | null;
  profile: { slug: string; businessName: string; verified: boolean; logo: string | null };
  likeCount: number;
  viewerHasLiked?: boolean;
};

export type Post = {
  id: string;
  text: string;
  images: string[];
  createdAt: string;
  store?: { slug: string; name: string } | null;
  product?: { slug: string; name: string } | null;
  profile?: { slug: string; businessName: string; logo: string | null };
};

export type Rating = { average: number | null; count: number };

export type EngagementUser = { id: string; name: string | null; image: string | null };

export type Comment = {
  id: string;
  text: string;
  createdAt: string;
  user: EngagementUser;
};

export type Review = {
  id: string;
  rating: number;
  text: string | null;
  createdAt: string;
  user: EngagementUser;
};

export type ProfileDetail = CreatorCard & {
  userId: string;
  contactEmail: string | null;
  contactPhone: string | null;
  socialLinks: Record<string, string> | null;
  viewCount: number;
  viewerHasLiked: boolean;
  stores: (StoreCard & { productCount: number })[];
  services: ServiceCard[];
  posts: Post[];
};

export type StoreDetail = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  images: string[];
  location: string | null;
  contactInfo: string | null;
  openingHours: Record<string, string> | null;
  createdAt: string;
  category: Category | null;
  profile: { id: string; slug: string; businessName: string; verified: boolean; logo: string | null };
  products: ProductCard[];
  posts: Post[];
  followerCount: number;
  likeCount: number;
  viewCount: number;
  rating: Rating;
  viewerIsFollowing: boolean;
  viewerHasLiked: boolean;
};

export type ProductDetail = ProductCard & {
  store: ProductCard["store"] & {
    id: string;
    profile: { slug: string; businessName: string; verified: boolean; logo: string | null };
  };
  rating: Rating;
  related: { id: string; slug: string; name: string; images: string[]; price: string; available: boolean }[];
};

export type ServiceDetail = ServiceCard & {
  profile: ServiceCard["profile"] & { id: string };
  rating: Rating;
};

export type HomeFeed = {
  creators: CreatorCard[];
  stores: StoreCard[];
  products: ProductCard[];
};

export type SearchResults = {
  creators: CreatorCard[];
  stores: StoreCard[];
  products: ProductCard[];
  services: ServiceCard[];
};

export type MyProfile = {
  id: string;
  slug: string;
  businessName: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
  location: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  categoryId: string | null;
  verified: boolean;
  featured: boolean;
  category: Category | null;
  followerCount: number;
  likeCount: number;
  growthLevel: GrowthLevel;
  stores: (StoreCard & { _count: { products: number } })[];
  services: ServiceCard[];
};

export type MyStore = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  images: string[];
  location: string | null;
  contactInfo: string | null;
  categoryId: string | null;
  category: Category | null;
  productCount: number;
  likeCount: number;
  followerCount: number;
};

export type MyStats = {
  series: { day: string; views: number; follows: number; likes: number }[];
  totals: { followers: number; likes: number; views: number; products: number };
};

export type Notification = {
  id: string;
  type: NotificationType;
  payload: Record<string, unknown> | null;
  read: boolean;
  createdAt: string;
};

export type AdminOverview = {
  users: number;
  businesses: number;
  stores: number;
  products: number;
  openReports: number;
  unverified: number;
};

export type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  role: Role;
  createdAt: string;
  profile: { slug: string; businessName: string } | null;
};

export type AdminBusiness = {
  id: string;
  slug: string;
  businessName: string;
  verified: boolean;
  featured: boolean;
  createdAt: string;
  category: { name: string } | null;
  user: { email: string | null; name: string | null };
  followerCount: number;
  _count: { stores: number; services: number };
};

export type AdminCategory = Category & { usage: number };

export type Report = {
  id: string;
  targetType: TargetType;
  targetId: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  reporter: { id: string; name: string | null; email: string | null };
};
