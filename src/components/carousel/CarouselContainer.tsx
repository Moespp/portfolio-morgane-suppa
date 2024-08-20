import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CarouselComponent from "./CarouselComponent";

interface CarouselContainerProps {
  images: string[];
  className?: string;
}

const CarouselContainer: React.FC<CarouselContainerProps> = ({
  images,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number | null>(null);
  const currentXRef = useRef<number | null>(null);
  const draggingRef = useRef<boolean>(false);

  useEffect(() => {
    if (carouselRef.current) {
      gsap.to(carouselRef.current, {
        duration: 0.05,
        x: -currentIndex * 100 + "%",
        ease: "power2.linear",
      });
    }
  }, [currentIndex]);

  const handleIndexChange = (index: number) => {
    if (index < 0) {
      setCurrentIndex(images.length - 1);
    } else if (index >= images.length) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(index);
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    draggingRef.current = true;
    startXRef.current = event.clientX;
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!draggingRef.current) return;
    currentXRef.current = event.clientX;
  };

  const handleMouseUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    if (startXRef.current && currentXRef.current) {
      const diff = startXRef.current - currentXRef.current;
      if (diff > 50) {
        handleIndexChange(currentIndex + 1);
      } else if (diff < -50) {
        handleIndexChange(currentIndex - 1);
      }
    }

    startXRef.current = null;
    currentXRef.current = null;
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    draggingRef.current = true;
    startXRef.current = event.touches[0].clientX;
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (!draggingRef.current) return;
    currentXRef.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;

    if (startXRef.current && currentXRef.current) {
      const diff = startXRef.current - currentXRef.current;
      if (diff > 50) {
        handleIndexChange(currentIndex + 1);
      } else if (diff < -50) {
        handleIndexChange(currentIndex - 1);
      }
    }

    startXRef.current = null;
    currentXRef.current = null;
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex]);

  return (
    <CarouselComponent
      images={images}
      setCurrentIndex={handleIndexChange}
      currentIndex={currentIndex}
      carouselRef={carouselRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className={className}
    />
  );
};

export default CarouselContainer;
