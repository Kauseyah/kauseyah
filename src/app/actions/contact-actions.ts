"use server";

import { Resend } from 'resend';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export async function submitContactForm(formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    const validatedData = contactSchema.parse(rawData);

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // The email is sent TO the admin/orders email
    const toEmail = process.env.RESEND_FROM_EMAIL || 'admin@kauseyah.com';
    // The email must be sent FROM a verified domain (kauseyah.com)
    const fromEmail = 'Kauseyah Contact Form <contact@kauseyah.com>';

    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: validatedData.email,
      subject: `New Contact Form Submission from ${validatedData.name}`,
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #FF6B00;">New Contact Message</h2>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; color: #4a4a4a;">${validatedData.message}</p>
        </div>
      `,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: (error as any).errors[0].message };
    }
    return { error: "Failed to send message. Please try again later." };
  }
}
