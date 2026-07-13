import { createClient } from "@/utils/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use admin to bypass any RLS on GET as well if needed, but standard client is fine.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id) // Also fix this from id to user_id just in case
    .maybeSingle();

  if (profileError && profileError.code !== 'PGRST116') {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // If profile exists but is missing some fields, fallback to auth user details
  const result = profile ? {
    ...profile,
    email: user.email, // Use auth email directly
    full_name: profile.full_name || user.user_metadata?.full_name || '',
    phone: profile.phone || user.phone || ''
  } : { 
    id: user.id, 
    email: user.email, 
    full_name: user.user_metadata?.full_name || '',
    phone: user.phone || ''
  };

  return NextResponse.json(result);
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  let { data: { user }, error: userError } = await supabase.auth.getUser();

  // Fallback to session if getUser fails due to Next.js cookie parsing quirks
  if (!user) {
    const { data: sessionData } = await supabase.auth.getSession();
    user = sessionData.session?.user || null;
  }

  if (!user) {
    // console.error("Auth error in PUT /api/profile:", userError);
    return NextResponse.json({ error: userError?.message || "Unauthorized - Please log in again" }, { status: 401 });
  }

  const body = await request.json();
  const { full_name, phone } = body;

  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle();

  let data, error;

  if (existingProfile) {
    // Update existing profile
    const result = await supabase
      .from('profiles')
      .update({ 
        full_name, 
        phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingProfile.id)
      .select()
      .single();
    data = result.data;
    error = result.error;
  } else {
    // Insert new profile
    const result = await supabase
      .from('profiles')
      .insert({ 
        user_id: user.id,
        full_name, 
        phone,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    data = result.data;
    error = result.error;
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update user metadata in auth.users (wrapped in try/catch to prevent SSR crashes)
  try {
    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name }
    });
    if (updateError) {
      // console.warn("Could not sync auth metadata:", updateError.message);
    }
  } catch (e: any) {
    // console.warn("Caught updateUser exception:", e.message);
  }

  return NextResponse.json(data);
}
