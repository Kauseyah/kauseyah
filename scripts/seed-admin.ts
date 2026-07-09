import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

// Load environment variables manually since this is a standalone script
import * as fs from 'fs';
import * as path from 'path';

function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach((line) => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        process.env[match[1].trim()] = match[2].trim();
      }
    });
  } catch (error) {
    console.warn("Could not load .env.local. Make sure you are running this from the project root.");
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // IMPORTANT: Use Service Role Key, NOT Anon Key!

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local");
  process.exit(1);
}

import ws from 'ws';

// Assign the WebSocket polyfill to the global object
if (typeof globalThis.WebSocket === 'undefined') {
  (globalThis as any).WebSocket = ws;
}

// Create a Supabase client with the Service Role Key to bypass RLS and access admin auth API
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function createAdmin() {
  console.log("--- Create Supabase Admin User ---");
  const email = await question("Admin Email: ");
  const password = await question("Admin Password (min 6 chars): ");
  
  rl.close();

  if (password.length < 6) {
    console.error("Password must be at least 6 characters long.");
    return;
  }

  console.log(`\nCreating admin user: ${email}...`);

  const { data, error } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
  });

  if (error) {
    console.error("\nError creating admin user:", error.message);
    return;
  }
  
  if (data?.user) {
    // Insert into profiles table
    const { error: roleError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: data.user.id, 
          email: data.user.email,
          full_name: 'Store Admin',
          role: 'admin' 
        }
      ]);
      
    if (roleError) {
      console.error("\nError setting admin role in profiles table:", roleError.message);
      // Clean up the user since role assignment failed
      await supabase.auth.admin.deleteUser(data.user.id);
      return;
    }

    console.log("\nSuccess! Admin user created securely.");
    console.log("User ID:", data.user.id);
    console.log("\nYou can now log in at /admin/login with these credentials.");
  }
}

createAdmin();
