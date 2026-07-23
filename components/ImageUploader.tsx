"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function ImageUploader({
  images,
  onChange,
  max = 4,
}: {
  images: string[];
  onChange: (urls: string[]) => void;
  max?: number;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError("");
    const remaining = max - images.length;
    if (remaining <= 0) {
      setError(`You can only add up to ${max} images.`);
      return;
    }
    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);
    const uploaded: string[] = [];

    for (const file of toUpload) {
      const ext = file.name.split(".").pop();
      const path = `products/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: false });

      if (uploadError) {
        setError(uploadError.message);
        continue;
      }
      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);
      uploaded.push(data.publicUrl);
    }

    onChange([...images, ...uploaded]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImage(url: string) {
    onChange(images.filter((u) => u !== url));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((url) => (
          <div
            key={url}
            className="relative h-24 w-24 overflow-hidden rounded-lg border border-gold-500/20"
          >
            <Image src={url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-950/80 text-xs text-ivory hover:bg-red-900"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        ))}
        {images.length < max && (
          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gold-500/30 text-xs text-ivory/50 hover:border-gold-400 hover:text-gold-300">
            {uploading ? "Uploading…" : `+ Add (${images.length}/${max})`}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              disabled={uploading}
            />
          </label>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
      <p className="mt-2 text-xs text-ivory/40">
        Up to {max} photos per product. First photo is the main image shown
        in the shop grid.
      </p>
    </div>
  );
}
