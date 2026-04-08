import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenAI } from "@google/genai";

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Simple HTML-to-text extraction
function extractText(html: string): string {
  // Remove scripts, styles, and HTML tags
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 8000); // Limit to ~8k chars for the LLM
}

// Extract page title from HTML
function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? match[1].trim() : "Untitled";
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { url, category } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // 1. Scrape the article
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; SuttonFieldsBot/1.0; +https://suttonfields.com)",
      },
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status}` },
        { status: 400 }
      );
    }

    const html = await response.text();
    const articleText = extractText(html);
    const sourceTitle = extractTitle(html);

    // 2. Summarize with Gemini Flash
    const summaryResponse = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a community news editor for Sutton Fields, a residential neighborhood in Celina, Texas. Summarize the following article in 2-3 paragraphs that would be relevant and interesting to neighborhood residents. Write in a warm, community-focused tone. Include key facts and dates. Do not include any preamble like "Here's a summary" — just write the summary directly.

Article source: ${url}
Article title: ${sourceTitle}

Article content:
${articleText}`,
            },
          ],
        },
      ],
    });

    const summary =
      summaryResponse.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Summary could not be generated.";

    // 3. Generate a headline/title with Gemini
    const titleResponse = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Write a short, engaging headline (max 80 characters) for this community news article summary. No quotes around it. Just the headline text.

Summary: ${summary}`,
            },
          ],
        },
      ],
    });

    const generatedTitle =
      titleResponse.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
      sourceTitle;

    // 4. Generate image with Gemini Nano Banana 2
    let imageUrl: string | null = null;
    try {
      const imageResponse = await genai.models.generateContent({
        model: "gemini-3.1-flash-image-preview",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Generate a photorealistic editorial image for a community newspaper article with this headline: "${generatedTitle}". The image should look like a professional photograph that could accompany a local neighborhood news story. Style: warm, inviting, community-focused. Setting: suburban Texas neighborhood. Do NOT include any text or words in the image.`,
              },
            ],
          },
        ],
        config: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      });

      // Extract image from response
      const parts = imageResponse.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.mimeType?.startsWith("image/")) {
          // Upload to Supabase Storage
          const imageBuffer = Buffer.from(part.inlineData.data!, "base64");
          const fileName = `${crypto.randomUUID()}.png`;
          const { error: uploadError } = await supabase.storage
            .from("article-images")
            .upload(fileName, imageBuffer, {
              contentType: "image/png",
            });

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from("article-images")
              .getPublicUrl(fileName);
            imageUrl = urlData.publicUrl;
          }
          break;
        }
      }
    } catch (imgError) {
      console.error("Image generation failed, continuing without image:", imgError);
    }

    // 5. Save to database
    const { data: article, error: insertError } = await supabase
      .from("articles")
      .insert({
        title: generatedTitle,
        summary,
        source_url: url,
        source_title: sourceTitle,
        image_url: imageUrl,
        category: category || "Community",
        is_published: false,
        created_by: user.id,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: `Database error: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("News generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
