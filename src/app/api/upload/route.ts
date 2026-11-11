import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { auth } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_REQUEST_SIZE = MAX_SIZE + 64 * 1024; // Allow multipart headers around the image.

export const runtime = "nodejs";

function detectImageType(bytes: Uint8Array): (typeof ALLOWED_TYPES)[number] | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (pngSignature.every((byte, index) => bytes[index] === byte)) {
    return "image/png";
  }

  const isWebp =
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (isWebp) return "image/webp";

  return null;
}

const EXTENSIONS: Record<(typeof ALLOWED_TYPES)[number], string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentLengthHeader = request.headers.get("content-length");
    if (contentLengthHeader !== null) {
      const contentLength = Number(contentLengthHeader);
      if (!Number.isFinite(contentLength) || contentLength > MAX_REQUEST_SIZE) {
        return NextResponse.json(
          { error: "Upload must be 5 MB or smaller." },
          { status: 413 }
        );
      }
    }

    const contentTypeHeader = request.headers.get("content-type");
    if (!contentTypeHeader?.toLowerCase().startsWith("multipart/form-data; boundary=")) {
      return NextResponse.json({ error: "Expected a multipart image upload." }, { status: 400 });
    }

    const reader = request.body?.getReader();
    if (!reader) {
      return NextResponse.json({ error: "No upload data provided." }, { status: 400 });
    }

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_REQUEST_SIZE) {
        await reader.cancel();
        return NextResponse.json(
          { error: "Upload must be 5 MB or smaller." },
          { status: 413 }
        );
      }
      chunks.push(value);
    }

    const bodyBytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bodyBytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    let formData: FormData;
    try {
      formData = await new Response(bodyBytes, {
        headers: { "content-type": contentTypeHeader },
      }).formData();
    } catch {
      return NextResponse.json({ error: "Invalid image upload." }, { status: 400 });
    }
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 413 }
      );
    }

    const signature = new Uint8Array(await file.slice(0, 12).arrayBuffer());
    const contentType = detectImageType(signature);
    if (!contentType || !ALLOWED_TYPES.includes(contentType)) {
      return NextResponse.json(
        { error: "Invalid image. Only JPEG, PNG, and WebP files are allowed." },
        { status: 400 }
      );
    }

    const filename = `${session.user.id}/${randomUUID()}.${EXTENSIONS[contentType]}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase.storage
      .from("report-images")
      .upload(filename, buffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return NextResponse.json(
        { error: "Upload failed. Please try again." },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("report-images")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
