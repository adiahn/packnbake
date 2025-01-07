import { useState } from 'react';

export default function ProductGallery({ images, mainImage }) {
  const [selectedImage, setSelectedImage] = useState(mainImage);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const allImages = [mainImage, ...(images || [])];

  const handleMouseMove = (e) => {
    if (!isZoomed) return;

    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setMousePosition({ x, y });
  };

  return (
    <div className="space-y-4">
      <div 
        className="relative overflow-hidden rounded-lg bg-gray-100 aspect-square"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={selectedImage}
          alt="Product"
          className={`w-full h-full object-cover transition-transform duration-200 ${
            isZoomed ? 'scale-150' : ''
          }`}
          style={isZoomed ? {
            transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
          } : undefined}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {allImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(image)}
            className={`relative aspect-square rounded-md overflow-hidden ${
              selectedImage === image ? 'ring-2 ring-primary' : ''
            }`}
          >
            <img
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
} 