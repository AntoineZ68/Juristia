"use client";

import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  fallback: string;
  /** Classe ajoutée quand le placeholder est affiché (ex. object-contain au lieu de object-cover). */
  fallbackClassName?: string;
};

/** <img> qui bascule sur un placeholder si le visuel final n'est pas encore déposé. */
export default function SmartImage({ src, fallback, className = "", fallbackClassName = "", alt = "", ...rest }: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // L'erreur peut survenir avant l'hydratation React : on la détecte aussi au montage.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <img
      ref={ref}
      src={failed ? fallback : src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`${className} ${failed ? fallbackClassName : ""}`}
      {...rest}
    />
  );
}
