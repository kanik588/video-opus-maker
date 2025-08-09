import React, { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { MediaLibrary } from './studio/MediaLibrary';
import { TransitionsPanel } from './studio/TransitionsPanel';
import { StagePreview } from './studio/StagePreview';
import { Inspector } from './studio/Inspector';
import { Timeline } from './studio/Timeline';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  name: string;
  url: string;
  thumbnail: string;
  duration?: number; // in seconds
}

export interface TransitionItem {
  id: string;
  name: string;
  type: string;
  preview: string;
  duration: number;
}

export interface TimelineItem {
  id: string;
  type: 'media' | 'transition';
  data: MediaItem | TransitionItem;
  duration: number;
  position: number; // position in timeline
}

export const VideoStudio: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [draggedItemType, setDraggedItemType] = useState<'media' | 'transition' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const transitions: TransitionItem[] = [
    { id: 'fade', name: 'Fade', type: 'fade', preview: '🌅', duration: 1 },
    { id: 'slide', name: 'Slide', type: 'slide', preview: '➡️', duration: 0.5 },
    { id: 'zoom', name: 'Zoom', type: 'zoomin', preview: '🔍', duration: 0.8 },
    { id: 'wipe', name: 'Wipe', type: 'wipeleft', preview: '🧽', duration: 0.7 },
    { id: 'dissolve', name: 'Dissolve', type: 'dissolve', preview: '💫', duration: 1.2 },
    { id: 'blur', name: 'Blur', type: 'blur', preview: '🌫️', duration: 0.6 },
    { id: 'pixelize', name: 'Pixelize', type: 'pixelize', preview: '🟩', duration: 0.4 },
    { id: 'rotate', name: 'Rotate', type: 'rotate', preview: '🔄', duration: 1 },
  ];

  const handleFileUpload = useCallback((files: FileList) => {
    console.log('🎬 Studio: Uploading files', files.length);
    Array.from(files).forEach((file, index) => {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video/');
      
      const newItem: MediaItem = {
        id: `media-${Date.now()}-${index}`,
        type: isVideo ? 'video' : 'image',
        name: file.name,
        url,
        thumbnail: url,
        duration: isVideo ? 5 : 3 // default durations
      };

      setMediaItems(prev => [...prev, newItem]);
      toast.success(`${isVideo ? 'Video' : 'Image'} uploaded: ${file.name}`);
    });
  }, []);

  const handleDragStart = useCallback((item: any, type: 'media' | 'transition') => {
    console.log('🎬 Studio: Drag start', { item, type });
    setDraggedItem(item);
    setDraggedItemType(type);
  }, []);

  const handleDropToTimeline = useCallback((position: number) => {
    if (!draggedItem || !draggedItemType) return;

    console.log('🎬 Studio: Drop to timeline', { position, draggedItem, draggedItemType });

    if (draggedItemType === 'transition') {
      // Validate transition placement
      const isValidPosition = isValidTransitionPosition(position);
      if (!isValidPosition) {
        toast.error('Transitions can only be placed at the start, between media, or at the end');
        return;
      }
    }

    const newTimelineItem: TimelineItem = {
      id: `timeline-${Date.now()}`,
      type: draggedItemType,
      data: draggedItem,
      duration: draggedItem.duration || 3,
      position
    };

    setTimelineItems(prev => {
      const newItems = [...prev];
      newItems.splice(position, 0, newTimelineItem);
      // Recalculate positions
      return newItems.map((item, index) => ({ ...item, position: index }));
    });

    setDraggedItem(null);
    setDraggedItemType(null);
    toast.success(`${draggedItemType === 'media' ? 'Media' : 'Transition'} added to timeline`);
  }, [draggedItem, draggedItemType, timelineItems]);

  const isValidTransitionPosition = (position: number): boolean => {
    const mediaCount = timelineItems.filter(item => item.type === 'media').length;
    
    // Can place at start (intro)
    if (position === 0) return true;
    
    // Can place at end (outro)
    if (position === timelineItems.length) return true;
    
    // Can place between media items
    const beforeItem = timelineItems[position - 1];
    const afterItem = timelineItems[position];
    
    if (beforeItem?.type === 'media' && (!afterItem || afterItem.type === 'media')) {
      return true;
    }
    
    return false;
  };

  const handleReorderTimeline = useCallback((fromIndex: number, toIndex: number) => {
    console.log('🎬 Studio: Reorder timeline', { fromIndex, toIndex });
    setTimelineItems(prev => {
      const newItems = [...prev];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);
      return newItems.map((item, index) => ({ ...item, position: index }));
    });
  }, []);

  const handleRemoveFromTimeline = useCallback((itemId: string) => {
    console.log('🎬 Studio: Remove from timeline', itemId);
    setTimelineItems(prev => prev.filter(item => item.id !== itemId));
    if (selectedItem?.id === itemId) {
      setSelectedItem(null);
    }
    toast.success('Item removed from timeline');
  }, [selectedItem]);

  const handleSelectItem = useCallback((item: TimelineItem) => {
    console.log('🎬 Studio: Select item', item);
    setSelectedItem(item);
  }, []);

  const handleUpdateItem = useCallback((itemId: string, updates: Partial<TimelineItem>) => {
    console.log('🎬 Studio: Update item', { itemId, updates });
    setTimelineItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
    
    if (selectedItem?.id === itemId) {
      setSelectedItem(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [selectedItem]);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b border-studio-panel-border bg-studio-panel px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Video Studio
          </h1>
          <div className="text-sm text-muted-foreground">
            Professional Slideshow Maker
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{timelineItems.length} items</span>
          <span>•</span>
          <span>{mediaItems.length} media files</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 flex flex-col border-r border-studio-panel-border">
          {/* Media Library */}
          <div className="flex-1 min-h-0">
            <MediaLibrary
              items={mediaItems}
              onFileUpload={handleFileUpload}
              onDragStart={(item) => handleDragStart(item, 'media')}
              fileInputRef={fileInputRef}
            />
          </div>
          
          {/* Transitions Panel */}
          <div className="h-48 border-t border-studio-panel-border">
            <TransitionsPanel
              transitions={transitions}
              onDragStart={(item) => handleDragStart(item, 'transition')}
            />
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 flex flex-col">
          {/* Preview Area */}
          <div className="flex-1 p-4">
            <StagePreview
              selectedItem={selectedItem}
              timelineItems={timelineItems}
            />
          </div>
        </div>

        {/* Right Sidebar - Inspector */}
        <div className="w-80 border-l border-studio-panel-border">
          <Inspector
            selectedItem={selectedItem}
            onUpdateItem={handleUpdateItem}
          />
        </div>
      </div>

      {/* Timeline at Bottom */}
      <div className="h-32 border-t border-studio-panel-border bg-studio-timeline">
        <Timeline
          items={timelineItems}
          selectedItem={selectedItem}
          onSelectItem={handleSelectItem}
          onRemoveItem={handleRemoveFromTimeline}
          onReorderItems={handleReorderTimeline}
          onDropItem={handleDropToTimeline}
          draggedItemType={draggedItemType}
        />
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
      />
    </div>
  );
};