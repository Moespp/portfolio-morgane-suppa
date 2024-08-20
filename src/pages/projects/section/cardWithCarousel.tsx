import Bento from "../../../components/bentos/Bento";
import CarouselContainer from "../../../components/carousel/CarouselContainer";

interface CardWithCarouselProps {
  title: string;
  description: string[];
  carouselImages: string[];
  reverse?: boolean;
  className?: string;
}

const CardWithCarousel = ({
  title,
  description,
  carouselImages,
  reverse,
  className,
}: CardWithCarouselProps) => {
  return (
    <div
      className={`flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-4 items-center ${carouselImages.length > 1 ? "justify-start" : "mx-auto w-full"} ${className}`}
    >
      <Bento
        className={`w-full ${carouselImages.length > 1 ? "md:w-1/2" : ""}`}
      >
        <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
        <ul className="list-disc list-inside">
          {Array.isArray(description) ? (
            description.map((description, index) => (
              <li key={index}>{description}</li>
            ))
          ) : (
            <li>Aucune description disponible</li>
          )}
        </ul>
      </Bento>
      {carouselImages.length > 1 && (
        <CarouselContainer
          images={carouselImages}
          className="w-full md:w-1/2"
        />
      )}{" "}
    </div>
  );
};

export default CardWithCarousel;
