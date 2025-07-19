
"use server";

import { db } from "@/lib/prisma";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import getTrans from "@/lib/translation";
import { revalidatePath } from "next/cache";
import { OrderProduct, Product, User } from "@prisma/client";

// Example validation schema (can be replaced with Zod)
const isValidNumber = (value: string | null) => !isNaN(Number(value));

export const addOrder = async (
  args: {
    products: {
      productId: string;
      quantity: number;
      userId?: string;
    }[];
  },
  prevState: unknown,
  formData: FormData
) => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);

  // Extract fields
  const subTotal = formData.get("subTotal") as string;
  const deliveryFee = formData.get("deliveryFee") as string;
  const totalPrice = formData.get("totalPrice") as string;

  const userEmail = formData.get("userEmail");
  const phone = formData.get("phone");
  const streetAddress = formData.get("streetAddress");
  const postalCode = formData.get("postalCode");
  const city = formData.get("city");
  const country = formData.get("country");

  // Validate
  if (
    !isValidNumber(subTotal?.toString()) ||
    !isValidNumber(deliveryFee?.toString()) ||
    !isValidNumber(totalPrice?.toString()) ||
    !userEmail ||
    !phone ||
    !streetAddress ||
    !postalCode ||
    !city ||
    !country
  ) {
    return {
      status: 400,
      error: {
        message: translations.messages.invalidFields || "Invalid form fields",
      },
      formData,
    };
  }

  try {
    // Create order
     await db.order.create({
      data: {
        subTotal: Number(subTotal),
        deliveryFee: Number(deliveryFee),
        totalPrice: Number(totalPrice),
        userEmail: userEmail.toString(),
        phone: phone.toString(),
        streetAddress: streetAddress.toString(),
        postalCode: postalCode.toString(),
        city: city.toString(),
        country: country.toString(),
        products: {
          create: args.products.map((p) => ({
            productId: p.productId,
            quantity: p.quantity,
            userId: p.userId || null,
          })),
        },
      },
    });

    // Revalidate needed paths
    revalidatePath(`/${locale}/orders`);
    revalidatePath(`/${locale}/admin/orders`);
    revalidatePath(`/${locale}`);

    return {
      status: 201,
      message: translations.messages.categoryAdded || "Order created successfully",
    };
  } catch (error) {
    console.error("ORDER CREATE ERROR", error);
    return {
      status: 500,
      message: translations.messages.unexpectedError || "Unexpected error occurred",
    };
  }
};
