// Run with:  npm run storage:init
// (which is `node --env-file=.env.local create-bucket.js`)
//
// Previously this called require('dotenv'), which is not a dependency
// of this project — the script crashed on line 1 from a clean install.
// Node's built-in --env-file replaces it with no package needed.
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase credentials. Expected NEXT_PUBLIC_SUPABASE_URL and " +
    "SUPABASE_SERVICE_ROLE_KEY — run via `npm run storage:init` so " +
    ".env.local is loaded."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createBucket() {
  console.log("Checking buckets...");
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error("Error listing buckets:", listError);
    return;
  }
  
  const exists = buckets.find(b => b.name === 'product-downloads');
  if (exists) {
    console.log("Bucket 'product-downloads' already exists.");
  } else {
    console.log("Creating bucket 'product-downloads'...");
    const { data, error } = await supabase.storage.createBucket('product-downloads', {
      public: false, // Ensure it's private as required by lib/storage.ts
      fileSizeLimit: 104857600 // 100MB
    });
    
    if (error) {
      console.error("Failed to create bucket:", error.message);
    } else {
      console.log("Bucket created successfully:", data);
    }
  }
}

createBucket();
