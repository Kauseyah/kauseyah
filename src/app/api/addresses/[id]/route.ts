import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    full_name: full_name,
    phone: phone_number,
    line1: address_line_1,
    line2: address_line_2 || null,
    pincode: postal_code,
    type: type, // We will add the type column to DB
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('user_addresses')
    .update(dbPayload)
    .eq('id', id)
    .eq('user_id', user.id) // Ensure they only update their own
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from('user_addresses')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
