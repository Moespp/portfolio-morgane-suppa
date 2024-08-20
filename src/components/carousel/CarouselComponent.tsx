import "./style-carousel.css";
import CarouselItem from "./CarouselItem";

interface CarrouselComponentProps {
  images: string[];
  setCurrentIndex: (index: number) => void;
  currentIndex: number;
  carouselRef: React.RefObject<HTMLDivElement>;
  onMouseDown: (event: React.MouseEvent) => void;
  onTouchStart: (event: React.TouchEvent) => void;
  className?: string;
}

const CarouselComponent = ({
  images,
  setCurrentIndex,
  currentIndex,
  carouselRef,
  onMouseDown,
  onTouchStart,
  className,
}: CarrouselComponentProps) => {
  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      <div
        className="carousel-container relative"
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <button
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className="absolute z-20 top-1/2 -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 p-2 rounded-md"
        >
          {"<"}
        </button>
        <div className="carousel" ref={carouselRef}>
          {images.map((image, index) => (
            <CarouselItem
              key={index}
              image={image}
              index={index}
              currentIndex={currentIndex}
            />
          ))}
        </div>
        <button
          onClick={() => setCurrentIndex(currentIndex + 1)}
          className="absolute z-20 top-1/2 -translate-y-1/2 right-0 text-white text-2xl bg-black bg-opacity-50 p-2 rounded-md"
        >
          {">"}
        </button>
        <div className="index-indicator-container">
          {images.map((_, index) => (
            <div
              key={index}
              className={`index-indicator ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselComponent;
