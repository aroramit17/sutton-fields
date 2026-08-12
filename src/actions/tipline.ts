"use server";

import { requireAdmin } from "@/lib/auth";
import { processTiplineImages, type TiplineResult } from "@/lib/tipline";

export async function submitTipline(imageUrls: string[]): Promise<TiplineResult> {
  const { userId } = await requireAdmin();
  if (imageUrls.length === 0 || imageUrls.length > 10) {
    throw new Error("Upload between 1 and 10 screenshots.");
  }
  return processTiplineImages(imageUrls, userId);
}
