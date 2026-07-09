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

async function syncProfiles() {
  console.log('Fetching all auth users...');
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error('Error fetching auth users:', authError);
    return;
  }

  console.log(`Found ${users.length} users. Syncing to profiles table...`);

  for (const user of users) {
    const fullName = user.user_metadata?.full_name || user.raw_user_meta_data?.full_name || null;
    
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: fullName,
      }, { onConflict: 'id' });

    if (upsertError) {
      console.error(`Error syncing user ${user.email}:`, upsertError);
    } else {
      console.log(`Successfully synced user ${user.email}`);
    }
  }

  console.log('Sync complete!');
}

syncProfiles();
