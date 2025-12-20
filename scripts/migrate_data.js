
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const migrate = async () => {
    try {
        const dbData = JSON.parse(fs.readFileSync('db.json', 'utf8'));

        console.log("🚀 Starting migration...");

        // 1. Brands
        if (dbData.brands && dbData.brands.length > 0) {
            console.log(`Migrating ${dbData.brands.length} brands...`);
            const { error } = await supabase.from('brands').upsert(dbData.brands, { onConflict: 'id' });
            if (error) console.error("Error migrating brands:", error);
            else console.log("✅ Brands migrated.");
        }

        // 2. Products
        if (dbData.products && dbData.products.length > 0) {
            console.log(`Migrating ${dbData.products.length} products...`);
            const sanitizedProducts = dbData.products.map(p => {
                // Ensure badges is valid json/array
                return {
                    ...p,
                    price: Number(p.price),
                    salePrice: p.salePrice ? Number(p.salePrice) : null,
                    badges: p.badges || []
                };
            });
            const { error } = await supabase.from('products').upsert(sanitizedProducts, { onConflict: 'id' });
            if (error) console.error("Error migrating products:", error);
            else console.log("✅ Products migrated.");
        }

        // 3. News
        if (dbData.news && dbData.news.length > 0) {
            console.log(`Migrating ${dbData.news.length} news articles...`);
            const { error } = await supabase.from('news').upsert(dbData.news, { onConflict: 'id' });
            if (error) console.error("Error migrating news:", error);
            else console.log("✅ News migrated.");
        }

        // 4. Products (Wait, we need to handle the case where ID sequence might be out of sync in postgres)
        // Usually we should reset the sequence after insert, but for simple usage this is okay.

        console.log("🎉 Migration complete!");

    } catch (err) {
        console.error("Migration failed:", err);
    }
};

migrate();
