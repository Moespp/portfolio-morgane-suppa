import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface TextRevealProps {
  words: string[];
  duration: number;
}

const TextReveal: React.FC<TextRevealProps> = ({ words, duration }) => {
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const tl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "power2.inOut" },
    });

    words.forEach((word) => {
      let localIndexWord = 0;

      tl.call(() => {
        if (textRef.current) {
          textRef.current.innerHTML = "";
        }
      }, [], "+=0");

      word.split("").forEach((letter) => {
        tl.call(() => {
          if (textRef.current) {
            const span = document.createElement("span");
            span.textContent = letter;
            span.style.display = "inline-block";
            span.style.opacity = "0";
            textRef.current.appendChild(span);

            gsap.to(span, {
              opacity: 1,
              duration: 0.2,
            });

            localIndexWord += 1;
          }
        }, [], "+=0.1");
      });

      tl.to(textRef.current, {
        duration: duration,
      });

      word.split("").reverse().forEach(() => {
        tl.call(() => {
          if (textRef.current && textRef.current.children.length > 0) {
            const span = textRef.current.children[textRef.current.children.length - 1] as HTMLElement;

            gsap.to(span, {
              opacity: 0,
              duration: 0.05,
              onComplete: () => {
                if (span.parentNode) {
                  span.parentNode.removeChild(span);
                }
              },
            });
          }
        }, [], "+=0.1");
      });
    });

    return () => {
      tl.kill();
    };
  }, [words, duration]);

  return (
    <div
      className="flex gap-1 h-[33px] items-center"
      style={{
        fontSize: "24px",
        fontWeight: "bold",
        whiteSpace: "nowrap",
      }}
    >
      Je suis{" "}
      <div
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        <div ref={textRef} style={{ display: "inline-block", width: 'fit-content' }} />
      </div>
    </div>
  );
};

export default TextReveal;
