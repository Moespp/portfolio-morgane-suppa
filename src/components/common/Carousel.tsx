import { useState } from "react";

interface CarouselProps {
  images: string[];
  className?: string;
}

const Carousel = ({ images, className }: CarouselProps) => {
  const [currentImage, setCurrentImage] = useState(0);

  const handleClick = (index: number) => {
    setCurrentImage(index);
  };

  return (
    <div
      className={`flex flex-col gap-4 items-start justify-start ${className}`}
    >
      {images.map((image, index) => (
        <img
          key={index}
          src={image}
          alt="conception"
          className="w-full h-auto object-cover"
          onClick={() => handleClick(index)}
          style={{
            transform: `translateX(${index === currentImage ? "0" : "-100%"})`,
          }}
        />
      ))}
    </div>
  );
};

export default Carousel;
