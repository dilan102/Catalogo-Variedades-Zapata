import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Section } from "@/types";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

const sectionImages: Record<string, string> = {
  dama: "/Silueta_dama_seccion.jpg",
  caballero: "/silueta_caballero_seccion.jpeg",
  joven: "/silueta_joven_seccion.jpg",
  nino: "/silueta_niño_seccion.jpg",
  nina: "/silueta_niña_seccion.jpeg",
  accesorios: "/silueta_accesorios_seccion.jpeg",
  edredones: "/silueta_edredones_seccion.jpg",
  esika: "/silueta_esika_seccion.jpg",
};

export default function SectionCard({ section }: { section: Section }) {
  const imageUrl = section.image_url || sectionImages[section.slug];
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const hasImage = Boolean(imageUrl) && !imageError;

  return (
    <Link
      href={`/${section.slug}`}
      className="group relative block aspect-square overflow-hidden rounded-2xl border border-[#E7F3E9] bg-[#F8FCF8] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]"
    >
      <div className="absolute inset-0 overflow-hidden bg-[#F8FCF8]">
        {hasImage ? (
          <>
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            >
              <Image
                src={imageUrl!}
                alt={section.name}
                fill
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </div>
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-[#EAF8EC]" />
            )}
          </>
        ) : (
          <ImagePlaceholder className="absolute inset-0" />
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-[#0f2a1a] bg-[#000000]/90 p-4 backdrop-blur-[1px] sm:p-5">
        <p className="font-serif text-lg font-semibold leading-tight text-[#2F5E3F] sm:text-xl">
          {section.name}
        </p>
        {section.description && (
          <p className="mt-2 text-xs text-[#fff] sm:text-sm">
            {section.description}
          </p>
        )}
      </div>
    </Link>
  );
}
