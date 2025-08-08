"use client";

import { useEffect, useRef } from "react";

export default function LiquidBackground() {
  const blob1Ref = useRef(null);
  const blob2Ref = useRef(null);
  const blob3Ref = useRef(null);
  const blob4Ref = useRef(null);

  useEffect(() => {
    // Mouse parallax effect
    const handleMouseMove = (e) => {
      if (
        !blob1Ref.current ||
        !blob2Ref.current ||
        !blob3Ref.current ||
        !blob4Ref.current
      )
        return;

      const { clientX, clientY } = e;
      const x = clientX / window.innerWidth;
      const y = clientY / window.innerHeight;

      // Parallax movement based on mouse position
      blob1Ref.current.style.transform = `translate(${x * 30}px, ${y * 30}px) rotate(${x * 10}deg)`;
      blob2Ref.current.style.transform = `translate(${-x * 30}px, ${-y * 30}px) rotate(${-y * 10}deg)`;
      blob3Ref.current.style.transform = `translate(${x * -20}px, ${y * 20}px) rotate(${x * -5}deg)`;
      blob4Ref.current.style.transform = `translate(${-x * 20}px, ${y * -20}px) rotate(${y * 5}deg)`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Slow initial fade-in animation
    if (
      blob1Ref.current &&
      blob2Ref.current &&
      blob3Ref.current &&
      blob4Ref.current
    ) {
      [
        blob1Ref.current,
        blob2Ref.current,
        blob3Ref.current,
        blob4Ref.current,
      ].forEach((blob, index) => {
        blob.style.opacity = "0";
        blob.style.transition = "opacity 1.5s ease";

        setTimeout(
          () => {
            blob.style.opacity =
              blob.className.includes("liquid-blob-1") ||
              blob.className.includes("liquid-blob-2")
                ? "0.07"
                : "0.05";
          },
          300 * (index + 1)
        ); // Staggered fade-in
      });
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="liquid-bg">
      <div ref={blob1Ref} className="liquid-blob liquid-blob-1"></div>
      <div ref={blob2Ref} className="liquid-blob liquid-blob-2"></div>
      <div ref={blob3Ref} className="liquid-blob liquid-blob-3"></div>
      <div ref={blob4Ref} className="liquid-blob liquid-blob-4"></div>
    </div>
  );
}
