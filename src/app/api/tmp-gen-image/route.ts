import { NextResponse } from "next/server";
import OpenAI from "openai";
import { put } from "@vercel/blob";

export async function GET() {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const response = await openai.images.generate({
    model: "gpt-image-2-2026-04-21",
    prompt:
      "A bright, welcoming modern elementary school building exterior in a Texas suburb. " +
      "Single-story brick and stone facade with large windows, a covered entrance with a flagpole, " +
      "green lawn, young trees, a small playground visible to the side, clear blue sky, daytime. " +
      "Photorealistic architectural photography style, no text or signage visible on the building.",
    size: "1536x1024",
  });
  const b64 = response.data?.[0]?.b64_json;
  if (!b64) return NextResponse.json({ error: "no image" }, { status: 500 });
  const buffer = Buffer.from(b64, "base64");
  const blob = await put(`home/dan-christie-elementary-${Date.now()}.png`, buffer, {
    access: "public",
    contentType: "image/png",
  });
  return NextResponse.json({ url: blob.url });
}
