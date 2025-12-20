
import fs from 'fs';

const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

let sql = '';

const escapeStr = (str) => {
    if (str === null || str === undefined) return '';
    return str.toString().replace(/'/g, "''");
};

// BRANDS
if (Array.isArray(db.brands)) {
    sql += `-- Brands\n`;
    db.brands.forEach(b => {
        sql += `INSERT INTO brands (id, name, logo, slug) VALUES (${b.id}, '${escapeStr(b.name)}', '${escapeStr(b.logo)}', '${escapeStr(b.slug)}') ON CONFLICT (id) DO NOTHING;\n`;
    });
    sql += `\n`;
}

// PRODUCTS
if (Array.isArray(db.products)) {
    sql += `-- Products\n`;
    db.products.forEach(p => {
        const badges = p.badges ? `'${JSON.stringify(p.badges)}'` : 'NULL';
        const subCat = p.subCategory ? `'${escapeStr(p.subCategory)}'` : 'NULL';
        const salePrice = p.salePrice ? p.salePrice : 'NULL';

        // Ensure all string fields use escapeStr
        sql += `INSERT INTO products (id, name, brand, price, "salePrice", image, "isNew", "isSale", "isTrending", "isAsicsExclusive", category, "subCategory", gender, badges) VALUES (${p.id}, '${escapeStr(p.name)}', '${escapeStr(p.brand)}', ${p.price || 0}, ${salePrice}, '${escapeStr(p.image)}', ${!!p.isNew}, ${!!p.isSale}, ${!!p.isTrending}, ${!!p.isAsicsExclusive}, '${escapeStr(p.category)}', ${subCat}, '${escapeStr(p.gender)}', ${badges}) ON CONFLICT (id) DO NOTHING;\n`;
    });
    sql += `\n`;
}

// NEWS
if (Array.isArray(db.news)) {
    sql += `-- News\n`;
    db.news.forEach(n => {
        sql += `INSERT INTO news (id, title, excerpt, image, date, content) VALUES (${n.id}, '${escapeStr(n.title)}', '${escapeStr(n.excerpt)}', '${escapeStr(n.image)}', '${escapeStr(n.date)}', '${escapeStr(n.content)}') ON CONFLICT (id) DO NOTHING;\n`;
    });
    sql += `\n`;
}

// Set sequence values
sql += `\n-- Reset Sequences\n`;
if (Array.isArray(db.brands) && db.brands.length) sql += `SELECT setval('brands_id_seq', (SELECT MAX(id) FROM brands));\n`;
if (Array.isArray(db.products) && db.products.length) sql += `SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));\n`;
if (Array.isArray(db.news) && db.news.length) sql += `SELECT setval('news_id_seq', (SELECT MAX(id) FROM news));\n`;
// Orders usually start empty so no reset needed unless data present
if (Array.isArray(db.orders) && db.orders.length) sql += `SELECT setval('orders_id_seq', (SELECT MAX(id) FROM orders));\n`;

fs.writeFileSync('scripts/seed_supabase.sql', sql);
console.log('Generated scripts/seed_supabase.sql type: ' + (typeof sql));
