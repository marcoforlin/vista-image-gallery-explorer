
import React, { useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';
import { X, Save } from 'lucide-react';

interface ImageCanvasProps {
  image: {
    id: number;
    src: string;
    alt: string;
    title: string;
  };
  onClose: () => void;
}

export const ImageCanvas: React.FC<ImageCanvasProps> = ({ image, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [currentPath, setCurrentPath] = useState<Array<{x: number, y: number}>>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
    });

    // Load the image as background
    FabricImage.fromURL(image.src).then((img) => {
      const canvasWidth = 800;
      const canvasHeight = 600;
      const imgAspect = (img.width || 1) / (img.height || 1);
      const canvasAspect = canvasWidth / canvasHeight;

      let renderWidth, renderHeight;
      if (imgAspect > canvasAspect) {
        renderWidth = canvasWidth;
        renderHeight = canvasWidth / imgAspect;
      } else {
        renderHeight = canvasHeight;
        renderWidth = canvasHeight * imgAspect;
      }

      img.set({
        scaleX: renderWidth / (img.width || 1),
        scaleY: renderHeight / (img.height || 1),
        originX: 'center',
        originY: 'center',
        left: canvasWidth / 2,
        top: canvasHeight / 2,
        selectable: false,
        evented: false
      });

      canvas.backgroundImage = img;
      canvas.renderAll();
    });

    // Enable free drawing
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.color = '#ff0000';
    canvas.freeDrawingBrush.width = 3;

    setFabricCanvas(canvas);

    // Handle drawing events
    canvas.on('path:created', (e) => {
      const pathObject = e.path;
      if (pathObject) {
        // Extract coordinates from the path by accessing the points
        const coordinates: Array<{x: number, y: number}> = [];
        
        // For free drawing paths, we can get the path data
        if (pathObject.left !== undefined && pathObject.top !== undefined) {
          coordinates.push({ 
            x: pathObject.left, 
            y: pathObject.top 
          });
        }
        
        setCurrentPath(coordinates);
        saveMaskToFile(coordinates);
      }
    });

    return () => {
      canvas.dispose();
    };
  }, [image.src]);

  const saveMaskToFile = (coordinates: Array<{x: number, y: number}>) => {
    const maskData = coordinates.map(point => `${point.x},${point.y}`).join('\n');
    const fileName = `${image.title.replace(/[^a-zA-Z0-9]/g, '_')}_mask.txt`;
    
    // Create and download the file
    const blob = new Blob([maskData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log(`Mask saved for ${image.title}:`, coordinates);
  };

  const handleSave = () => {
    if (currentPath.length > 0) {
      saveMaskToFile(currentPath);
    }
    onClose();
  };

  const handleClear = () => {
    if (fabricCanvas) {
      fabricCanvas.clear();
      // Reload background image
      FabricImage.fromURL(image.src).then((img) => {
        const canvasWidth = 800;
        const canvasHeight = 600;
        const imgAspect = (img.width || 1) / (img.height || 1);
        const canvasAspect = canvasWidth / canvasHeight;

        let renderWidth, renderHeight;
        if (imgAspect > canvasAspect) {
          renderWidth = canvasWidth;
          renderHeight = canvasWidth / imgAspect;
        } else {
          renderHeight = canvasHeight;
          renderWidth = canvasHeight * imgAspect;
        }

        img.set({
          scaleX: renderWidth / (img.width || 1),
          scaleY: renderHeight / (img.height || 1),
          originX: 'center',
          originY: 'center',
          left: canvasWidth / 2,
          top: canvasHeight / 2,
          selectable: false,
          evented: false
        });

        fabricCanvas.backgroundImage = img;
        fabricCanvas.renderAll();
      });
      setCurrentPath([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{image.title}</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleClear}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              className="flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              <Save size={16} className="mr-1" />
              Save & Close
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="border border-gray-300 rounded">
          <canvas ref={canvasRef} className="max-w-full" />
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          <p>Draw on the image to create a mask. The coordinates will be saved to a text file when you finish drawing or close the editor.</p>
        </div>
      </div>
    </div>
  );
};
