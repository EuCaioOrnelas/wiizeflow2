
import { useCallback, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { CanvasState, CustomNodeData } from '@/types/canvas';
import { Node, Edge } from '@xyflow/react';

export const useCanvasHistory = () => {
  const [history, setHistory] = useState<CanvasState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { getNodes, getEdges } = useReactFlow();

  const saveToHistory = useCallback(() => {
    const currentState: CanvasState = { 
      nodes: getNodes() as Node<CustomNodeData>[], 
      edges: getEdges() 
    };
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(currentState);
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => prev + 1);
  }, [getNodes, getEdges, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      return history[historyIndex - 1];
    }
    return null;
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      return history[historyIndex + 1];
    }
    return null;
  }, [history, historyIndex]);

  return {
    saveToHistory,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    setHistoryIndex
  };
};
