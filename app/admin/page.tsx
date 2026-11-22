import React from 'react';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { fetchCategories, fetchMenuItems } from '@/lib/supabase/menu-service';
import DashboardClient from '@/components/admin/DashboardClient';

export const instant = false;

export default async function AdminDashboardPage() {
  await connection();
  const authed = await isAuthenticated();
  if (!authed) {
    redirect('/admin/login');
  }

  const [categories, items] = await Promise.all([
    fetchCategories(),
    fetchMenuItems(),
  ]);

  return <DashboardClient initialCategories={categories} initialItems={items} />;
}
