import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface TextRevealProps {
  words: string[];
}

const TextReveal: React.FC<TextRevealProps> = ({ words }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const tl = useRef<GSAPTimeline>(
    gsap.timeline({ repeat: -1, repeatDelay: 1 })
  );

  useEffect(() => {
    const textEl = textRef.current;
    if (!textEl) return;

    words.forEach((word, index) => {
      const wordContainer = document.createElement("div");
      wordContainer.style.display = "inline-block";
      wordContainer.style.position = "absolute";
      wordContainer.style.opacity = "0";
      wordContainer.style.whiteSpace = "nowrap";

      word.split("").forEach((letter, letterIndex) => {
        const letterSpan = document.createElement("span");
        letterSpan.textContent = letter;
        letterSpan.style.display = "inline-block";
        letterSpan.style.position = "relative";
        letterSpan.style.transform = "translateY(100%)";
        wordContainer.appendChild(letterSpan);

        tl.current.to(
          letterSpan,
          {
            opacity: 1,
            y: "0%",
            duration: 0.4,
            ease: "power2.out",
            transform: "translateY(0%)",
          },
          index * 1.5 + letterIndex * 0.05
        );
      });

      tl.current.to(
        wordContainer,
        {
          opacity: 1,
          duration: 0.1,
        },
        index * 1.5
      );

      tl.current.to(
        wordContainer,
        {
          opacity: 0,
          y: "-100%",
          duration: 0.5,
          delay: 1,
        },
        index * 1.5 + word.length * 0.05
      );

      textEl.appendChild(wordContainer);
    });
  }, [words]);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "top",
      }}
    >
      <span>Je suis </span>
      <div
        ref={textRef}
        style={{
          display: "inline-block",
          position: "relative",
          height: "1em",
          width: "10rem",
          lineHeight: "1em",
          verticalAlign: "top",
          color: "black",
        }}
      />
    </div>
  );
};

export default TextReveal;
