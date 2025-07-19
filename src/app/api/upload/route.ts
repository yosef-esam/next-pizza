import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";

// Define the type for the form data file
type FormDataFile = Blob & {
  name?: string; // Optional: Some browsers may add this
};

export async function POST(request: Request) {
  try {
    console.log("API Route: Starting file upload process.");

    const formData = await request.formData();
    const file = formData.get("file") as FormDataFile | null;
    const pathName = formData.get("pathName") as string;

    console.log(
      "API Route: Received formData. file:",
      file ? "present" : "absent",
      "pathName:",
      pathName
    );

    if (!file) {
      console.log("API Route: No file provided. Returning 400.");
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert the file to a format Cloudinary can handle (Buffer or Base64)
    console.log(
      `API Route: Converting file to ArrayBuffer. File type: ${file.type}`
    );
    const fileBuffer = await file.arrayBuffer();
    const base64File = Buffer.from(fileBuffer).toString("base64");
    console.log("API Route: File converted to Base64.");

    // Upload to Cloudinary
    console.log(
      `API Route: Attempting to upload to Cloudinary. Folder: ${pathName}`
    );
    const uploadResponse = await cloudinary.uploader.upload(
      `data:${file.type};base64,${base64File}`,
      {
        folder: pathName,
        transformation: [
          { width: 200, height: 200, crop: "fill", gravity: "face" },
        ],
      }
    );
    console.log(
      "API Route: File uploaded to Cloudinary successfully. Secure URL:",
      uploadResponse.secure_url
    );
    return NextResponse.json({ url: uploadResponse.secure_url });
  } catch (error) {
    console.error(
      "API Route Error: Failed to upload file to Cloudinary:",
      error
    );
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
