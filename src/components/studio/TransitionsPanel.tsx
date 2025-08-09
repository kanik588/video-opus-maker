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
              className="studio-panel p-2 cursor-move hover:shadow-studio transition-all studio-animate group text-center"
              title={`${transition.name} (${transition.duration}s)`}
            >
              <div className="text-2xl mb-1">{transition.preview}</div>
              <div className="text-xs text-foreground group-hover:text-primary transition-colors">
                {transition.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {transition.duration}s
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};