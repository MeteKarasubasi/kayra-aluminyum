"use client"

import { useRef, useState } from "react"
import { ImagePlus, Loader2, Trash2, X } from "lucide-react"
import { cn } from "@/lib/utils"

const MAX_SIZE = 100 * 1024 * 1024

type Props = {
  value: string
  onChange: (url: string) => void
  label?: string
  aspect?: string
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  label = "Görsel",
  aspect = "aspect-video",
  className,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  async function uploadFile(file: File) {
    if (file.size > MAX_SIZE) {
      setError("Dosya 100MB'den büyük")
      return
    }
    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız")
      onChange(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız")
    } finally {
      setUploading(false)
    }
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ""
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }

  function clear() {
    onChange("")
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="text-sm font-medium text-foreground">{label}</span>
      )}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "relative shrink-0 overflow-hidden rounded-xl border border-border bg-muted",
            aspect ? "w-32 shrink-0" : "size-20",
            aspect,
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          {value ? (
            <>
              <img
                src={value}
                alt="Preview"
                className="size-full object-cover"
              />
              <button
                type="button"
                onClick={clear}
                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 transition hover:bg-background hover:text-destructive group-hover:opacity-100"
                aria-label="Kaldır"
              >
                <X className="size-3.5" />
              </button>
            </>
          ) : (
            <div
              className={cn(
                "flex size-full cursor-pointer flex-col items-center justify-center text-muted-foreground transition",
                dragOver && "border-primary bg-primary/10 text-primary",
                uploading && "opacity-50",
              )}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <ImagePlus className="size-5" />
              )}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1">
          {value ? (
            <div className="flex items-center gap-2">
              <input
                type="hidden"
                value={value}
                readOnly
              />
              <span className="truncate text-xs text-muted-foreground">
                {value}
              </span>
              <button
                type="button"
                onClick={clear}
                className="flex size-7 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-destructive hover:text-destructive"
                aria-label="Görseli kaldır"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <ImagePlus className="size-3.5" />
              )}
              {uploading ? "Yükleniyor..." : "Dosya Seç"}
            </button>
          )}
          <p className="text-xs text-muted-foreground/60">
            Sürükle-bırak veya tıkla · PNG, JPG, WebP, SVG · max 100MB
          </p>
          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleSelect}
        className="hidden"
      />
    </div>
  )
}

type GalleryProps = {
  value: string[]
  onChange: (urls: string[]) => void
  label?: string
}

export function GalleryUpload({ value, onChange, label = "Galeri" }: GalleryProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function uploadFiles(files: FileList) {
    setUploading(true)
    setError(null)
    try {
      const urls: string[] = []
      for (const file of Array.from(files)) {
        if (file.size > MAX_SIZE) {
          setError(`${file.name} 100MB'den büyük, atlandı`)
          continue
        }
        const formData = new FormData()
        formData.append("file", file)
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız")
        urls.push(data.url)
      }
      if (urls.length > 0) onChange([...value, ...urls])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız")
    } finally {
      setUploading(false)
    }
  }

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files)
    }
    e.target.value = ""
  }

  function removeItem(idx: number) {
    onChange(value.filter((_, i) => i !== idx))
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className="text-sm font-medium text-foreground">{label}</span>
      )}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((url, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
            >
              <img src={url} alt={`Galeri ${i + 1}`} className="size-full object-cover" />
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 transition hover:bg-background hover:text-destructive group-hover:opacity-100"
                aria-label="Kaldır"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex w-fit items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-sm text-muted-foreground transition hover:border-primary hover:text-primary disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ImagePlus className="size-4" />
        )}
        {uploading ? "Yükleniyor..." : "Görsel Ekle"}
      </button>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleSelect}
        className="hidden"
      />
    </div>
  )
}