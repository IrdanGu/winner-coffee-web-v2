import test from "node:test";
import assert from "node:assert/strict";
import { filterMenuItems, getMenuCategories } from "../lib/menu.ts";
import type { MenuItem } from "../types/index.ts";

const sampleItems: MenuItem[] = [
  {
    id: "americano",
    name: "Americano",
    categoryId: "coffee",
    categoryName: "Coffee",
    price: 23000,
    description: "Kopi hitam segar",
    isAvailable: true,
  },
  {
    id: "latte",
    name: "Cafe Latte",
    categoryId: "coffee",
    categoryName: "Coffee",
    price: 24000,
    description: "Espresso dengan susu gurih",
    isAvailable: true,
  },
  {
    id: "lychee-tea",
    name: "Lychee Tea",
    categoryId: "non-coffee",
    categoryName: "Non-Coffee & Tea",
    price: 20000,
    description: "Teh buah leci manis dingin",
    isAvailable: true,
  },
  {
    id: "ayam-penyet",
    name: "Ayam Penyet Cabe Hijau",
    categoryId: "main-course",
    categoryName: "Main Course",
    price: 27000,
    description: "Ayam penyet pedas nikmat",
    isAvailable: false,
  },
];

test("filterMenuItems: mengembalikan semua item jika kategori 'all' dan tanpa search", () => {
  const result = filterMenuItems(sampleItems, { categoryId: "all" });
  assert.equal(result.length, 4);
});

test("filterMenuItems: memfilter berdasarkan kategori tertentu", () => {
  const result = filterMenuItems(sampleItems, { categoryId: "coffee" });
  assert.equal(result.length, 2);
  assert.ok(result.every((item) => item.categoryId === "coffee"));
});

test("filterMenuItems: mencari berdasarkan nama atau deskripsi secara case-insensitive", () => {
  const resultByName = filterMenuItems(sampleItems, { search: "latte" });
  assert.equal(resultByName.length, 1);
  assert.equal(resultByName[0].name, "Cafe Latte");

  const resultByDesc = filterMenuItems(sampleItems, { search: "pedas" });
  assert.equal(resultByDesc.length, 1);
  assert.equal(resultByDesc[0].id, "ayam-penyet");
});

test("filterMenuItems: menangani empty state ketika pencarian tidak ditemukan", () => {
  const result = filterMenuItems(sampleItems, { search: "pizza-tidak-ada" });
  assert.equal(result.length, 0);
});

test("getMenuCategories: mengembalikan 4 kategori utama", () => {
  const categories = getMenuCategories();
  assert.equal(categories.length, 4);
  assert.ok(categories.some((c) => c.id === "coffee"));
  assert.ok(categories.some((c) => c.id === "non-coffee"));
  assert.ok(categories.some((c) => c.id === "main-course"));
  assert.ok(categories.some((c) => c.id === "pastry-snacks"));
});
