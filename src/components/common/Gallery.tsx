// create a gallery component

interface GalleryProps {
  images: string[];
  className?: string;
}

const Gallery = ({ images, className }: GalleryProps) => {
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
        />
      ))}
    </div>
  );
};

export default Gallery;