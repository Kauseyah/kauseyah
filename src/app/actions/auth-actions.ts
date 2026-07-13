"use server";


import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;

async function enforceRateLimit(ip: string) {
  if (ip === 'unknown') return true;

  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Check recent attempts
  const timeLimit = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  
  const { count, error } = await supabaseAdmin
    .from('login_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gt('attempt_time', timeLimit);

  // If table doesn't exist yet, we fail open to not break login before SQL is run
  if (error) return true;

  if (count && count >= MAX_ATTEMPTS) {
    return false; // Blocked
  }
  return true;
}

async function logFailedAttempt(ip: string) {
  if (ip === 'unknown') return;
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  await supabaseAdmin.from('login_attempts').insert({ ip_address: ip });
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || 'unknown';

  const isAllowed = await enforceRateLimit(ip);
  if (!isAllowed) {
    return { error: "Too many failed attempts. Please try again in 15 minutes." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    await logFailedAttempt(ip);
    return { error: error.message };
  }

  return { success: true };
}

export async function register(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'signup',
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Get the newly created user's ID so we can roll back if something fails
  const userId = data?.user?.id;

  // Extract token_hash directly from the response properties
  const tokenHash = data.properties?.hashed_token;
  
  if (!tokenHash) {
    if (userId) await supabaseAdmin.auth.admin.deleteUser(userId);
    return { error: "Failed to generate secure verification token" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const confirmLink = `${siteUrl}/auth/confirm?token_hash=${tokenHash}&type=signup`;

  // Send email via Resend
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error: emailError } = await resend.emails.send({
      from: 'Kauseyah <orders@kauseyah.com>',
      to: email,
      subject: 'Verify your Kauseyah account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #b75d29; text-align: center;">Welcome to Kauseyah!</h2>
          <p style="color: #333; font-size: 16px;">Hi ${name},</p>
          <p style="color: #333; font-size: 16px;">Thank you for joining Kauseyah. Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmLink}" style="background-color: #b75d29; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Verify Email</a>
          </div>
          <p style="color: #777; font-size: 14px; text-align: center;">If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (emailError) {
      if (userId) await supabaseAdmin.auth.admin.deleteUser(userId);
      return { error: `Failed to send email: ${emailError.message}` };
    }

    return { success: true };
  } catch (err: any) {
    if (userId) await supabaseAdmin.auth.admin.deleteUser(userId);
    return { error: err.message || "Failed to send verification email" };
  }
}

export async function verifyOTP(email: string, token: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}

import { Resend } from 'resend';

export async function sendPasswordResetEmail(email: string, redirectPath: string = '/reset-password') {
  if (!email) return { error: "Email is required" };

  try {
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${siteUrl}${redirectPath}`
      }
    });
    
    if (error) return { error: error.message };
    
    const actionLink = data.properties.action_link;
    
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error: resendError } = await resend.emails.send({
      from: 'Kauseyah <admin@kauseyah.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Password Reset</h2>
          <p style="color: #4a4a4a;">You requested a password reset for your Kauseyah account.</p>
          <p style="color: #4a4a4a;">Please click the button below to securely reset your password:</p>
          <div style="margin: 30px 0;">
            <a href="${actionLink}" style="background-color: #FF6B00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #71717a; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (resendError) {
      // // console.error("Resend error:", resendError);
      return { error: resendError.message || "Failed to send email via Resend." };
    }
    
    return { success: true };
  } catch (error: any) {
    // // console.error("Error sending password reset email:", error);
    return { error: error.message || "Failed to send email. Please check email configuration." };
  }
}

export async function resetPassword(password: string) {
  if (!password) return { error: "Password is required" };

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) return { error: error.message };
    
    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to reset password" };
  }
}
