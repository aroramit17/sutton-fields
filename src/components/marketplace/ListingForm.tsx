"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const MAX_IMAGES = 4;
const MAX_SIZE_MB = 5;

export function ListingForm() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState(profile?.address || "");
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    setError(null);
    const newFiles: { file: File; url: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      if (previews.length + newFiles.length >= MAX_IMAGES) break;
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`Each image must be under ${MAX_SIZE_MB}MB.`);
        continue;
      }
      newFiles.push({ file, url: URL.createObjectURL(file) });
    }
    setPreviews((prev) => [...prev, ...newFiles]);
  }

  function removeImage(index: number) {
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSubmitting(true);

    const supabase = createClient();

    // Upload images
    const imageUrls: string[] = [];
    for (const { file } of previews) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(path, file);
      if (uploadError) {
        setError(`Image upload failed: ${uploadError.message}`);
        setSubmitting(false);
        return;
      }
      const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
      imageUrls.push(data.publicUrl);
    }

    // Insert listing
    const { error: insertError } = await supabase.from("listings").insert({
      user_id: user.id,
      title,
      description,
      price: parseFloat(price),
      location,
      images: imageUrls,
    });

    if (insertError) {
      setError(`Failed to create listing: ${insertError.message}`);
      setSubmitting(false);
      return;
    }

    router.push("/buy-sell-trade");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm font-bold text-on-surface block mb-1">
          Title
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
          placeholder="e.g., Kids' bike, barely used"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-on-surface block mb-1">
          Description
        </label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40 resize-none"
          placeholder="Describe the item, condition, and any other details"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-bold text-on-surface block mb-1">
            Price ($)
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="text-sm font-bold text-on-surface block mb-1">
            Pickup Location
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
            placeholder="Your address in Sutton Fields"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="text-sm font-bold text-on-surface block mb-2">
          Photos (up to {MAX_IMAGES})
        </label>
        <div
          className="border-2 border-dashed border-outline-variant rounded-2xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); }}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        >
          <Icon name="add_photo_alternate" className="text-3xl text-on-surface-variant mb-1" />
          <p className="text-sm text-on-surface-variant">
            Drag & drop or click to browse
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {previews.length > 0 && (
          <div className="flex gap-3 mt-3 flex-wrap">
            {previews.map((preview, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden">
                <img src={preview.url} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-on-surface/70 text-white rounded-full flex items-center justify-center hover:bg-error transition-colors"
                >
                  <Icon name="close" className="!text-[10px]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-surface-container-low rounded-xl p-4 flex items-start gap-3">
        <Icon name="info" className="text-tertiary shrink-0" />
        <p className="text-xs text-on-surface-variant">
          Your listing will be visible to all Sutton Fields visitors and will
          automatically expire after <strong>48 hours</strong>. You can deactivate it
          earlier from the marketplace page.
        </p>
      </div>

      <Button variant="gradient" type="submit" className="w-full py-4">
        {submitting ? "Creating Listing..." : "Post Listing"}
      </Button>
    </form>
  );
}
