'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { verifyAdminPin, setAdminSession, clearAdminSession, isAuthenticated } from '@/lib/auth';
import {
  createMenuItemRecord,
  updateMenuItemRecord,
  deleteMenuItemRecord,
  toggleItemAvailabilityRecord,
  createCategoryRecord,
  updateCategoryRecord,
  deleteCategoryRecord,
} from '@/lib/supabase/menu-service';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function loginAdminAction(formData: FormData) {
  const pin = formData.get('pin')?.toString() || '';
  const valid = await verifyAdminPin(pin);

  if (!valid) {
    return { success: false, error: 'PIN yang Anda masukkan salah. Silakan coba lagi.' };
  }

  await setAdminSession(pin);
  return { success: true };
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect('/admin/login');
}

export async function toggleItemAvailabilityAction(id: string, isAvailable: boolean) {
  const authed = await isAuthenticated();
  if (!authed) {
    return { success: false, error: 'Akses ditolak. Silakan login kembali.' };
  }

  try {
    await toggleItemAvailabilityRecord(id, isAvailable);
    revalidatePath('/menu');
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal mengubah ketersediaan menu.' };
  }
}

export async function deleteMenuItemAction(id: string) {
  const authed = await isAuthenticated();
  if (!authed) {
    return { success: false, error: 'Akses ditolak. Silakan login kembali.' };
  }

  try {
    await deleteMenuItemRecord(id);
    revalidatePath('/menu');
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal menghapus menu.' };
  }
}

export async function saveMenuItemAction(formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) {
    return { success: false, error: 'Akses ditolak. Silakan login kembali.' };
  }

  try {
    const isEditing = formData.get('isEditing') === 'true';
    const id = formData.get('id')?.toString()?.trim() || '';
    const name = formData.get('name')?.toString()?.trim() || '';
    const categoryId = formData.get('categoryId')?.toString()?.trim() || '';
    const price = Number(formData.get('price')) || 0;
    const description = formData.get('description')?.toString()?.trim() || '';
    const isAvailable = formData.get('isAvailable') === 'true';
    const isFavorite = formData.get('isFavorite') === 'true';
    const isPromo = formData.get('isPromo') === 'true';
    const badge = formData.get('badge')?.toString()?.trim() || null;
    const temperatureOptions = formData.get('temperatureOptions')?.toString()?.trim() || 'hot_and_ice';
    let imageUrl = formData.get('existingImageUrl')?.toString()?.trim() || null;

    if (!name) return { success: false, error: 'Nama menu wajib diisi.' };
    if (!categoryId) return { success: false, error: 'Kategori wajib dipilih.' };
    if (price <= 0) return { success: false, error: 'Harga harus lebih dari 0.' };

    // Handle Image Upload if provided
    const imageFile = formData.get('imageFile') as File | null;
    if (imageFile && imageFile.size > 0 && typeof imageFile.arrayBuffer === 'function') {
      try {
        const supabase = await createServerSupabaseClient();
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const ext = imageFile.name.split('.').pop() || 'jpg';
        const fileName = `item-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
        const filePath = `menu/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('menu-images')
          .upload(filePath, buffer, {
            contentType: imageFile.type,
            upsert: true,
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('menu-images')
            .getPublicUrl(filePath);
          imageUrl = urlData.publicUrl;
        } else {
          console.warn('Storage upload error, using existing image:', uploadError.message);
        }
      } catch (uploadErr) {
        console.warn('Image upload processing failed:', uploadErr);
      }
    }

    if (isEditing) {
      await updateMenuItemRecord(id, {
        name,
        categoryId,
        price,
        description,
        imageUrl,
        isAvailable,
        isFavorite,
        isPromo,
        badge,
        temperatureOptions,
      });
    } else {
      const generatedId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      await createMenuItemRecord({
        id: generatedId,
        name,
        categoryId,
        price,
        description,
        imageUrl,
        isAvailable,
        isFavorite,
        isPromo,
        badge,
        temperatureOptions,
        sortOrder: 0,
      });
    }

    revalidatePath('/menu');
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal menyimpan menu.' };
  }
}

export async function saveCategoryAction(formData: FormData) {
  const authed = await isAuthenticated();
  if (!authed) {
    return { success: false, error: 'Akses ditolak. Silakan login kembali.' };
  }

  try {
    const isEditing = formData.get('isEditing') === 'true';
    const id = formData.get('id')?.toString()?.trim() || '';
    const name = formData.get('name')?.toString()?.trim() || '';
    const description = formData.get('description')?.toString()?.trim() || '';
    const iconName = formData.get('iconName')?.toString()?.trim() || 'Coffee';
    const sortOrder = Number(formData.get('sortOrder')) || 0;

    if (!name) return { success: false, error: 'Nama kategori wajib diisi.' };

    const catId = id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (isEditing) {
      await updateCategoryRecord(catId, { name, description, iconName, sortOrder });
    } else {
      await createCategoryRecord({ id: catId, name, description, iconName, sortOrder });
    }

    revalidatePath('/menu');
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal menyimpan kategori.' };
  }
}

export async function deleteCategoryAction(id: string) {
  const authed = await isAuthenticated();
  if (!authed) {
    return { success: false, error: 'Akses ditolak. Silakan login kembali.' };
  }

  try {
    await deleteCategoryRecord(id);
    revalidatePath('/menu');
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal menghapus kategori.' };
  }
}
