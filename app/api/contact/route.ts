import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  email: z.string().email({ message: "A valid email is required." }),
  message: z.string().min(1, { message: "Message is required." }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = contactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten().fieldErrors, message: "Invalid form data" },
        { status: 400 }
      );
    }
    const { name, email, message } = validation.data;

    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false, // true for 465, false for other ports (like 587)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // In a local environment, you might need to disable TLS verification.
      // For production, you should have valid certificates.
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === "production",
      },
    });

    // Send mail with defined transport object
    const mailOptions = {
      from: `"${name}" <${process.env.SMTP_USER}>`, // sender address
      to: process.env.CONTACT_TO, // list of receivers
      subject: `New Contact Form Submission from ${name}`, // Subject line
      text: `You have a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`, // plain text body
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <hr>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ ok: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("CONTACT_FORM_ERROR", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}