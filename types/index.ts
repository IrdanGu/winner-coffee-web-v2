export type RoomType = "karaoke" | "studio-musik";

export type BookingStatus = "menunggu-konfirmasi" | "dikonfirmasi" | "dibatalkan";

export interface RoomInfo {
  id: string;
  name: string;
  type: RoomType;
  description: string;
  minHours: number;
  basePrice: number;
  extraHourPrice: number;
  capacity: string;
  isAssumption: boolean;
  facilities: string[];
}

export type MenuCategoryId = "coffee" | "non-coffee" | "main-course" | "pastry-snacks";

export interface MenuCategory {
  id: MenuCategoryId;
  name: string;
  description: string;
  iconName: string;
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: MenuCategoryId;
  categoryName: string;
  price: number;
  description?: string;
  isAvailable: boolean;
  isPromo?: boolean;
  isFavorite?: boolean;
}

export interface CafeOperatingHours {
  regularDays: string; // e.g. "Senin - Kamis"
  regularHours: string; // e.g. "10.00 - 22.00 WIB"
  regularCloseHour: number; // 22
  weekendDays: string; // e.g. "Jumat - Minggu"
  weekendHours: string; // e.g. "10.00 - 23.00 WIB"
  weekendCloseHour: number; // 23
  openHour: number; // 10
}

export interface CafeInfo {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  whatsAppNumber: string;
  mapsUrl: string;
  hours: CafeOperatingHours;
}

export interface BookingInput {
  roomType: RoomType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:00
  durationHours: number;
  guestCount: number;
  customerName: string;
  customerPhone: string;
  notes?: string;
}

export interface BookingEstimate {
  roomType: RoomType;
  durationHours: number;
  baseHours: number;
  basePrice: number;
  extraHours: number;
  extraHourPrice: number;
  totalEstimate: number;
  isAssumption: boolean;
}

export interface BookingRecord extends BookingInput {
  code: string;
  createdAt: string;
  status: BookingStatus;
  estimate: BookingEstimate;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
