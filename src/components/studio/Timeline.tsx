import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, GripVertical, Image, Video, Scissors } from 'lucide-react';
import { TimelineItem } from '../VideoStudio';

interface TimelineProps {
  items: TimelineItem[];
  selectedItem: TimelineItem | null;
  onSelectItem: (item: TimelineItem) => void;
  onRemoveItem: (itemId: string) => void;
  onReorderItems: (fromIndex: number, toIndex: number) => void;
  onDropItem: (position: number) => void;
  draggedItemType: 'media' | 'transition' | null;
}

export const Timeline: React.FC<TimelineProps> = ({
  items,
  selectedItem,
  onSelectItem,
  onRemoveItem,
  onReorderItems,
  onDropItem,
  draggedItemType
}) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    console.log('📽️ Timeline: Drag start', { index });
    setDraggingIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    console.log('📽️ Timeline: Drag end');
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    console.log('📽️ Timeline: Drop', { index, draggingIndex, draggedItemType });
    
    if (draggingIndex !== null) {
      // Reordering existing items
      onReorderItems(draggingIndex, index);
    } else if (draggedItemType) {
      // Dropping new item from panels
      onDropItem(index);
    }
    
    setDragOverIndex(null);
    setDraggingIndex(null);
  };

  const handleItemClick = (item: TimelineItem) => {
    console.log('📽️ Timeline: Item selected', item);
    onSelectItem(item);
  };

  const handleRemoveClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    console.log('📽️ Timeline: Remove item', itemId);
    onRemoveItem(itemId);
  };

  const getItemIcon = (item: TimelineItem) => {
    if (item.type === 'transition') {
      return <Scissors className="w-3 h-3" />;
    }
    
    if (item.type === 'media' && 'type' in item.data) {
      return item.data.type === 'image' 
        ? <Image className="w-3 h-3" />
        : <Video className="w-3 h-3" />;
    }
    
    return <div className="w-3 h-3" />;
  };

  const getItemName = (item: TimelineItem) => {
    if ('name' in item.data) {
      return item.data.name;
    }
    return item.type === 'transition' ? 'Transition' : 'Media';
  };

  const isValidDropZone = (index: number) => {
    if (!draggedItemType) return true;
    
    if (draggedItemType === 'transition') {
      // Check if this is a valid transition position
      const beforeItem = items[index - 1];
      const afterItem = items[index];
      
      // Can drop at start (intro)
      if (index === 0) return true;
      
      // Can drop at end (outro)
      if (index === items.length) return true;
      
      // Can drop between media items
      if (beforeItem?.type === 'media' && (!afterItem || afterItem.type === 'media')) {
        return true;
      }
      
      return false;
    }
    
    return true;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-2 border-b border-studio-panel-border">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground text-sm">Timeline</h2>
          <div className="text-xs text-muted-foreground">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 p-4 overflow-x-auto studio-scrollbar">
        {items.length === 0 ? (
          <div
            className={`
              h-full border-2 border-dashed rounded-lg flex items-center justify-center
              studio-drop-zone transition-colors
              ${draggedItemType ? 'border-studio-drop-zone bg-studio-drop-zone/5' : 'border-studio-panel-border'}
            `}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, 0)}
          >
            <div className="text-center text-muted-foreground">
              <div className="text-2xl mb-2">🎬</div>
              <p className="text-sm">Timeline is empty</p>
              <p className="text-xs mt-1">
                Drag media and transitions here to build your slideshow
              </p>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center h-full min-w-max">
            {/* Drop zone at start */}
            <div
              className={`
                w-2 h-full rounded border-2 border-dashed transition-all
                ${dragOverIndex === 0 ? 'border-studio-drop-zone-active bg-studio-drop-zone-active/20 w-4' : 'border-transparent'}
                ${draggedItemType && isValidDropZone(0) ? 'border-studio-drop-zone' : ''}
              `}
              onDragOver={(e) => handleDragOver(e, 0)}
              onDrop={(e) => handleDrop(e, 0)}
            />

            {items.map((item, index) => (
              <React.Fragment key={item.id}>
                {/* Timeline Item */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleItemClick(item)}
                  className={`
                    studio-panel p-3 min-w-24 h-16 cursor-pointer studio-animate
                    flex flex-col items-center justify-center relative group
                    ${selectedItem?.id === item.id ? 'studio-selected' : ''}
                    ${draggingIndex === index ? 'opacity-50' : ''}
                    ${item.type === 'transition' ? 'bg-accent' : ''}
                  `}
                >
                  {/* Drag handle */}
                  <GripVertical className="w-3 h-3 absolute top-1 left-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Remove button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-1 right-1 w-4 h-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => handleRemoveClick(e, item.id)}
                  >
                    <X className="w-3 h-3" />
                  </Button>

                  {/* Content */}
                  <div className="flex flex-col items-center text-center">
                    {getItemIcon(item)}
                    <span className="text-xs mt-1 truncate max-w-16">
                      {getItemName(item)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.duration}s
                    </span>
                  </div>
                </div>

                {/* Drop zone between items */}
                <div
                  className={`
                    w-2 h-full rounded border-2 border-dashed transition-all
                    ${dragOverIndex === index + 1 ? 'border-studio-drop-zone-active bg-studio-drop-zone-active/20 w-4' : 'border-transparent'}
                    ${draggedItemType && isValidDropZone(index + 1) ? 'border-studio-drop-zone' : ''}
                  `}
                  onDragOver={(e) => handleDragOver(e, index + 1)}
                  onDrop={(e) => handleDrop(e, index + 1)}
                />
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};