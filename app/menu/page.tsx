import React from 'react';
import { fetchCategories, fetchMenuItems } from '@/lib/supabase/menu-service';
import MenuClientView from '@/components/menu/MenuClientView';

export const metadata = {
  title: 'Menu - Winner Cafe',
  description: 'Daftar menu kopi, minuman non-kopi, hidangan utama, dan camilan di Winner Cafe.',
};

export const instant = false;

export default async function MenuPage() {
  const [categories, items] = await Promise.all([
    fetchCategories(),
    fetchMenuItems(),
  ]);

  return <MenuClientView initialItems={items} initialCategories={categories} />;
}
