// 基本型定義
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ユーザー関連型
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
}

export enum UserRole {
  ADMIN = 'admin',
  STORE_OWNER = 'store_owner'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}

// 店舗関連型
export interface Store extends BaseEntity {
  name: string;
  description?: string;
  ownerId: string;
  status: StoreStatus;
  address: Address;
  businessHours: BusinessHours[];
  contactInfo: ContactInfo;
}

export enum StoreStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_APPROVAL = 'pending_approval'
}

export interface Address {
  prefecture: string;
  city: string;
  street: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface BusinessHours {
  dayOfWeek: number; // 0=日曜 1=月曜...
  openTime: string;  // "09:00"
  closeTime: string; // "18:00"
  isClosed: boolean;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
}

// API関連型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}