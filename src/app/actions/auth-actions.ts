"use server";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
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

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
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

  return { success: true };
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

import nodemailer from 'nodemailer';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function sendPasswordResetEmail(email: string) {
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
        redirectTo: `${siteUrl}/admin/reset-password`
      }
    });
    
    if (error) return { error: error.message };
    
    const actionLink = data.properties.action_link;
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL || '"Kauseyah Admin" <admin@kauseyah.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a;">Password Reset</h2>
          <p style="color: #4a4a4a;">You requested a password reset for your Kauseyah admin account.</p>
          <p style="color: #4a4a4a;">Please click the button below to securely reset your password:</p>
          <div style="margin: 30px 0;">
            <a href="${actionLink}" style="background-color: #FF6B00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #71717a; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error sending password reset email:", error);
    return { error: error.message || "Failed to send email. Please check SMTP configuration." };
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
