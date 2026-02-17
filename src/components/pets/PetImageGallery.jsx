import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PLACEHOLDER = {
  dog: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80',
  rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&q=80',
  bird: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&q=80',
  other: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=800&q=80',
};

export default function PetImageGallery({ pet }) {
  const allImages = [
    ...(pet.photo_url ? [pet.photo_url] : []),
    ...(pet.photo_urls || []),
  ].filter(Boolean);

  const images = allImages.length > 0
    ? allImages
    : [PLACEHOLDER[pet.species] || PLACEHOLDER.other];

  const [active, setActive] = useState(0);

  const prev = () => setActive(i => (i - 1 + images.length) % images.length);
  const next = () => setActive(i => (i + 1) % images.length);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3]">
        <img
          src={images[active]}
          alt={`${pet.name} photo ${active + 1}`}
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {active + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden ring-2 transition-all ${
                i === active ? 'ring-green-500 scale-105' : 'ring-transparent hover:ring-gray-300'
              }`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}