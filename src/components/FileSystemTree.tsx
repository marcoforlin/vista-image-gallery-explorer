
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react';

interface FileSystemNode {
  name: string;
  path: string;
  type: 'folder' | 'file';
  children?: FileSystemNode[];
}

interface FileSystemTreeProps {
  selectedFolder: string;
  onFolderSelect: (path: string) => void;
}

// Mock file system structure
const fileSystem: FileSystemNode[] = [
  {
    name: 'Photos',
    path: '/Photos',
    type: 'folder',
    children: [
      {
        name: 'Nature',
        path: '/Photos/Nature',
        type: 'folder',
        children: [
          { name: 'Landscapes', path: '/Photos/Nature/Landscapes', type: 'folder' },
          { name: 'Wildlife', path: '/Photos/Nature/Wildlife', type: 'folder' },
        ]
      },
      {
        name: 'Technology',
        path: '/Photos/Technology',
        type: 'folder',
        children: [
          { name: 'Computers', path: '/Photos/Technology/Computers', type: 'folder' },
          { name: 'Programming', path: '/Photos/Technology/Programming', type: 'folder' },
        ]
      },
      {
        name: 'Abstract',
        path: '/Photos/Abstract',
        type: 'folder',
      },
      {
        name: 'Architecture',
        path: '/Photos/Architecture',
        type: 'folder',
      }
    ]
  },
  {
    name: 'Documents',
    path: '/Documents',
    type: 'folder',
  },
  {
    name: 'Downloads',
    path: '/Downloads',
    type: 'folder',
  }
];

export const FileSystemTree: React.FC<FileSystemTreeProps> = ({
  selectedFolder,
  onFolderSelect
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['/Photos', '/Photos/Nature', '/Photos/Technology'])
  );

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderNode = (node: FileSystemNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.path);
    const isSelected = selectedFolder === node.path;
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.path}>
        <div
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 rounded-md mx-2 ${
            isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              onFolderSelect(node.path);
              if (hasChildren) {
                toggleFolder(node.path);
              }
            }
          }}
        >
          {hasChildren && (
            <div className="mr-1">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </div>
          )}
          {!hasChildren && <div className="w-5" />}
          
          <div className="mr-2">
            {node.type === 'folder' ? (
              isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />
            ) : null}
          </div>
          
          <span className="text-sm">{node.name}</span>
        </div>
        
        {isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-2">
      {fileSystem.map((node) => renderNode(node))}
    </div>
  );
};
