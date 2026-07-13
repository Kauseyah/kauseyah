import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: addresses, error } = await supabase
    .from('user_addresses')
    .select('*')
    .eq('user_id', user.id)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map DB schema to frontend schema
  const mappedAddresses = (addresses || []).map(addr => ({
    ...addr,
    full_name: addr.name || addr.full_name,
    phone_number: addr.phone || addr.phone_number,
    address_line_1: addr.line1 || addr.address || addr.address_line_1,
    address_line_2: addr.line2 || addr.address_line_2 || '',
    postal_code: addr.pincode || addr.postal_code,
  }));

  return NextResponse.json(mappedAddresses);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  
  if (body.is_default) {
    // Unset other defaults
    await supabase
      .from('user_addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
      .eq('is_default', true);
  }

  // Map frontend schema to DB schema
  const { full_name, phone_number, address_line_1, address_line_2, postal_code, type, ...rest } = body;
  const dbPayload = {
    ...rest,
    user_id: user.id,
    full_name: full_name, // DB uses full_name
    phone: phone_number, // DB uses phone
    line1: address_line_1, // DB uses line1
    line2: address_line_2 || null, // DB uses line2
    pincode: postal_code, // DB uses pincode
    type: type // We will add the type column to DB
  };

  const { data, error } = await supabase
    .from('user_addresses')
    .insert(dbPayload)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map back to frontend just in case
  const responseData = {
    ...data,
    full_name: data.full_name,
    phone_number: data.phone,
    address_line_1: data.line1,
    address_line_2: data.line2,
    postal_code: data.pincode
  };

  return NextResponse.json(responseData);
}
