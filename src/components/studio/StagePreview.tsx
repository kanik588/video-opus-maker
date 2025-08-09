import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TimelineItem } from '../VideoStudio';

interface StagePreviewProps {
  selectedItem: TimelineItem | null;
  timelineItems: TimelineItem[];
}

export const StagePreview: React.FC<StagePreviewProps> = ({
  selectedItem,
  timelineItems
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlayPause = () => {
    console.log('🎬 Preview: Play/Pause toggled');
    setIsPlaying(!isPlaying);
  };

  const renderPreviewContent = () => {
    if (!selectedItem) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <div className="text-center">
            <Monitor className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No item selected</p>
            <p className="text-sm">Select an item from the timeline to preview</p>
          </div>
        </div>
      );
    }

    if (selectedItem.type === 'media' && 'url' in selectedItem.data) {
      const media = selectedItem.data;
      return media.type === 'image' ? (
        <img
          src={media.url}
          alt={media.name}
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <video
          src={media.url}
          className="max-w-full max-h-full"
          controls={false}
          muted
        />
      );
    }

    if (selectedItem.type === 'transition' && 'preview' in selectedItem.data) {
      const transition = selectedItem.data;
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-8xl mb-4">{transition.preview}</div>
            <h3 className="text-2xl font-semibold mb-2">{transition.name}</h3>
            <p className="text-muted-foreground">
              Duration: {transition.duration}s
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Stage Preview</h2>
          {selectedItem && (
            <p className="text-sm text-muted-foreground">
              {selectedItem.type === 'media' && 'name' in selectedItem.data
                ? selectedItem.data.name
                : selectedItem.type === 'transition' && 'name' in selectedItem.data
                ? `${selectedItem.data.name} Transition`
                : 'Unknown item'}
            </p>
          )}
        </div>
        
        {timelineItems.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {timelineItems.length} item{timelineItems.length !== 1 ? 's' : ''} in timeline
          </div>
        )}
      </div>

      {/* Preview Area */}
      <div className="flex-1 studio-panel flex items-center justify-center mb-4 overflow-hidden">
        {renderPreviewContent()}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="outline" size="sm" disabled={!selectedItem}>
          <SkipBack className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={handlePlayPause}
          disabled={!selectedItem}
          className="bg-primary hover:bg-primary-glow"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
        
        <Button variant="outline" size="sm" disabled={!selectedItem}>
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      {selectedItem && (
        <div className="mt-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: isPlaying ? '100%' : '0%' }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0:00</span>
            <span>{selectedItem.duration}s</span>
          </div>
        </div>
      )}
    </div>
  );
};