'use client';

import React, { useState, useTransition, useMemo } from 'react';
import type { MenuCategory, MenuItem } from '@/types/index';
import {
  Coffee,
  Plus,
  Search,
  Edit2,
  Trash2,
  ImageIcon,
  CheckCircle2,
  XCircle,
  Sparkles,
  Layers,
  Thermometer,
  X,
  Check,
  AlertTriangle,
  Tag,
  ArrowUpRight,
} from 'lucide-react';
import {
  toggleItemAvailabilityAction,
  deleteMenuItemAction,
  saveMenuItemAction,
  saveCategoryAction,
  deleteCategoryAction,
} from '@/app/admin/actions';

interface DashboardClientProps {
  initialCategories: MenuCategory[];
  initialItems: MenuItem[];
}

export default function DashboardClient({
  initialCategories,
  initialItems,
}: DashboardClientProps) {
  const [categories, setCategories] = useState<MenuCategory[]>(initialCategories);
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'soldout'>('all');

  const [isPending, startTransition] = useTransition();

  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // Menu Modal State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [menuFormError, setMenuFormError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formPrice, setFormPrice] = useState<number>(25000);
  const [isFormDirty, setIsFormDirty] = useState(false);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryFormError, setCategoryFormError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);

  // Delete Confirm Modal State
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<MenuItem | null>(null);

  // Quick stats
  const stats = useMemo(() => {
    const total = items.length;
    const available = items.filter((i) => i.isAvailable).length;
    const soldOut = total - available;
    const favorites = items.filter((i) => i.isFavorite).length;
    return { total, available, soldOut, favorites };
  }, [items]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }
      // Availability filter
      if (availabilityFilter === 'available' && !item.isAvailable) return false;
      if (availabilityFilter === 'soldout' && item.isAvailable) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q) || false;
        const matchBadge = item.badge?.toLowerCase().includes(q) || false;
        return matchName || matchDesc || matchBadge;
      }
      return true;
    });
  }, [items, selectedCategory, availabilityFilter, searchQuery]);

  // Quick 1-tap availability toggle
  const handleToggleAvailability = (item: MenuItem) => {
    const nextStatus = !item.isAvailable;

    // Haptic feedback for touchscreen tablets & phones
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(35);
    }

    // Optimistic state update for instant UI feedback
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, isAvailable: nextStatus } : i))
    );

    // Non-blocking toast confirmation
    showToast(
      `${item.name} berhasil ditandai ${nextStatus ? 'READY' : 'HABIS'}.`,
      nextStatus ? 'success' : 'info'
    );

    startTransition(async () => {
      const res = await toggleItemAvailabilityAction(item.id, nextStatus);
      if (!res.success) {
        // Rollback if failed
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, isAvailable: item.isAvailable } : i))
        );
        showToast(res.error || 'Gagal mengubah status ketersediaan.', 'error');
      }
    });
  };

  // Open Create Menu Modal
  const handleOpenCreateMenu = () => {
    setEditingItem(null);
    setImagePreview(null);
    setMenuFormError(null);
    setFormPrice(25000);
    setIsFormDirty(false);
    setIsMenuModalOpen(true);
  };

  // Open Edit Menu Modal
  const handleOpenEditMenu = (item: MenuItem) => {
    setEditingItem(item);
    setImagePreview(item.imageUrl || null);
    setMenuFormError(null);
    setFormPrice(item.price);
    setIsFormDirty(false);
    setIsMenuModalOpen(true);
  };

  const handleCloseMenuModal = () => {
    if (isFormDirty) {
      if (!confirm('Ada perubahan yang belum disimpan. Yakin ingin menutup form?')) {
        return;
      }
    }
    setIsMenuModalOpen(false);
    setIsFormDirty(false);
  };

  // Submit Menu Form (Create / Edit)
  const handleSaveMenu = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMenuFormError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await saveMenuItemAction(formData);
      if (!res.success) {
        setMenuFormError(res.error || 'Gagal menyimpan menu.');
        return;
      }

      const isEditing = formData.get('isEditing') === 'true';
      const id = formData.get('id')?.toString() || '';
      const name = formData.get('name')?.toString() || '';
      const categoryId = formData.get('categoryId')?.toString() || '';
      const price = Number(formData.get('price')) || 0;
      const description = formData.get('description')?.toString() || '';
      const isAvailable = formData.get('isAvailable') === 'true';
      const isFavorite = formData.get('isFavorite') === 'true';
      const isPromo = formData.get('isPromo') === 'true';
      const badge = formData.get('badge')?.toString() || null;
      const temperatureOptions = formData.get('temperatureOptions')?.toString() || 'hot_and_ice';
      const categoryName = categories.find((c) => c.id === categoryId)?.name || categoryId;

      if (isEditing && editingItem) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === editingItem.id
              ? {
                  ...i,
                  name,
                  categoryId,
                  categoryName,
                  price,
                  description,
                  isAvailable,
                  isFavorite,
                  isPromo,
                  badge,
                  temperatureOptions,
                  imageUrl: imagePreview || i.imageUrl,
                }
              : i
          )
        );
      } else {
        const generatedId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newItem: MenuItem = {
          id: generatedId,
          name,
          categoryId,
          categoryName,
          price,
          description,
          imageUrl: imagePreview,
          isAvailable,
          isFavorite,
          isPromo,
          badge,
          temperatureOptions,
          sortOrder: 0,
        };
        setItems((prev) => [newItem, ...prev]);
      }

      setIsMenuModalOpen(false);
    });
  };

  // Delete Menu Item
  const handleConfirmDelete = () => {
    if (!deleteConfirmItem) return;
    const targetId = deleteConfirmItem.id;

    setItems((prev) => prev.filter((i) => i.id !== targetId));
    setDeleteConfirmItem(null);

    startTransition(async () => {
      const res = await deleteMenuItemAction(targetId);
      if (!res.success) {
        alert(res.error || 'Gagal menghapus menu.');
      }
    });
  };

  // Submit Category Form
  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCategoryFormError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await saveCategoryAction(formData);
      if (!res.success) {
        setCategoryFormError(res.error || 'Gagal menyimpan kategori.');
        return;
      }

      const isEditing = formData.get('isEditing') === 'true';
      const id = formData.get('id')?.toString() || '';
      const name = formData.get('name')?.toString() || '';
      const description = formData.get('description')?.toString() || '';
      const iconName = formData.get('iconName')?.toString() || 'Coffee';
      const sortOrder = Number(formData.get('sortOrder')) || 0;

      if (isEditing && editingCategory) {
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id
              ? { ...c, name, description, iconName, sortOrder }
              : c
          )
        );
      } else {
        const catId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        setCategories((prev) => [...prev, { id: catId, name, description, iconName, sortOrder }]);
      }

      setEditingCategory(null);
      form.reset();
    });
  };

  // Delete Category
  const handleDeleteCategory = (catId: string) => {
    if (!confirm('Hapus kategori ini? Seluruh menu dalam kategori ini juga akan terhapus!')) {
      return;
    }

    setCategories((prev) => prev.filter((c) => c.id !== catId));
    setItems((prev) => prev.filter((i) => i.categoryId !== catId));

    startTransition(async () => {
      const res = await deleteCategoryAction(catId);
      if (!res.success) {
        alert(res.error || 'Gagal menghapus kategori.');
      }
    });
  };

  // Handle local image file preview
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-7">
      
      {/* 1. Page Title & Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#262626] pb-6">
        <div>
          <p className="text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#108474]">
            Operations & Control
          </p>
          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-medium tracking-tight text-[#F9F4EE]">
            Menu management.
          </h1>
          <p className="mt-1.5 text-xs text-[#8E867C] max-w-lg leading-relaxed">
            Atur ketersediaan menu bar, penyesuaian harga satuan, serta pembaruan katalog yang langsung tersinkron ke halaman publik.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#D9D2C7] hover:text-[#F9F4EE] border border-[#333333] hover:border-[#F9F4EE] bg-[#161616] transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#108474]" />
            <span>Kategori</span>
          </button>

          <button
            onClick={handleOpenCreateMenu}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-sans font-medium uppercase tracking-[0.14em] bg-[#108474] hover:bg-[#0E6E60] text-white border border-[#108474] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Menu</span>
          </button>
        </div>
      </div>

      {/* 2. Architectural Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Menu */}
        <div className="p-5 bg-[#171717] border border-[#282828] relative">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.18em] text-[#8E867C]">Total Item</p>
          <p className="font-serif text-3xl font-medium text-[#F9F4EE] mt-2">{stats.total}</p>
          <span className="text-[10px] font-sans text-[#665F55] mt-1 block">Tercatat di Supabase</span>
        </div>

        {/* Ready Stock */}
        <div className="p-5 bg-[#171717] border border-[#282828] relative">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.18em] text-[#108474]">Stok Ready</p>
          <p className="font-serif text-3xl font-medium text-[#108474] mt-2">{stats.available}</p>
          <span className="text-[10px] font-sans text-[#665F55] mt-1 block">Tampil aktif di menu</span>
        </div>

        {/* Sold Out */}
        <div className="p-5 bg-[#171717] border border-[#282828] relative">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.18em] text-rose-400">Stok Habis</p>
          <p className="font-serif text-3xl font-medium text-rose-400 mt-2">{stats.soldOut}</p>
          <span className="text-[10px] font-sans text-[#665F55] mt-1 block">Ditandai dicoret/habis</span>
        </div>

        {/* Recommended */}
        <div className="p-5 bg-[#171717] border border-[#282828] relative">
          <p className="text-[10px] font-sans font-medium uppercase tracking-[0.18em] text-[#D9D2C7]">Favorit Pelanggan</p>
          <p className="font-serif text-3xl font-medium text-[#D9D2C7] mt-2">{stats.favorites}</p>
          <span className="text-[10px] font-sans text-[#665F55] mt-1 block">Highlight di beranda</span>
        </div>
      </div>

      {/* 3. Search Bar & Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#161616] p-3 border border-[#282828]">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#665F55]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari item, racikan, atau badge..."
            className="w-full pl-10 pr-8 py-2 bg-[#0E0E0E] border border-[#2E2E2E] text-xs font-sans text-[#F9F4EE] placeholder-[#555555] focus:outline-none focus:border-[#108474] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7E766D] hover:text-[#F9F4EE]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Availability Status Filter */}
        <div className="flex items-center gap-1 bg-[#0E0E0E] p-1 border border-[#282828]">
          <button
            onClick={() => setAvailabilityFilter('all')}
            className={`px-3 py-1 text-[11px] font-sans font-medium uppercase tracking-[0.14em] transition-colors cursor-pointer ${
              availabilityFilter === 'all'
                ? 'bg-[#222222] text-[#F9F4EE] font-medium'
                : 'text-[#7E766D] hover:text-[#D9D2C7]'
            }`}
          >
            Semua ({items.length})
          </button>
          <button
            onClick={() => setAvailabilityFilter('available')}
            className={`px-3 py-1 text-[11px] font-sans font-medium uppercase tracking-[0.14em] transition-colors cursor-pointer ${
              availabilityFilter === 'available'
                ? 'bg-[#108474]/20 text-[#108474] font-medium border border-[#108474]/30'
                : 'text-[#7E766D] hover:text-[#108474]'
            }`}
          >
            Ready ({stats.available})
          </button>
          <button
            onClick={() => setAvailabilityFilter('soldout')}
            className={`px-3 py-1 text-[11px] font-sans font-medium uppercase tracking-[0.14em] transition-colors cursor-pointer ${
              availabilityFilter === 'soldout'
                ? 'bg-rose-950/40 text-rose-300 font-medium border border-rose-900/60'
                : 'text-[#7E766D] hover:text-rose-400'
            }`}
          >
            Habis ({stats.soldOut})
          </button>
        </div>
      </div>

      {/* 4. Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-[#222222]">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 text-xs font-sans font-medium uppercase tracking-[0.14em] whitespace-nowrap transition-colors border cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-[#F9F4EE] text-[#111111] font-semibold border-[#F9F4EE]'
              : 'border-[#262626] bg-[#141414] text-[#8E867C] hover:text-[#F9F4EE] hover:border-[#3E3E3E]'
          }`}
        >
          Semua Kategori ({items.length})
        </button>
        {categories.map((cat) => {
          const count = items.filter((i) => i.categoryId === cat.id).length;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-sans font-medium uppercase tracking-[0.14em] whitespace-nowrap transition-colors border cursor-pointer ${
                isSelected
                  ? 'bg-[#F9F4EE] text-[#111111] font-semibold border-[#F9F4EE]'
                  : 'border-[#262626] bg-[#141414] text-[#8E867C] hover:text-[#F9F4EE] hover:border-[#3E3E3E]'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* 5. Main Table (Desktop / Tablet) & Card List (Mobile) */}
      <div className="bg-[#171717] border border-[#282828] shadow-2xl overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 px-4">
            <Coffee className="w-10 h-10 text-[#444444] mx-auto mb-3" />
            <h3 className="font-serif text-lg text-[#D9D2C7]">Tidak ada menu ditemukan</h3>
            <p className="text-xs font-sans text-[#665F55] mt-1 uppercase tracking-wider">
              Silakan periksa filter atau kata kunci pencarian Anda
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-[#D9D2C7]">
                <thead className="bg-[#121212] text-[10px] font-sans font-medium uppercase tracking-[0.16em] text-[#8E867C] border-b border-[#262626]">
                  <tr>
                    <th className="py-3.5 px-5">Menu</th>
                    <th className="py-3.5 px-4">Kategori</th>
                    <th className="py-3.5 px-4">Harga</th>
                    <th className="py-3.5 px-4">Spesifikasi</th>
                    <th className="py-3.5 px-4 text-center">Status Stok (1-Tap)</th>
                    <th className="py-3.5 px-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222]">
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className={`hover:bg-[#1C1C1C] transition-colors ${
                        !item.isAvailable ? 'bg-[#0D0D0D]/60 opacity-60' : ''
                      }`}
                    >
                      {/* Name & Photo */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 bg-[#0D0D0D] border border-[#2E2E2E] overflow-hidden shrink-0 flex items-center justify-center text-[#555555]">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Coffee className="w-5 h-5 text-[#444444]" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-[#F9F4EE] flex items-center gap-2">
                              <span>{item.name}</span>
                              {item.isFavorite && (
                                <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.14em] px-1.5 py-0.5 border border-[#108474]/50 text-[#108474] bg-[#108474]/10">
                                  ★ Favorit
                                </span>
                              )}
                              {item.isPromo && (
                                <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.14em] px-1.5 py-0.5 border border-rose-800/50 text-rose-400 bg-rose-950/20">
                                  Promo
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-xs text-[#8E867C] line-clamp-1 max-w-sm mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-sans font-medium text-[#A0988E] uppercase tracking-[0.14em]">
                          {categories.find((c) => c.id === item.categoryId)?.name || item.categoryId}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-sans font-medium tabular-nums text-[#F9F4EE]">
                        Rp {item.price.toLocaleString('id-ID')}
                      </td>

                      {/* Specification & Badges */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          {item.badge && (
                            <span className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] px-2 py-0.5 border border-[#3E3E3E] text-[#D9D2C7] bg-[#1E1E1E]">
                              {item.badge}
                            </span>
                          )}
                          {item.temperatureOptions && (
                            <span className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] text-[#7E766D] flex items-center gap-1">
                              <Thermometer className="w-3 h-3 text-[#555555]" />
                              {item.temperatureOptions === 'hot_and_ice'
                                ? 'Hot/Ice'
                                : item.temperatureOptions === 'hot_only'
                                ? 'Hot'
                                : 'Ice'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 1-Tap Availability Switch */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(item)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-sans font-medium uppercase tracking-[0.14em] border transition-all cursor-pointer ${
                            item.isAvailable
                              ? 'bg-[#108474]/15 border-[#108474]/60 text-[#108474] hover:bg-[#108474]/30'
                              : 'bg-rose-950/30 border-rose-900/60 text-rose-400 hover:bg-rose-950/60'
                          }`}
                          title="Klik untuk ubah ketersediaan di kasir"
                        >
                          {item.isAvailable ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#108474]" />
                              <span>Ready</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              <span>Habis</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditMenu(item)}
                            className="p-1.5 text-[#8E867C] hover:text-[#F9F4EE] hover:bg-[#252525] border border-transparent hover:border-[#333333] transition-colors cursor-pointer"
                            title="Edit Item"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmItem(item)}
                            className="p-1.5 text-[#8E867C] hover:text-rose-400 hover:bg-[#252525] border border-transparent hover:border-rose-900/40 transition-colors cursor-pointer"
                            title="Hapus Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Touch-Friendly Card List View */}
            <div className="block md:hidden divide-y divide-[#222222]">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 space-y-3.5 transition-colors ${
                    !item.isAvailable ? 'bg-[#0D0D0D]/60 opacity-65' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-[#0D0D0D] border border-[#2E2E2E] overflow-hidden shrink-0 flex items-center justify-center text-[#555555]">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Coffee className="w-6 h-6 text-[#444444]" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-[#F9F4EE] text-base flex items-center gap-2 flex-wrap">
                          <span>{item.name}</span>
                          {item.isFavorite && (
                            <span className="text-[9px] font-sans font-semibold uppercase tracking-[0.14em] px-1.5 py-0.5 border border-[#108474]/50 text-[#108474] bg-[#108474]/10">
                              ★ Favorit
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-sans font-medium text-[#8E867C] uppercase tracking-[0.14em] mt-0.5">
                          {categories.find((c) => c.id === item.categoryId)?.name || item.categoryId}
                        </p>
                        <p className="text-sm font-sans font-medium tabular-nums text-[#F9F4EE] mt-1">
                          Rp {item.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditMenu(item)}
                        className="p-2 text-[#8E867C] hover:text-[#F9F4EE] bg-[#202020] border border-[#2E2E2E]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmItem(item)}
                        className="p-2 text-[#8E867C] hover:text-rose-400 bg-[#202020] border border-[#2E2E2E]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {item.description && (
                    <p className="text-xs text-[#8E867C] line-clamp-2">{item.description}</p>
                  )}

                  {/* 1-Tap Large Touch Toggle for Mobile */}
                  <button
                    type="button"
                    onClick={() => handleToggleAvailability(item)}
                    className={`w-full py-2.5 px-4 text-xs font-sans font-medium uppercase tracking-[0.16em] flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                      item.isAvailable
                        ? 'bg-[#108474]/15 border-[#108474]/60 text-[#108474]'
                        : 'bg-rose-950/30 border-rose-900/60 text-rose-300'
                    }`}
                  >
                    {item.isAvailable ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#108474]" />
                        <span>Status: Ready (Ketuk jika habis)</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Status: Habis (Ketuk jika ready)</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 6. Modal Tambah / Edit Menu */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl bg-[#171717] border border-[#2E2E2E] p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#262626] mb-6">
              <h3 className="font-serif text-2xl font-medium tracking-tight text-[#F9F4EE] flex items-center gap-2.5">
                <Coffee className="w-5 h-5 text-[#108474]" />
                <span>{editingItem ? 'Edit spesifikasi menu.' : 'Tambah menu baru.'}</span>
              </h3>
              <button
                onClick={handleCloseMenuModal}
                className="p-1 text-[#8E867C] hover:text-[#F9F4EE] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {menuFormError && (
              <div className="mb-5 p-3.5 bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs font-sans flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{menuFormError}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                setIsFormDirty(false);
                handleSaveMenu(e);
              }}
              onChange={() => setIsFormDirty(true)}
              className="space-y-5"
            >
              <input type="hidden" name="isEditing" value={editingItem ? 'true' : 'false'} />
              <input type="hidden" name="id" value={editingItem?.id || ''} />
              <input type="hidden" name="existingImageUrl" value={editingItem?.imageUrl || ''} />

              {/* Name */}
              <div>
                <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#D9D2C7] mb-2">
                  Nama Menu *
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingItem?.name || ''}
                  required
                  placeholder="Contoh: Flat White Double Shot"
                  className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#333333] text-[#F9F4EE] text-sm focus:outline-none focus:border-[#108474]"
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#D9D2C7] mb-2">
                    Kategori *
                  </label>
                  <select
                    name="categoryId"
                    defaultValue={editingItem?.categoryId || categories[0]?.id || ''}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#333333] text-[#F9F4EE] text-sm font-sans focus:outline-none focus:border-[#108474]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-[#171717] text-[#F9F4EE]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#D9D2C7] mb-2">
                    Harga Satuan (Rp) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="500"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value) || 0)}
                    required
                    className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#333333] text-[#F9F4EE] text-sm font-sans focus:outline-none focus:border-[#108474]"
                  />
                  <p className="text-[10px] font-sans font-medium tabular-nums text-[#108474] mt-1.5 uppercase tracking-wider">
                    Terbaca: Rp {formPrice.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#D9D2C7] mb-2">
                  Deskripsi Menu (Opsional)
                </label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingItem?.description || ''}
                  placeholder="Komposisi bahan, aroma, atau catatan penyajian..."
                  className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-[#333333] text-[#F9F4EE] text-sm focus:outline-none focus:border-[#108474]"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#D9D2C7] mb-2">
                  Foto Produk (Supabase Object Storage)
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#0D0D0D] border border-[#333333] flex items-center justify-center overflow-hidden shrink-0 text-[#555555]">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-[#444444]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      name="imageFile"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleImageFileChange}
                      className="text-xs text-[#8E867C] font-sans file:mr-3 file:py-1.5 file:px-3 file:border file:border-[#3E3E3E] file:text-[11px] file:font-sans file:uppercase file:tracking-[0.14em] file:bg-[#202020] file:text-[#D9D2C7] hover:file:border-[#108474] file:cursor-pointer"
                    />
                    <p className="text-[10px] font-sans text-[#665F55] mt-1.5 uppercase">
                      Maksimum 5MB (JPG, PNG, WebP)
                    </p>
                  </div>
                </div>
              </div>

              {/* Badge & Temperature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#D9D2C7] mb-2">
                    Badge Khusus
                  </label>
                  <input
                    type="text"
                    name="badge"
                    defaultValue={editingItem?.badge || ''}
                    placeholder="Signature / Best Seller"
                    className="w-full px-3.5 py-2 bg-[#0D0D0D] border border-[#333333] text-[#F9F4EE] text-xs font-sans focus:outline-none focus:border-[#108474]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#D9D2C7] mb-2">
                    Opsi Suhu
                  </label>
                  <select
                    name="temperatureOptions"
                    defaultValue={editingItem?.temperatureOptions || 'hot_and_ice'}
                    className="w-full px-3.5 py-2 bg-[#0D0D0D] border border-[#333333] text-[#F9F4EE] text-xs font-sans focus:outline-none focus:border-[#108474]"
                  >
                    <option value="hot_and_ice" className="bg-[#171717]">Hot & Ice</option>
                    <option value="hot_only" className="bg-[#171717]">Hanya Hot</option>
                    <option value="ice_only" className="bg-[#171717]">Hanya Ice</option>
                  </select>
                </div>
              </div>

              {/* Checkbox Toggles */}
              <div className="pt-3 border-t border-[#262626] grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2.5 p-2.5 bg-[#121212] border border-[#2A2A2A] cursor-pointer">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    value="true"
                    defaultChecked={editingItem ? editingItem.isAvailable : true}
                    className="accent-[#108474] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-[#D9D2C7]">Stok Tersedia</span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 bg-[#121212] border border-[#2A2A2A] cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFavorite"
                    value="true"
                    defaultChecked={editingItem?.isFavorite || false}
                    className="accent-[#108474] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-[#D9D2C7]">Menu Favorit</span>
                </label>

                <label className="flex items-center gap-2.5 p-2.5 bg-[#121212] border border-[#2A2A2A] cursor-pointer">
                  <input
                    type="checkbox"
                    name="isPromo"
                    value="true"
                    defaultChecked={editingItem?.isPromo || false}
                    className="accent-[#108474] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-[#D9D2C7]">Sedang Promo</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={handleCloseMenuModal}
                  className="px-4 py-2 text-xs font-sans font-medium uppercase tracking-[0.14em] text-[#8E867C] hover:text-[#F9F4EE] border border-[#333333] hover:border-[#666666] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 text-xs font-sans font-medium uppercase tracking-[0.16em] bg-[#108474] hover:bg-[#0E6E60] text-white border border-[#108474] flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isPending ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{editingItem ? 'Simpan Perubahan' : 'Buat Item Menu'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Modal Kelola Kategori Dinamis */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg bg-[#171717] border border-[#2E2E2E] p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3.5 border-b border-[#262626] mb-5">
              <h3 className="font-serif text-2xl font-medium tracking-tight text-[#F9F4EE] flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-[#108474]" />
                <span>Kelola kategori.</span>
              </h3>
              <button
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCategory(null);
                }}
                className="p-1 text-[#8E867C] hover:text-[#F9F4EE] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List Existing Categories */}
            <div className="space-y-2 mb-6 max-h-56 overflow-y-auto pr-1">
              {categories.map((c) => {
                const count = items.filter((i) => i.categoryId === c.id).length;
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3.5 bg-[#121212] border border-[#262626]"
                  >
                    <div>
                      <div className="font-medium text-[#F9F4EE] flex items-center gap-2 text-sm">
                        <span>{c.name}</span>
                        <span className="text-[10px] font-sans tabular-nums px-1.5 py-0.5 border border-[#333333] text-[#8E867C]">
                          {count} item
                        </span>
                      </div>
                      {c.description && (
                        <p className="text-xs text-[#7E766D] mt-0.5">{c.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingCategory(c)}
                        className="p-1.5 text-[#8E867C] hover:text-[#F9F4EE] hover:bg-[#202020] border border-transparent hover:border-[#333333] cursor-pointer"
                        title="Edit Kategori"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(c.id)}
                        className="p-1.5 text-[#8E867C] hover:text-rose-400 hover:bg-[#202020] border border-transparent hover:border-rose-900/40 cursor-pointer"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add / Edit Category Form */}
            <div className="pt-5 border-t border-[#262626]">
              <h4 className="text-[11px] font-sans font-medium uppercase tracking-[0.16em] text-[#108474] mb-3">
                {editingCategory ? `Edit: ${editingCategory.name}` : '+ Tambah Kategori Baru'}
              </h4>

              {categoryFormError && (
                <div className="mb-3.5 p-3 bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs font-sans">
                  {categoryFormError}
                </div>
              )}

              <form onSubmit={handleSaveCategory} className="space-y-3.5">
                <input type="hidden" name="isEditing" value={editingCategory ? 'true' : 'false'} />
                <input type="hidden" name="id" value={editingCategory?.id || ''} />

                <div>
                  <input
                    type="text"
                    name="name"
                    required
                    defaultValue={editingCategory?.name || ''}
                    placeholder="Nama Kategori (misal: Mocktail & Refresher)"
                    className="w-full px-3 py-2 bg-[#0D0D0D] border border-[#333333] text-[#F9F4EE] text-xs font-sans focus:outline-none focus:border-[#108474]"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    name="description"
                    defaultValue={editingCategory?.description || ''}
                    placeholder="Deskripsi kategori..."
                    className="w-full px-3 py-2 bg-[#0D0D0D] border border-[#333333] text-[#F9F4EE] text-xs focus:outline-none focus:border-[#108474]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  {editingCategory && (
                    <button
                      type="button"
                      onClick={() => setEditingCategory(null)}
                      className="px-3 py-1.5 text-xs font-sans uppercase tracking-wider text-[#8E867C] hover:text-[#F9F4EE] border border-[#333333] cursor-pointer"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={isPending}
                    className="px-4 py-1.5 text-xs font-sans font-medium uppercase tracking-[0.14em] bg-[#108474] hover:bg-[#0E6E60] text-white border border-[#108474] cursor-pointer"
                  >
                    {editingCategory ? 'Perbarui Kategori' : 'Simpan Kategori'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 8. Modal Konfirmasi Hapus Menu */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#171717] border border-[#2E2E2E] p-6 text-center">
            <div className="w-10 h-10 border border-rose-900/60 bg-rose-950/40 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium text-[#F9F4EE]">Hapus item ini?</h3>
            <p className="text-xs text-[#8E867C] mt-2 leading-relaxed">
              Item <span className="font-medium text-[#F9F4EE]">"{deleteConfirmItem.name}"</span> akan dihapus permanen dari Supabase dan katalog menu kafe.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 text-xs font-sans uppercase tracking-wider text-[#8E867C] hover:text-[#F9F4EE] border border-[#333333] bg-[#1E1E1E] cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-sans uppercase tracking-wider bg-rose-800 hover:bg-rose-700 text-white border border-rose-700 cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. Floating Non-Blocking Toast Notification */}
      {toast && (
        <aside
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#161616] border shadow-2xl transition-all font-sans text-xs max-w-sm ${
            toast.type === 'error'
              ? 'border-rose-900/80 text-rose-300'
              : toast.type === 'info'
              ? 'border-amber-800/60 text-amber-200'
              : 'border-[#108474]/80 text-[#F9F4EE]'
          }`}
        >
          <div
            className={`w-2 h-2 shrink-0 ${
              toast.type === 'error'
                ? 'bg-rose-500'
                : toast.type === 'info'
                ? 'bg-amber-400'
                : 'bg-[#108474]'
            }`}
          />
          <span className="leading-snug">{toast.message}</span>
        </aside>
      )}
    </div>
  );
}
