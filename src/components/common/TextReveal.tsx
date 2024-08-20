import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface TextRevealProps {
  words: string[];
  duration: number; // Duration each word should be displayed (in seconds)
}

const TextReveal: React.FC<TextRevealProps> = ({ words, duration }) => {
  const textRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "power2.inOut" },
    });

    words.forEach((word) => {
      tl.call(() => {
        if (textRef.current) {
          textRef.current.innerHTML = ""; // Clear the existing letters before the next word

          const letters = word.split("").map((letter) => {
            const span = document.createElement("span");
            span.textContent = letter;
            span.style.display = "inline-block";
            span.style.opacity = "0";
            span.style.transform = "translateY(20px)";
            span.style.color = "#a46552";
            textRef.current!.appendChild(span);
            return span;
          });

          const totalWidth = textRef.current.offsetWidth;
          gsap.to(containerRef.current, {
            width: totalWidth,
            duration: 0.5,
          });

          gsap.to(letters, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.05, // Stagger effect for letters
          });
        }
      })
        .to(textRef.current, {
          duration: duration - 1, // Hold the word in place
        })
        .to(textRef.current!.querySelectorAll("span"), {
          y: -20, // Move letters upwards
          opacity: 0,
          duration: 0.5,
          stagger: 0.05, // Stagger effect for letters on exit
        })
        .call(() => {
          if (containerRef.current) {
            gsap.to(containerRef.current, {
              width: 0,
              duration: 0.5,
            });
          }
        });
    });

    return () => {
      tl.kill(); // Clean up the timeline on unmount
    };
  }, [words, duration]);

  return (
    <div
      className="flex gap-1 h-[33px]"
      style={{
        fontSize: "24px",
        fontWeight: "bold",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      Je suis{" "}
      <div
        ref={containerRef}
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          overflow: "hidden",
          width: 0, // Initial width set to 0 for animation
        }}
      >
        <div ref={textRef} style={{ display: "inline-block" }} />
      </div>
    </div>
  );
};

export default TextReveal;
