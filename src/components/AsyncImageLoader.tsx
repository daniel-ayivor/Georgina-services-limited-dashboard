// components/AsyncImageLoader.tsx or just embed it in your file
import React, { useState } from 'react';
import { Package, RefreshCw } from 'lucide-react';

interface AsyncImageLoaderProps {
  src: string;
  alt: string;
  className: string;
}

const AsyncImageLoader: React.FC<AsyncImageLoaderProps> = ({ src, alt, className }) => {
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isError, setIsError] = useState(false);

  // Helper function to handle the URL logic
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "/placeholder.svg";
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
    
    // Assuming VITE_API_URL is defined somewhere
    const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8003';
    const filename = imagePath.split(/[\\/]/).pop();
    return `${BACKEND_URL}/uploads/products/${filename}`;
  };

  const finalSrc = getImageUrl(src);

  return (
    <div className={`relative ${className}`}>
      {isLoadingImage && !isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
          {/* Use a simple icon or spinner as a placeholder while loading */}
          <RefreshCw className="w-4 h-4 text-gray-500 animate-spin" /> 
        </div>
      )}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-md">
          {/* Fallback icon if image fails to load */}
          <Package className="w-4 h-4 text-gray-400" />
        </div>
      )}
      <img
        src={finalSrc}
        alt={alt}
        className={`${className} ${isLoadingImage ? 'hidden' : 'block'} ${isError ? 'hidden' : 'block'}`}
        onLoad={() => {
            console.log(`Image loaded: ${finalSrc}`);
            setIsLoadingImage(false);
        }}
        onError={(e) => {
            console.error(`Image failed to load: ${finalSrc}`, e);
            setIsLoadingImage(false);
            setIsError(true);
        }}
        style={{ transition: 'opacity 0.3s ease-in-out' }}
      />
    </div>
  );
};

export default AsyncImageLoader; // if in a separate file