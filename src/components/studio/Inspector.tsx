import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings, Clock, Image, Video, Scissors } from 'lucide-react';
import { TimelineItem } from '../VideoStudio';

interface InspectorProps {
  selectedItem: TimelineItem | null;
  onUpdateItem: (itemId: string, updates: Partial<TimelineItem>) => void;
}

export const Inspector: React.FC<InspectorProps> = ({
  selectedItem,
  onUpdateItem
}) => {
  const handleDurationChange = (newDuration: number) => {
    if (selectedItem && newDuration > 0) {
      console.log('🔍 Inspector: Duration updated', { itemId: selectedItem.id, newDuration });
      onUpdateItem(selectedItem.id, { duration: newDuration });
    }
  };

  const renderItemProperties = () => {
    if (!selectedItem) {
      return (
        <div className="text-center text-muted-foreground mt-8">
          <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No item selected</p>
          <p className="text-xs mt-1">Select an item to edit properties</p>
        </div>
      );
    }

    const isMedia = selectedItem.type === 'media';
    const isTransition = selectedItem.type === 'transition';
    const data = selectedItem.data;

    return (
      <div className="space-y-6">
        {/* Item Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            {isMedia ? (
              'type' in data && data.type === 'image' ? (
                <Image className="w-4 h-4 text-primary" />
              ) : (
                <Video className="w-4 h-4 text-primary" />
              )
            ) : (
              <Scissors className="w-4 h-4 text-primary" />
            )}
            <h3 className="font-semibold text-sm">
              {isMedia ? 'Media Properties' : 'Transition Properties'}
            </h3>
          </div>
          
          <div className="studio-panel p-3 space-y-2">
            <div>
              <Label className="text-xs text-muted-foreground">Name</Label>
              <p className="text-sm font-medium">
                {'name' in data ? data.name : 'Unknown'}
              </p>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground">Type</Label>
              <p className="text-sm">
                {isMedia && 'type' in data
                  ? data.type === 'image' ? 'Image' : 'Video'
                  : isTransition && 'type' in data
                  ? data.type
                  : 'Unknown'}
              </p>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Position</Label>
              <p className="text-sm">{selectedItem.position + 1}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Timing Properties */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Timing</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="duration" className="text-xs">
                Duration (seconds)
              </Label>
              <Input
                id="duration"
                type="number"
                min="0.1"
                max="60"
                step="0.1"
                value={selectedItem.duration}
                onChange={(e) => handleDurationChange(parseFloat(e.target.value))}
                className="mt-1"
              />
            </div>
            
            {isTransition && (
              <div className="studio-panel p-3">
                <p className="text-xs text-muted-foreground mb-1">Transition Type</p>
                <p className="text-sm font-medium">
                  {'type' in data ? data.type : 'Unknown'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleDurationChange(1)}
            >
              Set to 1 second
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleDurationChange(3)}
            >
              Set to 3 seconds
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleDurationChange(5)}
            >
              Set to 5 seconds
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-studio-panel-border">
        <h2 className="font-semibold text-foreground">Inspector</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Edit selected item properties
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto studio-scrollbar">
        {renderItemProperties()}
      </div>
    </div>
  );
};