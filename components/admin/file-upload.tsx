"use client"

import { useRef, useState } from "react"
import { FileText, Loader2, Trash2, UploadCloud } from "lucide-react"
import { cn } from "@/lib/utils"

const MAX_SIZE = 100 * 1024 * 1024

type Props = {
  value: string
  onChange: (url: string) => void
  label?: string
  accept?: string
  hint?: string
  className?: string
}

export function FileUpload({
  value,
  onChange,
  label = "Dosya",
  accept = "application/pdf",
  hint = "PDF · maks 100MB",
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

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <span className="text-sm font-medium text-foreground">{label}</span>
      )}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-4 transition",
          dragOver && "border-primary bg-primary/10",
          uploading && "pointer-events-none opacity-60",
        )}
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {uploading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : value ? (
            <FileText className="size-5" />
          ) : (
            <UploadCloud className="size-5" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          {value ? (
            <>
              <p className="truncate text-sm font-medium text-foreground">
                {value}
              </p>
              <p className="text-xs text-muted-foreground">
                Değiştirmek için tıklayın veya yeni dosya sürükleyin
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-foreground">
                {uploading ? "Yükleniyor..." : "Dosya seçin veya sürükleyin"}
              </p>
              <p className="text-xs text-muted-foreground">{hint}</p>
            </>
          )}
        </div>
        {value && !uploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange("")
            }}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-destructive hover:text-destructive"
            aria-label="Dosyayı kaldır"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleSelect}
        className="hidden"
      />
    </div>
  )
}
