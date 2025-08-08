"use client";

import { useState, useRef, useEffect } from "react";

export default function ImageMagnifier({
  src,
  alt,
  width = "100%",
  height = "100%",
  magnifierSize = 150,
  zoomLevel = 2.5,
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = window.matchMedia("(max-width: 768px)").matches;
  }, []);

  const updateMagnifierPosition = (clientX, clientY) => {
    // Get image position on screen
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();

    // Calculate mouse position relative to image
    const x = clientX - left;
    const y = clientY - top;

    // Handle position limits
    const xPercent = Math.max(0, Math.min(1, x / width));
    const yPercent = Math.max(0, Math.min(1, y / height));

    // Update magnifier position
    setPosition({
      x,
      y,
      backgroundX: xPercent * 100,
      backgroundY: yPercent * 100,
    });
  };

  const handleMouseEnter = () => {
    if (!isMobile.current) {
      setShowMagnifier(true);
    }
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleMouseMove = (e) => {
    e.preventDefault();
    updateMagnifierPosition(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    // Get first touch
    const touch = e.touches[0];
    setTouchPosition({ x: touch.clientX, y: touch.clientY });
    updateMagnifierPosition(touch.clientX, touch.clientY);
    setShowMagnifier(true);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    // Only update magnifier if the touch has moved significantly
    const dx = Math.abs(touch.clientX - touchPosition.x);
    const dy = Math.abs(touch.clientY - touchPosition.y);
    if (dx > 5 || dy > 5) {
      updateMagnifierPosition(touch.clientX, touch.clientY);
      setTouchPosition({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = () => {
    setShowMagnifier(false);
  };

  return (
    <div
      className="image-magnifier-container"
      ref={containerRef}
      style={{
        width,
        height,
        cursor: "none",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img src={src} alt={alt} className="w-full h-full object-contain" />

      <div
        className="magnifier-glass"
        style={{
          left: `${position.x - magnifierSize / 2}px`,
          top: `${position.y - magnifierSize / 2}px`,
          backgroundImage: `url(${src})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: `${position.backgroundX}% ${position.backgroundY}%`,
          backgroundSize: `${zoomLevel * 100}%`,
          width: `${magnifierSize}px`,
          height: `${magnifierSize}px`,
          opacity: showMagnifier ? 1 : 0,
        }}
      />
    </div>
  );
}
