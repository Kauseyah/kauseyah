import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError && profileError.code !== 'PGRST116') {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  // If profile exists but is missing some fields, fallback to auth user details
  const result = profile ? {
    ...profile,
    email: profile.email || user.email, // Fallback to auth email if profile email is null
    full_name: profile.full_name || user.user_metadata?.full_name || '',
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
    console.error("Auth error in PUT /api/profile:", userError);
    return NextResponse.json({ error: userError?.message || "Unauthorized - Please log in again" }, { status: 401 });
  }

  const body = await request.json();
  const { full_name, phone } = body;

  // Update profiles table
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ 
      id: user.id, 
      full_name, 
      phone,
      email: user.email, // Ensure email is synced
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update user metadata in auth.users (wrapped in try/catch to prevent SSR crashes)
  try {
    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name }
    });
    if (updateError) {
      console.warn("Could not sync auth metadata:", updateError.message);
    }
  } catch (e: any) {
    console.warn("Caught updateUser exception:", e.message);
  }

  return NextResponse.json(data);
}
