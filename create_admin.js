const { createClient } = require('@supabase/supabase-js');
global.WebSocket = require('ws');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  const email = 'admin@kauseyah.com';
  const password = 'KauseyahAdmin2026!';

  console.log('Creating user...');
  const { data: user, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: 'Admin User' }
  });

  if (error) {
    if (error.message.includes('already exists')) {
        console.log('User already exists, updating password...');
        // Find user by email (not directly supported, we can just delete and recreate if we had list users, but we'll assume they deleted it)
    }
    console.error('Error creating user:', error);
    return;
  }

  console.log('User created:', user.user.id);

  console.log('Assigning admin role...');
  const { error: roleError } = await supabase
    .from('user_roles')
    .upsert([
      { user_id: user.user.id, role: 'admin' }
    ], { onConflict: 'user_id' });

  if (roleError) {
    console.error('Error assigning role:', roleError);
  } else {
    console.log('Admin role assigned successfully!');
  }
}

createAdmin();
