
import React, { useCallback, useRef } from 'react';

interface DraggableOptions {
  onDragStart?: () => void;
  onDrag: (newPosition: { x: number; y: number }) => void;
  initialPosition: { x: number, y: number };
}

export const useDraggable = ({ onDragStart, onDrag, initialPosition }: DraggableOptions) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only drag with left mouse button

    if (onDragStart) {
      onDragStart();
    }
    
    isDraggingRef.current = true;
    offsetRef.current = {
      x: e.clientX - initialPosition.x,
      y: e.clientY - initialPosition.y,
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onDragStart, onDrag, initialPosition]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    e.preventDefault();
    const newX = e.clientX - offsetRef.current.x;
    const newY = e.clientY - offsetRef.current.y;
    
    onDrag({ x: newX, y: newY });
  }, [onDrag]);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  return { elementRef, handleMouseDown };
};
