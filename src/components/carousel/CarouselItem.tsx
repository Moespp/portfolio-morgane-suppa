interface CarouselItemProps {
  image: string;
  index: number;
  currentIndex: number;
}

const CarouselItem = ({ image, index, currentIndex }: CarouselItemProps) => {
  return (
    <div className={`carousel-slide ${index === currentIndex ? "active" : ""}`}>
      <img src={image} alt={`Affiche ${index + 1}`} />
    </div>
  );
};

export default CarouselItem;
