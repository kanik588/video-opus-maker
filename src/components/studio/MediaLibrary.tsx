import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Image, Video, Plus } from 'lucide-react';
import { MediaItem } from '../VideoStudio';

interface MediaLibraryProps {
  items: MediaItem[];
  onFileUpload: (files: FileList) => void;
  onDragStart: (item: MediaItem) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  items,
  onFileUpload,
  onDragStart,
  fileInputRef
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      console.log('📁 Media Library: Files dropped', files.length);
      onFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleMediaDragStart = (e: React.DragEvent, item: MediaItem) => {
    console.log('📁 Media Library: Drag start', item);
    onDragStart(item);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-studio-panel-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-foreground">Media Library</h2>
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="bg-primary hover:bg-primary-glow"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        
        {/* Upload Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="studio-drop-zone border-2 border-dashed border-studio-panel-border rounded-lg p-4 text-center hover:border-studio-drop-zone transition-colors"
        >
          <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Drop files here or{' '}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-primary hover:text-primary-glow underline"
            >
              browse
            </button>
          </p>
        </div>
      </div>

      {/* Media Grid */}
      <div className="flex-1 p-4 overflow-y-auto studio-scrollbar">
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground mt-8">
            <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No media files yet</p>
            <p className="text-xs mt-1">Upload images or videos to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleMediaDragStart(e, item)}
                className="studio-panel p-2 cursor-move hover:shadow-studio transition-all studio-animate group"
                title={item.name}
              >
                <div className="aspect-square rounded-md overflow-hidden bg-muted mb-2 relative">
                  {item.type === 'image' ? (
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Video className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  
                  {/* Type indicator */}
                  <div className="absolute top-1 right-1 bg-black/70 rounded px-1 py-0.5">
                    {item.type === 'image' ? (
                      <Image className="w-3 h-3 text-white" />
                    ) : (
                      <Video className="w-3 h-3 text-white" />
                    )}
                  </div>

                  {/* Duration indicator for videos */}
                  {item.type === 'video' && item.duration && (
                    <div className="absolute bottom-1 right-1 bg-black/70 rounded px-1 py-0.5 text-xs text-white">
                      {item.duration}s
                    </div>
                  )}
                </div>
                
                <p className="text-xs text-foreground truncate group-hover:text-primary transition-colors">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};