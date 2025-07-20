"use server";
import { Pages, Routes } from "@/constants/enums";
import { getCurrentLocale } from "@/lib/getCurrentLocale";
import { db } from "@/lib/prisma";
import getTrans from "@/lib/translation";
import { updateProfileSchema } from "@/validations/profile";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateProfile = async (
  isAdmin: boolean,
  prevState: unknown,
  formData: FormData
) => {
  const locale = await getCurrentLocale();
  const translations = await getTrans(locale);
  const result = updateProfileSchema(translations).safeParse(
    Object.fromEntries(formData.entries())
  );

  if (result.success === false) {
    return {
      error: result.error.formErrors.fieldErrors,
      formData,
    };
  }
  const data = result.data;
  let imageUrl: string | undefined = undefined;

const imageFile = data.image as File;

// Check if it's a File object with content
if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
  imageUrl = await getImageUrl(imageFile);
}
  try {
    const user = await db.user.findUnique({
      where: {
        email: data.email,
      },
    });
    if (!user) {
      return {
        message: translations.messages.userNotFound,
        status: 401,
        formData,
      };
    }
    await db.user.update({
      where: {
        email: user.email,
      },
      data: {
        ...data,
        image: imageUrl ?? user.image,
        role: isAdmin ? UserRole.ADMIN : UserRole.USER,
      },
    });
    revalidatePath(`/${locale}/${Routes.PROFILE}`);
    revalidatePath(`/${locale}/${Routes.ADMIN}`);
    revalidatePath(`/${locale}/${Routes.ADMIN}/${Pages.USERS}`);
    revalidatePath(
      `/${locale}/${Routes.ADMIN}/${Pages.USERS}/${user.id}/${Pages.EDIT}`
    );
    return {
      status: 200,
      message: translations.messages.updateProfileSucess,
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
    const uploadUrl = "/api/upload";
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