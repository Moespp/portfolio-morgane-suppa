import { ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ArrowToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroSectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    heroSectionRef.current = document.getElementById("Hero");

    if (!heroSectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If less than 50% of the hero section is visible, show the ArrowToTop button
        setIsVisible(entry.intersectionRatio < 0.5);
      },
      { threshold: 0.5 }
    );

    observer.observe(heroSectionRef.current);

    // Cleanup the observer when the component unmounts
    return () => {
      if (heroSectionRef.current) {
        observer.unobserve(heroSectionRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`fixed bottom-12 right-12 z-50 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <button
        className="flex items-center justify-center rounded-full bg-black2 p-2 text-white2 transition-all duration-300 bg-black"
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
      >
        <ChevronUp size={24} className="-translate-y-0.5" />
      </button>
    </div>
  );
};

export default ArrowToTop;
