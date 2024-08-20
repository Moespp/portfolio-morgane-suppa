import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "../../styles/animated-text.css";

interface AnimatedTextProps {
  words: string[];
  delay: number;
  displayDuration: number; // Durée d'affichage de chaque mot
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  words,
  delay,
  displayDuration,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wordRefs = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({ repeat: -1, repeatDelay: delay });

    // Animation du texte fixe lettre par lettre
    gsap.fromTo(
      containerRef.current.querySelector(".static-text"),
      { opacity: 0 },
      { opacity: 1, duration: 1 }
    );

    // Animation des mots lettre par lettre
    words.forEach((word, index) => {
      const wordElement = wordRefs.current[index];
      const letterElements = wordElement?.querySelectorAll(".letter");

      if (letterElements) {
        letterElements.forEach((letter, letterIndex) => {
          tl.fromTo(
            letter,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.2, ease: "power1.out" },
            `+=${index * (displayDuration + 1) + letterIndex * 0.05}`
          );
        });

        tl.to(
          letterElements,
          { opacity: 0, y: -20, duration: 0.2, ease: "power1.in" },
          `+=${displayDuration - 0.2}`
        );
      }
    });

    return () => {
      tl.kill();
    };
  }, [words, delay, displayDuration]);

  return (
    <div ref={containerRef} className="animated-text-container">
      <div className="static-text">Je suis</div>
      <div className="words-container">
        {words.map((word, index) => (
          <span
            key={index}
            ref={(el) => (wordRefs.current[index] = el!)}
            className="word"
          >
            {word.split("").map((letter, letterIndex) => (
              <span key={letterIndex} className="letter">
                {letter}
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnimatedText;
