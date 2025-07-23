import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { Buffer } from "buffer"; // ✅ needed for base64 conversion

type FormDataFile = Blob & {
  name?: string;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as FormDataFile | null;
    const pathName = formData.get("pathName") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const base64File = Buffer.from(fileBuffer).toString("base64");
    const base64DataUri = `data:${file.type};base64,${base64File}`;

    const uploadResponse = await cloudinary.uploader.upload(base64DataUri, {
      folder: pathName || "default",
      transformation: [
        { width: 200, height: 200, crop: "fill", gravity: "face" },
      ],
    });

    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
