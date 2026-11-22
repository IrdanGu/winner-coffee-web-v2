import { createServerSupabaseClient, createAdminClient } from './server';
import menuFallbackData from '../../data/menu.json' with { type: 'json' };
import type { MenuCategory, MenuItem } from '../../types/index';

export async function fetchCategories(): Promise<MenuCategory[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return (menuFallbackData.categories as MenuCategory[]) || [];
    }

    return data.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description || '',
      iconName: c.icon_name || 'Coffee',
      sortOrder: c.sort_order ?? 0,
    }));
  } catch (err) {
    console.warn('Fallback to local categories data:', err);
    return (menuFallbackData.categories as MenuCategory[]) || [];
  }
}

export async function fetchMenuItems(): Promise<MenuItem[]> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from('menu_items')
      .select('*, categories(name)')
      .order('sort_order', { ascending: true });

    if (error || !data || data.length === 0) {
      return (menuFallbackData.items as MenuItem[]) || [];
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      categoryId: item.category_id,
      categoryName: item.categories?.name || item.category_id,
      price: Number(item.price) || 0,
      description: item.description || '',
      imageUrl: item.image_url || null,
      isAvailable: item.is_available ?? true,
      isFavorite: item.is_favorite ?? false,
      isPromo: item.is_promo ?? false,
      badge: item.badge || null,
      temperatureOptions: item.temperature_options || 'hot_and_ice',
      sortOrder: item.sort_order ?? 0,
    }));
  } catch (err) {
    console.warn('Fallback to local menu data:', err);
    return (menuFallbackData.items as MenuItem[]) || [];
  }
}

export async function createMenuItemRecord(item: Omit<MenuItem, 'categoryName'>) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('menu_items')
    .insert({
      id: item.id,
      name: item.name,
      category_id: item.categoryId,
      price: item.price,
      description: item.description || null,
      image_url: item.imageUrl || null,
      is_available: item.isAvailable,
      is_favorite: item.isFavorite || false,
      is_promo: item.isPromo || false,
      badge: item.badge || null,
      temperature_options: item.temperatureOptions || 'hot_and_ice',
      sort_order: item.sortOrder || 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateMenuItemRecord(id: string, updates: Partial<MenuItem>) {
  const supabase = await createServerSupabaseClient();
  const payload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  };

  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.categoryId !== undefined) payload.category_id = updates.categoryId;
  if (updates.price !== undefined) payload.price = updates.price;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.imageUrl !== undefined) payload.image_url = updates.imageUrl;
  if (updates.isAvailable !== undefined) payload.is_available = updates.isAvailable;
  if (updates.isFavorite !== undefined) payload.is_favorite = updates.isFavorite;
  if (updates.isPromo !== undefined) payload.is_promo = updates.isPromo;
  if (updates.badge !== undefined) payload.badge = updates.badge;
  if (updates.temperatureOptions !== undefined) payload.temperature_options = updates.temperatureOptions;
  if (updates.sortOrder !== undefined) payload.sort_order = updates.sortOrder;

  const { data, error } = await supabase
    .from('menu_items')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteMenuItemRecord(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}

export async function toggleItemAvailabilityRecord(id: string, isAvailable: boolean) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from('menu_items')
    .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw new Error(error.message);
  return true;
}

// Category Operations
export async function createCategoryRecord(category: MenuCategory) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('categories')
    .insert({
      id: category.id,
      name: category.name,
      description: category.description || null,
      icon_name: category.iconName || 'Coffee',
      sort_order: category.sortOrder || 0,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateCategoryRecord(id: string, updates: Partial<MenuCategory>) {
  const supabase = await createServerSupabaseClient();
  const payload: Record<string, any> = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.iconName !== undefined) payload.icon_name = updates.iconName;
  if (updates.sortOrder !== undefined) payload.sort_order = updates.sortOrder;

  const { data, error } = await supabase
    .from('categories')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCategoryRecord(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
  return true;
}
