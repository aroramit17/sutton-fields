import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireApprovedProfile } from "@/lib/auth";

// Token endpoint for @vercel/blob/client's upload() — called from every
// board's form (ListingForm, LostFoundForm) before the actual file upload.
// This is where the old Supabase Storage RLS ("Approved users can create ...")
// gets re-enforced, since Blob itself has no per-user policy layer.
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const { userId } = await requireApprovedProfile();
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
          maximumSizeInBytes: 5 * 1024 * 1024,
          tokenPayload: JSON.stringify({ userId }),
        };
      },
      onUploadCompleted: async () => {
        // No server-side follow-up needed — the caller inserts the resulting
        // blob URL into its own row via a Server Action right after upload.
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 }
    );
  }
}
