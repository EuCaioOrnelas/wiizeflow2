
import { Node, Edge } from '@xyflow/react';

export interface NodeContent {
  title?: string;
  description?: string;
  items?: any[];
}

export interface CustomNodeData extends Record<string, unknown> {
  label: string;
  type: string;
  content: NodeContent | null;
  hasContent: boolean;
}

export interface CanvasState {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
}

export interface InfiniteCanvasProps {
  funnelId: string;
  funnelName: string;
  onFunnelNameChange: (name: string) => void;
}
