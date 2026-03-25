import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET, R2_PUBLIC_DOMAIN } from "@/lib/r2.server";

export async function POST(req: Request) {
  try {
    const { fileName, fileType } = await req.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "Missing filename or type" }, { status: 400 });
    }

    // Sanitize filename
    const sanitizedName = fileName.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    const key = `profiles/${Date.now()}_${sanitizedName}`;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
    const finalUrl = `${R2_PUBLIC_DOMAIN}/${key}`;

    return NextResponse.json({ uploadUrl, key, finalUrl });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown R2 Error";
    console.error("R2 Presign Error:", errorMsg);
    return NextResponse.json({ error: "Could not generate upload URL" }, { status: 500 });
  }
}
