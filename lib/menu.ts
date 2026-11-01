import menuData from "../data/menu.json" with { type: "json" };
import type { MenuCategory, MenuItem } from "../types/index.ts";

export interface FilterOptions {
  categoryId?: string;
  search?: string;
  availableOnly?: boolean;
}

export function getAllMenuItems(): MenuItem[] {
  return menuData.items as MenuItem[];
}

export function getMenuCategories(): MenuCategory[] {
  return menuData.categories as MenuCategory[];
}

export function getFeaturedMenuItems(limit: number = 4): MenuItem[] {
  const items = getAllMenuItems();
  return items.filter((item) => item.isFavorite || item.isPromo).slice(0, limit);
}

export function filterMenuItems(
  items: MenuItem[],
  options: FilterOptions
): MenuItem[] {
  const { categoryId, search, availableOnly } = options;
  const cleanSearch = (search || "").trim().toLowerCase();

  return items.filter((item) => {
    // Filter Category
    if (categoryId && categoryId !== "all" && item.categoryId !== categoryId) {
      return false;
    }

    // Filter Availability
    if (availableOnly && !item.isAvailable) {
      return false;
    }

    // Filter Search Text (Name & Description)
    if (cleanSearch) {
      const matchName = item.name.toLowerCase().includes(cleanSearch);
      const matchDesc = item.description
        ? item.description.toLowerCase().includes(cleanSearch)
        : false;
      if (!matchName && !matchDesc) {
        return false;
      }
    }

    return true;
  });
}
