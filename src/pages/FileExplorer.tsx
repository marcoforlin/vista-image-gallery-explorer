
import React, { useState } from 'react';
import { FileSystemTree } from '../components/FileSystemTree';
import { ImageGallery } from '../components/ImageGallery';

const FileExplorer = () => {
  const [selectedFolder, setSelectedFolder] = useState<string>('/Photos');
  const [imagesPerRow, setImagesPerRow] = useState<number>(3);
  const [currentPage, setCurrentPage] = useState<number>(1);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* File System Explorer */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Explorer</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <FileSystemTree 
            selectedFolder={selectedFolder}
            onFolderSelect={setSelectedFolder}
          />
        </div>
      </div>

      {/* Image Gallery */}
      <div className="flex-1 flex flex-col">
        {/* Header with controls */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-medium text-gray-800">
              {selectedFolder}
            </h3>
            <div className="flex items-center space-x-2">
              <label htmlFor="columns" className="text-sm text-gray-600">
                Images per row:
              </label>
              <input
                id="columns"
                type="number"
                min="1"
                max="6"
                value={imagesPerRow}
                onChange={(e) => {
                  const value = Math.max(1, Math.min(6, parseInt(e.target.value) || 1));
                  setImagesPerRow(value);
                  setCurrentPage(1); // Reset to first page when changing layout
                }}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Gallery Content */}
        <div className="flex-1 p-6">
          <ImageGallery
            folder={selectedFolder}
            imagesPerRow={imagesPerRow}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default FileExplorer;
