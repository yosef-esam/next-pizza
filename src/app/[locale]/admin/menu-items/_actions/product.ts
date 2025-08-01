"use server";

import { Pages, Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { addProductSchema, updateProductSchema } from "@/validations/product";
import { Extra, ExtraIngredients, ProductSizes, Size } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export const addProduct = async (
  args: {
    categoryId: string;
    options: { sizes: Partial<Size>[]; extras: Partial<Extra>[] };
  },
  prevState: unknown,
  formData: FormData
) => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const result = addProductSchema(translations).safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return {
      error: result.error.formErrors.fieldErrors,
      status: 400,
      formData,
    };
  }
  const data = result.data;
  const basePrice = Number(data.basePrice);
  const imageFile = data.image as File;
  const imageUrl = Boolean(imageFile.size)
    ? await getImageUrl(imageFile)
    : undefined;
  try {
    if (imageUrl) {
      await db.product.create({
        data: {
          ...data,
          image: imageUrl,
          basePrice,
          categoryId: args.categoryId,
          sizes: {
            createMany: {
              data: args.options.sizes.map((size) => ({
                name: size.name as ProductSizes,
                price: Number(size.price),
              })),
            },
          },
          extras: {
            createMany: {
              data: args.options.extras.map((extra) => ({
                name: extra.name as ExtraIngredients,
                price: Number(extra.price),
              })),
            },
          },
        },
      });
      revalidatePath(`/${locale}/${Routes.MENU}`);
      revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
      revalidatePath(`/${locale}`);
      return {
        status: 201,
        message: translations.messages.productAdded,
      };
    }
    return {};
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: translations.messages.unexpectedError,
    };
  }
};

export const updateProduct = async (
  args: {
    productId: string;
    options: { sizes: Partial<Size>[]; extras: Partial<Extra>[] };
  },
  prevState: unknown,
  formData: FormData
) => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const result = updateProductSchema(translations).safeParse(
    Object.fromEntries(formData.entries())
  );
  if (result.success === false) {
    return {
      error: result.error.formErrors.fieldErrors,
      status: 400,
      formData,
    };
  }
  const data = result.data;
  const basePrice = Number(data.basePrice);
  let imageUrl: string | undefined = undefined;

const imageFile = data.image as File;

// Check if it's a File object with content
if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
  imageUrl = await getImageUrl(imageFile);
}
  const product = await db.product.findUnique({
    where: { id: args.productId },
  });

  if (!product) {
    return {
      status: 400,
      message: translations.messages.unexpectedError,
    };
  }
  try {
    const updatedProduct = await db.product.update({
      where: {
        id: args.productId,
      },
      data: {
        ...data,
        basePrice,
        image: imageUrl ?? product.image,
      },
    });

    await db.size.deleteMany({
      where: { productId: args.productId },
    });
    await db.size.createMany({
      data: args.options.sizes.map((size) => ({
        productId: args.productId,
        name: size.name as ProductSizes,
        price: Number(size.price),
      })),
    });

    await db.extra.deleteMany({
      where: { productId: args.productId },
    });

    await db.extra.createMany({
      data: args.options.extras.map((extra) => ({
        productId: args.productId,
        name: extra.name as ExtraIngredients,
        price: Number(extra.price),
      })),
    });
    revalidatePath(`/${locale}/${Routes.MENU}`);
    revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
    revalidatePath(
      `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${updatedProduct.id}/${Pages.EDIT}`
    );
    revalidatePath(`/${locale}`);
    return {
      status: 200,
      message: translations.messages.updateProductSucess,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: translations.messages.unexpectedError,
    };
  }
};
const getImageUrl = async (imageFile: File) => {
  console.log(
    "Client: getImageUrl function called with imageFile:",
    imageFile.name,
    "Type:",
    imageFile.type
  );

  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("pathName", "product_images");
  console.log("Client: FormData created with file and pathName.");

  try {
    const uploadUrl = `${(await headers()).get("origin")}/api/upload`;
    console.log("Client: Sending request to URL:", uploadUrl);

    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    console.log(
      "Client: Received response from API route. Status:",
      response.status
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Client: API response not OK. Error data:", errorData);
      throw new Error(
        `Upload failed: ${errorData.error || response.statusText}`
      );
    }

    const image = (await response.json()) as { url: string };
    console.log(
      "Client: Successfully parsed JSON response. Image URL:",
      image.url
    );
    return image.url;
  } catch (error) {
    console.error("Client Error: Error uploading file to Cloudinary:", error);
    // You might want to re-throw the error or handle it gracefully in your UI
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  try {
    await db.product.delete({
      where: { id },
    });
    revalidatePath(`/${locale}/${Routes.MENU}`);
    revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}`);
    revalidatePath(
      `/${locale}/${Routes.ADMIN}/${Pages.MENU_ITEMS}/${id}/${Pages.EDIT}`
    );
    revalidatePath(`/${locale}`);
    return {
      status: 200,
      message: translations.messages.deleteProductSucess,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: translations.messages.unexpectedError,
    };
  }
};