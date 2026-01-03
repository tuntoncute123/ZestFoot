
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

console.log('--- Config Check ---');
console.log('URL:', SUPABASE_URL);
console.log('Anon Key:', SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.substring(0, 10) + '...' : 'MISSING');
console.log('Service Key:', SUPABASE_SERVICE_KEY ? SUPABASE_SERVICE_KEY.substring(0, 10) + '...' : 'MISSING');

async function checkConnection(keyName, key) {
    if (!key) {
        console.log(`[${keyName}] Skipping: No key provided`);
        return;
    }
    console.log(`\n[${keyName}] Testing connection...`);
    const client = createClient(SUPABASE_URL, key, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    // Test Read
    const { data, error } = await client.from('products').select('count', { count: 'exact', head: true });
    if (error) {
        console.error(`[${keyName}] Read Failed:`, error.message);
    } else {
        console.log(`[${keyName}] Read Success. Count:`, data ? 'N/A' : 'OK (Head request)');
    }

    // Test Write (Dummy Insert)
    // Only test write if it's the Service Key to avoid filling DB or checking Anon RLS if we know it fails
    if (keyName === 'ServiceKey') {
        const dummy = { name: 'Test', price: 0, brand: 'TEST' };
        // We assume 'products' table exists. logic: try insert, then intentionally don't commit or just see error
        // Actually RLS error happens immediately.
        // We'll try to insert a row that might fail constraints but pass RLS, or just standard insert.
        // We won't actually insert to pollute, just check permissions?
        // No, 'insert' is the only way to check RLS for insert.
        // We will try to insert a clearly invalid row (empty) to trigger constraint error instead of RLS error?
        // Or just normal insert and delete.
        // Let's just try to insert one row.
        const { error: writeError } = await client.from('products').insert({
            name: '_DEBUG_TEST_',
            price: 100,
            brand: '_DEBUG_',
            category: 'shoes',
            gender: 'men',
            image: 'https://via.placeholder.com/150'
        });

        if (writeError) {
            console.error(`[${keyName}] Write Failed:`, writeError);
        } else {
            console.log(`[${keyName}] Write Success!`);
            // cleanup
            await client.from('products').delete().eq('name', '_DEBUG_TEST_');
        }
    }
}

async function run() {
    await checkConnection('AnonKey', SUPABASE_ANON_KEY);
    await checkConnection('ServiceKey', SUPABASE_SERVICE_KEY);
}

run();
