
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { ImageCanvas } from './ImageCanvas';

interface ImageGalleryProps {
  folder: string;
  imagesPerRow: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

// Mock image data using the placeholder images provided
const mockImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800",
    alt: "Woman sitting on a bed using a laptop",
    title: "Remote Work"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800",
    alt: "Turned on gray laptop computer",
    title: "Gray Laptop"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    alt: "Macro photography of black circuit board",
    title: "Circuit Board"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
    alt: "Monitor showing Java programming",
    title: "Programming"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1486312338219-ce6a32c6f44d?w=800",
    alt: "Person using MacBook Pro",
    title: "MacBook Pro"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
    alt: "Woman in white long sleeve shirt using black laptop computer",
    title: "Working Professional"
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
    alt: "White robot near brown wall",
    title: "AI Robot"
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
    alt: "Matrix movie still",
    title: "Matrix Code"
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800",
    alt: "Gray and black laptop computer on surface",
    title: "Modern Laptop"
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800",
    alt: "Colorful software or web code on a computer monitor",
    title: "Code Display"
  }
];

// Function to get images based on folder (simulate different folders having different images)
const getImagesForFolder = (folder: string) => {
  // For demo purposes, return all images but you could filter based on folder
  return mockImages;
};

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  folder,
  imagesPerRow,
  currentPage,
  onPageChange
}) => {
  const [editingImage, setEditingImage] = useState<typeof mockImages[0] | null>(null);
  
  const images = getImagesForFolder(folder);
  const imagesPerPage = 12; // Display a fixed number of images per page for consistent pagination
  const totalPages = Math.ceil(images.length / imagesPerPage);
  
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = startIndex + imagesPerPage;
  const currentImages = images.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Image Grid */}
      <div className="flex-1">
        <div 
          className="grid gap-4 h-fit"
          style={{ 
            gridTemplateColumns: `repeat(${imagesPerRow}, 1fr)`,
          }}
        >
          {currentImages.map((image) => (
            <div
              key={image.id}
              className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <h4 className="text-sm font-medium text-gray-800 truncate">
                  {image.title}
                </h4>
              </div>
              
              {/* Hover overlay with drawing button */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => setEditingImage(image)}
                    className="flex items-center bg-white bg-opacity-90 px-3 py-2 rounded-full text-sm font-medium text-gray-800 hover:bg-opacity-100 transition-all"
                  >
                    <Edit size={16} className="mr-1" />
                    Draw Mask
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-6">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({images.length} images total)
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>
            
            <span className="px-3 py-2 text-sm text-gray-600">
              {startIndex + 1}-{Math.min(endIndex, images.length)} of {images.length}
            </span>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      )}
      
      {/* Drawing Canvas Modal */}
      {editingImage && (
        <ImageCanvas
          image={editingImage}
          onClose={() => setEditingImage(null)}
        />
      )}
    </div>
  );
};
