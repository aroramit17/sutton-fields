"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { useAuth } from "@/context/AuthContext";
import { createLostFoundPost } from "@/actions/lost-found";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

const MAX_IMAGES = 4;
const MAX_SIZE_MB = 5;

export function LostFoundForm() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<"lost" | "found">("lost");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

    try {
      const imageUrls: string[] = [];
      for (const { file } of previews) {
        const ext = file.name.split(".").pop() || "jpg";
        const blob = await upload(`lost-found-images/${user.id}/${crypto.randomUUID()}.${ext}`, file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
        });
        imageUrls.push(blob.url);
      }

      await createLostFoundPost({ status, title, description, location, images: imageUrls });

      router.push("/lost-found");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm font-bold text-on-surface block mb-2">
          Is this a lost or found item/pet?
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setStatus("lost")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${
              status === "lost"
                ? "bg-error-container text-on-error-container"
                : "bg-surface-container-high text-on-surface-variant"
            }`}
          >
            Lost
          </button>
          <button
            type="button"
            onClick={() => setStatus("found")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-colors ${
              status === "found"
                ? "bg-primary/10 text-primary"
                : "bg-surface-container-high text-on-surface-variant"
            }`}
          >
            Found
          </button>
        </div>
      </div>

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
          placeholder="e.g., Orange tabby cat, Bracken Dr"
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
          placeholder="Describe distinguishing details, when it was lost/found, and how to reach you"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-on-surface block mb-1">
          Location
        </label>
        <input
          type="text"
          required
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-surface-tint/40"
          placeholder="Street or nearest cross-street in Sutton Fields"
        />
      </div>

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
          Your post stays active for <strong>14 days</strong>, or mark it resolved earlier
          from the Lost &amp; Found page once reunited.
        </p>
      </div>

      <Button variant="gradient" type="submit" className="w-full py-4">
        {submitting ? "Posting..." : "Post to Lost & Found"}
      </Button>
    </form>
  );
}
