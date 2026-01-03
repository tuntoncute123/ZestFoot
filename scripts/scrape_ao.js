
import axios from 'axios';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
    process.exit(1);
}

console.log(`Supabase URL: ${SUPABASE_URL}`);
console.log(`Using Key starting with: ${SUPABASE_KEY ? SUPABASE_KEY.substring(0, 10) : 'undefined'}...`);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const TARGET_URL = 'https://abc-mart.com.vn/collections/ao?page=1';

async function downloadImage(url) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'arraybuffer'
        });
        return {
            buffer: response.data,
            contentType: response.headers['content-type']
        };
    } catch (error) {
        console.error(`Failed to download image: ${url}`, error.message);
        return null;
    }
}

async function uploadToSupabase(filename, buffer, contentType, originalUrl) {
    const filePath = `scraped/${Date.now()}_${filename}`;
    const { data, error } = await supabase
        .storage
        .from('products')
        .upload(filePath, buffer, {
            contentType: contentType,
            upsert: true
        });

    if (error) {
        console.warn(` > Upload Failed (RLS?): ${error.message}. Using original URL.`);
        return originalUrl;
    }

    const { data: publicData } = supabase.storage.from('products').getPublicUrl(filePath);
    return publicData.publicUrl;
}

function detectBrand(name) {
    const n = name.toUpperCase();
    if (n.includes('NIKE')) return 'NIKE';
    if (n.includes('ADIDAS')) return 'ADIDAS';
    if (n.includes('PUMA')) return 'PUMA';
    if (n.includes('VANS')) return 'VANS';
    if (n.includes('CONVERSE')) return 'CONVERSE';
    if (n.includes('FILA')) return 'FILA';
    if (n.includes('ASICS')) return 'ASICS';
    if (n.includes('NEW BALANCE')) return 'NEW BALANCE';
    if (n.includes('LACOSTE')) return 'LACOSTE';
    if (n.includes('CHAMPION')) return 'CHAMPION';
    if (n.includes('ABC SELECT')) return 'ABC SELECT';
    if (n.includes('LEVI')) return "LEVI'S";
    return 'OTHER';
}

async function scrape() {
    console.log(`Starting scrape of ${TARGET_URL}...`);
    try {
        const { data } = await axios.get(TARGET_URL);
        const $ = cheerio.load(data);
        const productsToInsert = [];

        const items = $('li.grid__item');
        console.log(`Found ${items.length} items.`);

        for (let i = 0; i < items.length; i++) {
            const el = items[i];
            const name = $(el).find('.full-unstyled-link').text().trim();
            let imgUrl = $(el).find('.media img').attr('src') || $(el).find('img').attr('src');

            if (imgUrl && imgUrl.startsWith('//')) {
                imgUrl = 'https:' + imgUrl;
            }

            let priceText = $(el).find('.price-item--regular').first().text().trim();
            const salePriceEl = $(el).find('.price-item--sale');
            const regularPriceEl = $(el).find('.price-item--regular');

            const parsePrice = (str) => {
                if (!str) return 0;
                return parseInt(str.replace(/[đ,.\s]/g, ''));
            };

            let price = 0;
            let salePrice = null;

            if (salePriceEl.length > 0) {
                const saleVal = parsePrice(salePriceEl.text());
                const regularVal = parsePrice(regularPriceEl.last().text()) || parsePrice(regularPriceEl.text());
                price = regularVal;
                salePrice = saleVal;
            } else {
                price = parsePrice(regularPriceEl.text());
                salePrice = null;
            }

            let gender = 'unisex';
            if (name.toUpperCase().includes('NAM')) gender = 'men';
            if (name.toUpperCase().includes('NỮ') || name.toUpperCase().includes('WOMEN')) gender = 'women';

            let category = 'apparel'; // default for this collection
            let subCategory = 'shirt'; // mostly shirts in "Ao" collection

            // Refine category/subcategory if needed
            if (name.toUpperCase().includes('KHOÁC') || name.toUpperCase().includes('JACKET')) subCategory = 'jacket';
            if (name.toUpperCase().includes('HOODIE')) subCategory = 'hoodie';

            const brand = detectBrand(name);

            if (name && imgUrl) {
                console.log(`Processing [${i + 1}/${items.length}]: ${name}`);

                const imgData = await downloadImage(imgUrl);
                let finalImgUrl = imgUrl;

                if (imgData) {
                    let filename = path.basename(imgUrl.split('?')[0]);
                    if (!filename || filename.length < 3) filename = `image_${i}.jpg`;

                    finalImgUrl = await uploadToSupabase(filename, imgData.buffer, imgData.contentType, imgUrl);
                }

                productsToInsert.push({
                    name: name,
                    brand: brand,
                    price: price,
                    salePrice: salePrice,
                    image: finalImgUrl,
                    isNew: false,
                    isSale: !!salePrice,
                    category: category,
                    subCategory: subCategory,
                    gender: gender,
                    isAsicsExclusive: false,
                    isTrending: false
                });
            }
        }

        if (productsToInsert.length > 0) {
            console.log(`Inserting ${productsToInsert.length} products to DB...`);
            const { data, error } = await supabase
                .from('products')
                .insert(productsToInsert);

            if (error) {
                console.error("DB Insert Error:", error);
            } else {
                console.log("Success! Data inserted.");
            }
        } else {
            console.log("No products prepared for insertion.");
        }

    } catch (error) {
        console.error("Scrape failed:", error);
    }
}

scrape();
