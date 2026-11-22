import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SECRET_PATH = 'C:/Users/ADVAN/.t3/userdata/secrets/files/5360104286b7713acbf099e5d19452a1';
const PROJECT_REF = 'eagpklfofimiqzwkttjv';

async function run() {
  if (!fs.existsSync(SECRET_PATH)) {
    throw new Error('Secret file not found: ' + SECRET_PATH);
  }
  const token = fs.readFileSync(SECRET_PATH, 'utf8').trim();

  console.log('1. Checking project status...');
  const projRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const proj = await projRes.json();
  console.log(`Project status: ${proj.status}`);

  if (proj.status !== 'ACTIVE_HEALTHY') {
    console.log('Project is still initializing, please retry in 30 seconds.');
    return;
  }

  console.log('2. Applying SQL schema...');
  const sql = fs.readFileSync(path.join(__dirname, '../docs/supabase-schema.sql'), 'utf8');

  const queryRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });

  if (!queryRes.ok) {
    const errText = await queryRes.text();
    console.error('SQL migration failed:', errText);
    return;
  }
  console.log('Schema applied successfully!');

  console.log('3. Seeding categories and menu items from data/menu.json...');
  const menuData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/menu.json'), 'utf8'));

  // Insert categories
  for (let i = 0; i < menuData.categories.length; i++) {
    const c = menuData.categories[i];
    const catSql = `
      insert into public.categories (id, name, description, icon_name, sort_order)
      values ($1, $2, $3, $4, $5)
      on conflict (id) do update set
        name = excluded.name,
        description = excluded.description,
        icon_name = excluded.icon_name,
        sort_order = excluded.sort_order;
    `;
    // We can run via database/query with raw SQL or insert via REST API
  }

  // Let's do batch seed query
  const escapeSql = (str) => (str ? `'${str.replace(/'/g, "''")}'` : 'NULL');

  const catValues = menuData.categories.map((c, idx) => 
    `(${escapeSql(c.id)}, ${escapeSql(c.name)}, ${escapeSql(c.description)}, ${escapeSql(c.iconName || 'Coffee')}, ${idx})`
  ).join(',\n');

  const insertCatsSql = `
    insert into public.categories (id, name, description, icon_name, sort_order)
    values ${catValues}
    on conflict (id) do update set
      name = excluded.name,
      description = excluded.description,
      icon_name = excluded.icon_name,
      sort_order = excluded.sort_order;
  `;

  await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: insertCatsSql })
  });
  console.log(`Seeded ${menuData.categories.length} categories.`);

  // Insert Menu items
  const itemValues = menuData.items.map((item, idx) => {
    return `(
      ${escapeSql(item.id)},
      ${escapeSql(item.name)},
      ${escapeSql(item.categoryId)},
      ${Number(item.price) || 0},
      ${escapeSql(item.description)},
      NULL,
      ${item.isAvailable !== false},
      ${item.isFavorite === true},
      ${item.isPromo === true},
      ${item.isFavorite ? "'Favorit'" : 'NULL'},
      'hot_and_ice',
      ${idx}
    )`;
  }).join(',\n');

  const insertItemsSql = `
    insert into public.menu_items (
      id, name, category_id, price, description, image_url,
      is_available, is_favorite, is_promo, badge, temperature_options, sort_order
    )
    values ${itemValues}
    on conflict (id) do update set
      name = excluded.name,
      category_id = excluded.category_id,
      price = excluded.price,
      description = excluded.description,
      is_available = excluded.is_available,
      is_favorite = excluded.is_favorite,
      is_promo = excluded.is_promo,
      badge = excluded.badge,
      temperature_options = excluded.temperature_options,
      sort_order = excluded.sort_order,
      updated_at = timezone('utc'::text, now());
  `;

  const itemRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: insertItemsSql })
  });

  if (!itemRes.ok) {
    console.error('Menu items seed failed:', await itemRes.text());
  } else {
    console.log(`Seeded ${menuData.items.length} menu items successfully!`);
  }
}

run().catch(console.error);
