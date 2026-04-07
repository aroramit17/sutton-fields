"use client";

import { useState, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { createClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
  userId: string;
  onImagesUploaded: (urls: string[]) => void;
}

const MAX_IMAGES = 4;
const MAX_SIZE_MB = 5;

export function ImageUploader({ userId, onImagesUploaded }: ImageUploaderProps) {
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    setError(null);

    const newFiles: { file: File; url: string }[] = [];
    for (let i = 0; i < files.length; i++) {
      if (previews.length + newFiles.length >= MAX_IMAGES) {
        setError(`Maximum ${MAX_IMAGES} images allowed.`);
        break;
      }
      const file = files[i];
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed.");
        continue;
      }
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

  async function uploadAll(): Promise<string[]> {
    setUploading(true);
    const supabase = createClient();
    const urls: string[] = [];

    for (const { file } of previews) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("listing-images")
        .upload(path, file);

      if (error) {
        setError(`Upload failed: ${error.message}`);
        setUploading(false);
        return [];
      }

      const { data } = supabase.storage
        .from("listing-images")
        .getPublicUrl(path);
      urls.push(data.publicUrl);
    }

    setUploading(false);
    onImagesUploaded(urls);
    return urls;
  }

  // Expose uploadAll via a ref-like approach: parent calls it during form submit
  // We'll use a callback pattern instead
  // The parent component will call this component's upload function
  // through the onImagesUploaded callback

  return (
    <div>
      <div
        className="border-2 border-dashed border-outline-variant rounded-2xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.classList.add("border-primary/40");
        }}
        onDragLeave={(e) => {
          e.currentTarget.classList.remove("border-primary/40");
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.currentTarget.classList.remove("border-primary/40");
          handleFiles(e.dataTransfer.files);
        }}
      >
        <Icon name="add_photo_alternate" className="text-4xl text-on-surface-variant mb-2" />
        <p className="text-sm text-on-surface-variant">
          Drag & drop images or click to browse
        </p>
        <p className="text-xs text-on-surface-variant/60 mt-1">
          Max {MAX_IMAGES} images, {MAX_SIZE_MB}MB each
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

      {error && (
        <p className="text-error text-sm mt-2">{error}</p>
      )}

      {previews.length > 0 && (
        <div className="flex gap-3 mt-4 flex-wrap">
          {previews.map((preview, i) => (
            <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden">
              <img
                src={preview.url}
                alt={`Preview ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-on-surface/70 text-white rounded-full flex items-center justify-center text-xs hover:bg-error transition-colors"
              >
                <Icon name="close" className="!text-xs" />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <p className="text-sm text-primary mt-2 animate-pulse">Uploading images...</p>
      )}

      {/* Hidden trigger for parent to call */}
      <button
        type="button"
        id="upload-trigger"
        className="hidden"
        onClick={() => uploadAll()}
      />
    </div>
  );
}

// Export upload function approach: use imperative handle
export { type ImageUploaderProps };
