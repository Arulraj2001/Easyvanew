"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Crop, ZoomIn, ZoomOut, Check, RotateCw, Sparkles, Loader2 } from "lucide-react";

export type AspectRatioType = "FREE" | "1:1" | "4:5" | "16:9";

interface ImageCropperModalProps {
  imageFile: File;
  onCropComplete: (croppedBlob: Blob, previewUrl: string) => void;
  onCancel: () => void;
}

export default function ImageCropperModal({
  imageFile,
  onCropComplete,
  onCancel,
}: ImageCropperModalProps) {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>("1:1");
  const [zoom, setZoom] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState<string>("");

  // Crop rectangle in percentages (0 to 100)
  const [crop, setCrop] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeHandle, setActiveHandle] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(imageFile);
    setImageSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  // Adjust crop dimensions when aspect ratio changes
  useEffect(() => {
    if (aspectRatio === "FREE") return;

    if (aspectRatio === "1:1") {
      setCrop((prev) => {
        const size = Math.min(prev.width, prev.height);
        return { ...prev, width: size, height: size };
      });
    } else if (aspectRatio === "4:5") {
      setCrop((prev) => {
        const width = Math.min(prev.width, 70);
        const height = Math.min(100, width * 1.25);
        return { ...prev, width, height };
      });
    } else if (aspectRatio === "16:9") {
      setCrop((prev) => {
        const width = Math.min(90, prev.width);
        const height = Math.min(100, width * 0.5625);
        return { ...prev, width, height };
      });
    }
  }, [aspectRatio]);

  // Dragging crop box
  const handleMouseDown = (e: React.MouseEvent, handle: string | null = null) => {
    e.preventDefault();
    setIsDragging(true);
    setActiveHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

    setDragStart({ x: e.clientX, y: e.clientY });

    setCrop((prev) => {
      let newX = prev.x;
      let newY = prev.y;
      let newW = prev.width;
      let newH = prev.height;

      if (!activeHandle) {
        // Moving the entire box
        newX = Math.max(0, Math.min(100 - prev.width, prev.x + deltaX));
        newY = Math.max(0, Math.min(100 - prev.height, prev.y + deltaY));
      } else if (activeHandle === "se") {
        // Resize Southeast
        newW = Math.max(20, Math.min(100 - prev.x, prev.width + deltaX));
        if (aspectRatio === "1:1") {
          newH = newW;
        } else if (aspectRatio === "4:5") {
          newH = newW * 1.25;
        } else if (aspectRatio === "16:9") {
          newH = newW * 0.5625;
        } else {
          newH = Math.max(20, Math.min(100 - prev.y, prev.height + deltaY));
        }
      }

      return { x: newX, y: newY, width: newW, height: newH };
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setActiveHandle(null);
  };

  // Perform client-side cropping and auto-compression to high-fidelity WebP
  const handleConfirmCrop = async () => {
    if (!imageRef.current) return;
    setIsProcessing(true);

    try {
      const img = imageRef.current;
      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;

      // Calculate pixel coordinates from percentages
      const cropPxX = (crop.x / 100) * naturalW;
      const cropPxY = (crop.y / 100) * naturalH;
      const cropPxW = (crop.width / 100) * naturalW;
      const cropPxH = (crop.height / 100) * naturalH;

      // Limit max output dimension to 1200px to maintain high resolution while keeping file size small
      const maxDim = 1200;
      let targetW = cropPxW;
      let targetH = cropPxH;

      if (targetW > maxDim || targetH > maxDim) {
        if (targetW > targetH) {
          targetH = Math.round((targetH * maxDim) / targetW);
          targetW = maxDim;
        } else {
          targetW = Math.round((targetW * maxDim) / targetH);
          targetH = maxDim;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not create canvas context");

      // High quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        img,
        cropPxX,
        cropPxY,
        cropPxW,
        cropPxH,
        0,
        0,
        targetW,
        targetH
      );

      // Convert to WebP format with 82% quality (shrinks 5MB-10MB camera shot to ~100KB-150KB)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const preview = URL.createObjectURL(blob);
            onCropComplete(blob, preview);
          }
          setIsProcessing(false);
        },
        "image/webp",
        0.82
      );
    } catch (err) {
      console.error("Cropping error:", err);
      setIsProcessing(false);
      alert("Failed to process cropped image.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-start sm:items-center p-2.5 sm:p-5 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-easyva-purple-700 flex items-center justify-center font-bold">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                Crop & Auto-Compress Product Photo
              </h3>
              <p className="text-[11px] text-slate-400">
                Reduces file size automatically to WebP while preserving high clarity.
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Aspect Ratio Presets Bar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600 mr-1 text-[11px] uppercase tracking-wider">
              Ratio:
            </span>
            {(["FREE", "1:1", "4:5", "16:9"] as AspectRatioType[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setAspectRatio(r)}
                className={`py-1 px-3 rounded-lg font-bold text-xs transition-all ${
                  aspectRatio === r
                    ? "bg-easyva-purple-600 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {r === "FREE" ? "Free / Custom" : r === "1:1" ? "1:1 Square" : r === "4:5" ? "4:5 Portrait" : "16:9 Banner"}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-easyva-purple-600" />
            <span>Target: ~120KB WebP</span>
          </div>
        </div>

        {/* Image Cropping Canvas Area */}
        <div className="flex-1 overflow-hidden p-4 bg-slate-900 flex items-center justify-center relative select-none">
          {imageSrc && (
            <div
              ref={containerRef}
              className="relative max-w-full max-h-[50vh] overflow-hidden"
              style={{ transform: `scale(${zoom})`, transition: "transform 0.1s ease" }}
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Source preview"
                className="max-w-full max-h-[50vh] object-contain pointer-events-none"
              />

              {/* Crop Overlay Mask */}
              <div
                style={{
                  left: `${crop.x}%`,
                  top: `${crop.y}%`,
                  width: `${crop.width}%`,
                  height: `${crop.height}%`,
                }}
                onMouseDown={(e) => handleMouseDown(e, null)}
                className="absolute border-2 border-white/90 shadow-2xl cursor-move bg-easyva-purple-600/10 ring-4000 ring-slate-950/70"
              >
                {/* 3x3 Grid Guidelines */}
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none">
                  <div className="border-r border-b border-white/30"></div>
                  <div className="border-r border-b border-white/30"></div>
                  <div className="border-b border-white/30"></div>
                  <div className="border-r border-b border-white/30"></div>
                  <div className="border-r border-b border-white/30"></div>
                  <div className="border-b border-white/30"></div>
                  <div className="border-r border-white/30"></div>
                  <div className="border-r border-white/30"></div>
                  <div></div>
                </div>

                {/* Resize Handle at Bottom-Right */}
                <div
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, "se");
                  }}
                  className="absolute bottom-0 right-0 w-5 h-5 bg-white border-2 border-easyva-purple-600 cursor-nwse-resize rounded-tl shadow-md"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] text-slate-400">Zoom:</span>
            <input
              type="range"
              min="1"
              max="2.5"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-24 sm:w-32 accent-easyva-purple-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="py-2 px-4 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmCrop}
              disabled={isProcessing}
              className="py-2 px-5 rounded-xl text-xs font-extrabold text-white bg-easyva-purple-600 hover:bg-easyva-purple-700 shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Optimizing...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply & Upload WebP</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
