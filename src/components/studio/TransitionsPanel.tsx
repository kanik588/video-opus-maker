import React from 'react';
import { TransitionItem } from '../VideoStudio';

interface TransitionsPanelProps {
  transitions: TransitionItem[];
  onDragStart: (transition: TransitionItem) => void;
}

export const TransitionsPanel: React.FC<TransitionsPanelProps> = ({
  transitions,
  onDragStart
}) => {
  const handleDragStart = (e: React.DragEvent, transition: TransitionItem) => {
    console.log('🎭 Transitions: Drag start', transition);
    onDragStart(transition);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-studio-panel-border">
        <h3 className="font-semibold text-foreground text-sm">Transitions</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Drag between media clips
        </p>
      </div>

      {/* Transitions Grid */}
      <div className="flex-1 p-3 overflow-y-auto studio-scrollbar">
        <div className="grid grid-cols-4 gap-2">
          {transitions.map((transition) => (
            <div
              key={transition.id}
              draggable
              onDragStart={(e) => handleDragStart(e, transition)}
              className="bg-primary/20 border-2 border-primary/40 hover:border-primary hover:bg-primary/30 p-3 cursor-move hover:shadow-studio transition-all studio-animate group text-center rounded-lg"
              title={`${transition.name} (${transition.duration}s)`}
            >
              <div className="text-2xl mb-2 filter drop-shadow-sm">{transition.preview}</div>
              <div className="text-xs font-medium text-primary-foreground group-hover:text-foreground transition-colors">
                {transition.name}
              </div>
              <div className="text-xs text-primary-foreground/70">
                {transition.duration}s
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};