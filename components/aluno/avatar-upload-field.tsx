"use client";

import { Camera, ImagePlus, Trash2 } from "lucide-react";
import { type ChangeEvent, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type AvatarUploadFieldProps = {
  initialAvatarUrl: string;
};

const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 512;
const OUTPUT_IMAGE_QUALITY = 0.82;

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("image-load-error"));
    };

    image.src = objectUrl;
  });
}

function canvasToDataUrl(canvas: HTMLCanvasElement) {
  return new Promise<string>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("image-export-error"));
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result !== "string") {
            reject(new Error("image-read-error"));
            return;
          }

          resolve(reader.result);
        };
        reader.onerror = () => reject(new Error("image-read-error"));
        reader.readAsDataURL(blob);
      },
      "image/jpeg",
      OUTPUT_IMAGE_QUALITY,
    );
  });
}

async function compressAvatar(file: File) {
  const image = await loadImage(file);
  const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("canvas-context-error");
  }

  context.fillStyle = "#0B1115";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return canvasToDataUrl(canvas);
}

export function AvatarUploadField({ initialAvatarUrl }: AvatarUploadFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [error, setError] = useState("");

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Selecione uma imagem valida.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError("Escolha uma imagem de ate 3 MB.");
      event.target.value = "";
      return;
    }

    try {
      const compressedImage = await compressAvatar(file);
      setAvatarUrl(compressedImage);
      setError("");
    } catch {
      setError("Nao foi possivel carregar a imagem agora.");
      event.target.value = "";
    }
  };

  const handleRemove = () => {
    setAvatarUrl("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor={inputId} className="text-xs text-slate-300">
        Foto/avatar
      </Label>

      <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center">
        <div className="flex size-20 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#0B1115]">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Preview da foto de perfil"
              className="h-full w-full object-cover"
            />
          ) : (
            <Camera className="h-8 w-8 text-slate-400" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <input type="hidden" name="avatarUrl" value={avatarUrl} />

          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
          />

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              asChild
              className="cursor-pointer border border-white/10 bg-white/5 text-slate-100 hover:border-yellow-400/30 hover:bg-yellow-400/10 hover:text-white"
            >
              <label htmlFor={inputId}>
                <ImagePlus className="h-4 w-4" />
                Escolher do dispositivo
              </label>
            </Button>

            {avatarUrl && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRemove}
                className="border-white/10 bg-transparent text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
                Remover foto
              </Button>
            )}
          </div>

          <p className="text-[11px] text-slate-400">
            Escolha uma imagem do seu dispositivo. Vamos ajustar automaticamente para um formato leve de avatar.
          </p>

          {error && <p className="text-xs text-rose-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
