import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("📦 Incoming order data:", data);

    const {
      userEmail,
      phone,
      streetAddress,
      postalCode,
      city,
      country,
      subTotal,
      paid,
      deliveryFee,
      totalPrice,
      products,
    } = data;

    // Validation
    if (
      !userEmail ||
      !phone ||
      !streetAddress ||
      !postalCode ||
      !city ||
      !paid ||
      !country ||
      !subTotal ||
      !deliveryFee ||
      !totalPrice ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing or invalid order fields." },
        { status: 400 }
      );
    }

    // Create the order
    const order = await db.order.create({
      data: {
        userEmail,
        phone,
        streetAddress,
        postalCode,
        city,
        country,
        subTotal,
        paid,
        deliveryFee,
        totalPrice,
        products: {
          create: products.map((product) => ({
            quantity: product.quantity,
            product: {
              connect: {
                id: product.id, // must exist in the DB
              },
            },
          })),
        },
      },
      include: {
        products: true,
      },
    });

    return NextResponse.json(
      { message: "✅ Order created successfully", order },
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ API /api/order error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const orders = await db.order.findMany({
      include: {
        products: {
          include: {
            product: true, // include full product details
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err },
      { status: 500 }
    );
  }
}
