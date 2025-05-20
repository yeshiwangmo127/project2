'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const images = [
  '/images/slider1.jpg',
  '/images/slider2.webp',
  '/images/slider3.jpg',
];

export default function CursorSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000); // Increased interval to 5 seconds for better viewing

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[600px]">
      <Image
        src={images[current]}
        alt="Slider Image"
        fill
        className="object-cover w-full"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40">
        <div className="container mx-auto h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">Welcome to Our Hospital</h1>
            <p className="text-xl mb-8">Providing Quality Healthcare Services</p>
          </div>
        </div>
      </div>
    </div>
  );
}
