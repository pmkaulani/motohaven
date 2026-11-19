"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

interface VehicleGalleryProps {
  photos?: string[];
  coverPhoto?: string;
  vehicleTitle: string;
}

export function VehicleGallery({ photos, coverPhoto, vehicleTitle }: VehicleGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const openerElementRef = React.useRef<HTMLElement | null>(null);
  const lightboxRef = React.useRef<HTMLDivElement | null>(null);

  // Combine cover photo and other photos, eliminating duplicates
  const rawList = [];
  if (coverPhoto) rawList.push(coverPhoto);
  if (photos) rawList.push(...photos);
  const uniqueImages = Array.from(new Set(rawList.filter(Boolean)));
  const safeImages = uniqueImages.length > 0 ? uniqueImages : ["/images/car-placeholder.jpg"];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  const openLightbox = (e?: React.MouseEvent) => {
    openerElementRef.current = (e?.currentTarget as HTMLElement) || (document.activeElement as HTMLElement | null);
    setLightboxOpen(true);
  };

  // Keyboard navigation & focus management for lightbox
  useEffect(() => {
    if (lightboxOpen) {
      const container = lightboxRef.current;
      if (container) {
        const focusable = container.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          focusable[0].focus();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
          if (e.key === "Escape") {
            setLightboxOpen(false);
          } else if (e.key === "ArrowLeft") {
            setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
          } else if (e.key === "ArrowRight") {
            setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
          } else if (e.key === "Tab") {
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey) {
              if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
              }
            } else {
              if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
              }
            }
          }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
      }
    } else {
      openerElementRef.current?.focus();
    }
  }, [lightboxOpen, safeImages.length]);

  return (
    <div className="space-y-3">
      {/* Main Photograph Frame (4:3 aspect ratio) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100 border border-border group shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={safeImages[activeIndex]}
          alt={`${vehicleTitle} - Photo ${activeIndex + 1} of ${safeImages.length}`}
          className="w-full h-full object-cover cursor-zoom-in"
          onClick={openLightbox}
        />

        {/* Quiet Arrow Controls */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/95 text-text-primary hover:bg-white shadow-md transition-all opacity-85 hover:opacity-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Previous photograph"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/95 text-text-primary hover:bg-white shadow-md transition-all opacity-85 hover:opacity-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Next photograph"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter & Fullscreen Trigger */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-medium text-white bg-black/70 backdrop-blur-sm rounded-full">
            {activeIndex + 1} / {safeImages.length}
          </span>
          <button
            type="button"
            onClick={openLightbox}
            className="p-2 bg-black/70 backdrop-blur-sm text-white hover:bg-black rounded-full transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            title="Full size view"
            aria-label="Open full size photo viewer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Thumbnails Strip with Accessible Button Names (Fixes Finding 6) */}
      {safeImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1" role="region" aria-label="Photo thumbnails">
          {safeImages.map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Show photo ${idx + 1} of ${safeImages.length}`}
              className={`relative flex-shrink-0 w-20 sm:w-24 aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all min-h-[44px] ${
                activeIndex === idx
                  ? "border-text-primary shadow-sm"
                  : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Accessible Fullscreen Lightbox (Fixes Finding 8 & 14) */}
      {lightboxOpen && (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo gallery for ${vehicleTitle}`}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={safeImages[activeIndex]}
              alt={`${vehicleTitle} - Photo ${activeIndex + 1} of ${safeImages.length}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl border border-white/10"
            />

            <div className="mt-4 flex items-center gap-4 text-white">
              {safeImages.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous photograph"
                  className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              <span className="text-sm font-medium px-3 py-1 bg-white/10 rounded-full">
                Photo {activeIndex + 1} of {safeImages.length}
              </span>
              {safeImages.length > 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next photograph"
                  className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                aria-label="Close photo preview"
                className="ml-4 px-4 py-2 rounded-xl text-xs font-semibold bg-white/20 hover:bg-white/30 text-white min-h-[44px] flex items-center gap-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
