import { NextResponse } from "next/server";
const nodemailer = require("nodemailer");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      userEmail,
      phone,
      streetAddress,
      postalCode,
      city,
      country,
      subTotal,
      totalPrice,
      products,
    } = body;

    if (
      !userEmail ||
      !phone ||
      !streetAddress ||
      !postalCode ||
      !city ||
      !country ||
      !subTotal ||
      !totalPrice ||
      !products
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const productRows = products
      .map(
        (item: any) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">$${item.basePrice}</td>
        </tr>
      `
      )
      .join("");

    const mailOptions = {
      from: `"Payment App" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "🧾 Your Payment Confirmation",
      html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; background: #f0f2f5;">
    <div style="max-width: 650px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h2 style="color: #2e7d32; text-align: center;">💳 Payment Confirmation</h2>
      <p>Hi <strong>${name}</strong>,</p>
      <p>Thank you for your payment. Below are the details of your transaction:</p>

      <h3 style="margin-top: 30px; color: #333;">🧍 Customer Info</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr><td><strong>Name:</strong></td><td>${name}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${userEmail}</td></tr>
        <tr><td><strong>Phone:</strong></td><td>${phone}</td></tr>
      </table>

      <h3 style="margin-top: 30px; color: #333;">📍 Shipping Info</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr><td><strong>Address:</strong></td><td>${streetAddress}</td></tr>
        <tr><td><strong>Postal Code:</strong></td><td>${postalCode}</td></tr>
        <tr><td><strong>City:</strong></td><td>${city}</td></tr>
        <tr><td><strong>Country:</strong></td><td>${country}</td></tr>
      </table>

      <h3 style="margin-top: 30px; color: #333;">🛍️ Order Details</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; border: 1px solid #ccc;">
        <thead style="background: #f7f7f7;">
          <tr>
            <th style="padding: 10px; border: 1px solid #ddd;">Product</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
            <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${productRows}
        </tbody>
      </table>

      <h3 style="margin-top: 30px; color: #333;">💰 Payment Summary</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <tr><td><strong>Subtotal:</strong></td><td>$${subTotal}</td></tr>
        <tr><td><strong>Total Paid:</strong></td><td>$${totalPrice}</td></tr>
        <tr><td><strong>Date:</strong></td><td>${new Date().toLocaleDateString()}</td></tr>
      </table>

      <p style="margin-top: 30px;">If you have any questions or did not authorize this payment, please contact our support team immediately.</p>

      <p style="margin-top: 40px;">Best regards,<br/><strong>The Payment Team</strong></p>

      <div style="text-align: center; font-size: 12px; color: #999; margin-top: 40px;">
        <p>This is an automated email. Please do not reply.</p>
      </div>
    </div>
  </div>
      `,
      headers: {
        "X-Entity-Ref-ID": "payment-confirmation",
      },
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Email sending failed:", error.message || error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
