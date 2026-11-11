"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface GalleryProps {
  images: string[];
  vehicleTitle: string;
}

export function VehicleGallery({ images, vehicleTitle }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeImages = images && images.length > 0 ? images : ["/images/car-placeholder.jpg"];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Image Frame (4:3 aspect) */}
      <div className="relative aspect-[4/3] w-full rounded-card overflow-hidden bg-background-tertiary border border-border group">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={safeImages[activeIndex]}
          alt={`${vehicleTitle} - Photo ${activeIndex + 1}`}
          className="w-full h-full object-cover cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        />

        {/* Arrow Controls */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-text-primary hover:bg-white shadow-md transition-all opacity-90 hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 text-text-primary hover:bg-white shadow-md transition-all opacity-90 hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter and Fullscreen trigger */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-semibold text-white bg-black/70 rounded-full backdrop-blur-sm">
            {activeIndex + 1} / {safeImages.length}
          </span>
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="p-1.5 rounded-full bg-black/70 text-white hover:bg-black backdrop-blur-sm transition-colors"
            title="Expand Fullscreen"
            aria-label="Expand Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Thumbnails Strip */}
      {safeImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5">
          {safeImages.map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-20 sm:w-24 aspect-[4/3] rounded overflow-hidden border-2 transition-all ${
                activeIndex === idx
                  ? "border-action ring-1 ring-action"
                  : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox / Modal View */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={safeImages[activeIndex]}
              alt={`${vehicleTitle} Fullscreen`}
              className="max-w-full max-h-[80vh] object-contain rounded-card"
            />

            <div className="mt-4 flex items-center gap-4 text-white">
              {safeImages.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              <span className="text-sm font-semibold">
                Photo {activeIndex + 1} of {safeImages.length}
              </span>
              {safeImages.length > 1 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="ml-6 px-4 py-1.5 text-xs font-semibold bg-white/20 hover:bg-white/30 rounded-btn text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
