import React from 'react';

export const FALLBACK_WATCH_IMAGE = 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80';

export function handleImageFallback(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const img = e.currentTarget;
  const currentSrc = img.src || '';
  const filename = currentSrc.split('/').pop()?.split('?')[0] || '';

  // Step 1: If it was requested without /assets/images/, try /assets/images/
  if (!currentSrc.includes('/assets/images/') && filename) {
    img.src = `/assets/images/${filename}`;
    return;
  }

  // Step 2: If it was requested with /assets/images/, try root /
  if (currentSrc.includes('/assets/images/') && !img.dataset.triedRoot && filename) {
    img.dataset.triedRoot = 'true';
    img.src = `/${filename}`;
    return;
  }

  // Step 3: If all local relative variations fail, fallback to high-res luxury timepiece image
  if (!img.dataset.triedFallback) {
    img.dataset.triedFallback = 'true';
    img.src = FALLBACK_WATCH_IMAGE;
  }
}
