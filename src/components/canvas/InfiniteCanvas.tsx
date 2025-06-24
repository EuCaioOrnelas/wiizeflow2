
import { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useHotkeys } from 'react-hotkeys-hook';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  Download, 
  Share2, 
  Edit3,
  Undo,
  Redo,
  Copy,
  Plus,
  Trash2
} from 'lucide-react';
import { CustomNode } from './CustomNode';
import { ContentEditor } from './ContentEditor';
import { CanvasSidebar } from './CanvasSidebar';
import { ContextMenu } from './ContextMenu';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const nodeTypes = {
  custom: CustomNode,
};

interface NodeContent {
  title?: string;
  description?: string;
  items?: any[];
}

interface CustomNodeData {
  label: string;
  type: string;
  content: NodeContent | null;
  hasContent: boolean;
}

type CustomNode = Node<CustomNodeData>;

interface InfiniteCanvasProps {
  funnelId: string;
  funnelName: string;
  onFunnelNameChange: (name: string) => void;
}

const InfiniteCanvasInner = ({ funnelId, funnelName, onFunnelNameChange }: InfiniteCanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<CustomNode | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId?: string } | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [clipboard, setClipboard] = useState<{ nodes: CustomNode[]; edges: Edge[] } | null>(null);
  const [history, setHistory] = useState<{ nodes: CustomNode[]; edges: Edge[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { getNodes, getEdges, screenToFlowPosition } = useReactFlow();

  // Load saved data
  useEffect(() => {
    const savedFunnels = localStorage.getItem('funnels');
    if (savedFunnels) {
      const funnels = JSON.parse(savedFunnels);
      const currentFunnel = funnels.find((f: any) => f.id === funnelId);
      if (currentFunnel && currentFunnel.canvasData) {
        setNodes(currentFunnel.canvasData.nodes || []);
        setEdges(currentFunnel.canvasData.edges || []);
      }
    }
  }, [funnelId, setNodes, setEdges]);

  // Save to history
  const saveToHistory = useCallback(() => {
    const currentState = { nodes: getNodes() as CustomNode[], edges: getEdges() };
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(currentState);
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => prev + 1);
  }, [getNodes, getEdges, historyIndex]);

  // Undo/Redo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  // Hotkeys
  useHotkeys('ctrl+z, cmd+z', undo);
  useHotkeys('ctrl+y, cmd+y, ctrl+shift+z, cmd+shift+z', redo);
  useHotkeys('ctrl+c, cmd+c', () => copyNodes());
  useHotkeys('ctrl+v, cmd+v', () => pasteNodes());
  useHotkeys('delete, backspace', () => deleteSelected());
  useHotkeys('ctrl+s, cmd+s', (e) => {
    e.preventDefault();
    saveFunnel();
  });

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      saveToHistory();
    },
    [setEdges, saveToHistory]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: CustomNode) => {
    setSelectedNode(node);
  }, []);

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: CustomNode) => {
    setSelectedNode(node);
    setIsEditorOpen(true);
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: CustomNode) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      nodeId: node.id,
    });
  }, []);

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const addNode = useCallback((type: string, position: { x: number; y: number }) => {
    const newNode: CustomNode = {
      id: `node-${Date.now()}`,
      type: 'custom',
      position,
      data: {
        label: `${type} Node`,
        type,
        content: null,
        hasContent: false,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    saveToHistory();
  }, [setNodes, saveToHistory]);

  const duplicateNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      const newNode: CustomNode = {
        ...node,
        id: `node-${Date.now()}`,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      saveToHistory();
    }
  }, [nodes, setNodes, saveToHistory]);

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter(n => n.id !== nodeId));
    setEdges((eds) => eds.filter(e => e.source !== nodeId && e.target !== nodeId));
    saveToHistory();
  }, [setNodes, setEdges, saveToHistory]);

  const copyNodes = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedNodeIds = selectedNodes.map(node => node.id);
    const selectedEdges = edges.filter(edge => 
      selectedNodeIds.includes(edge.source) && selectedNodeIds.includes(edge.target)
    );
    
    if (selectedNodes.length > 0) {
      setClipboard({ nodes: selectedNodes, edges: selectedEdges });
      toast({
        title: "Copiado!",
        description: `${selectedNodes.length} nó(s) copiado(s)`,
      });
    }
  }, [nodes, edges, toast]);

  const pasteNodes = useCallback(() => {
    if (clipboard) {
      const idMap = new Map();
      const newNodes: CustomNode[] = clipboard.nodes.map(node => {
        const newId = `node-${Date.now()}-${Math.random()}`;
        idMap.set(node.id, newId);
        return {
          ...node,
          id: newId,
          position: {
            x: node.position.x + 50,
            y: node.position.y + 50,
          },
          selected: false,
        };
      });

      const newEdges = clipboard.edges.map(edge => ({
        ...edge,
        id: `edge-${Date.now()}-${Math.random()}`,
        source: idMap.get(edge.source),
        target: idMap.get(edge.target),
      }));

      setNodes((nds) => [...nds, ...newNodes]);
      setEdges((eds) => [...eds, ...newEdges]);
      saveToHistory();
      
      toast({
        title: "Colado!",
        description: `${newNodes.length} nó(s) colado(s)`,
      });
    }
  }, [clipboard, setNodes, setEdges, saveToHistory, toast]);

  const deleteSelected = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedNodeIds = selectedNodes.map(node => node.id);
    
    setNodes((nds) => nds.filter(node => !node.selected));
    setEdges((eds) => eds.filter(edge => 
      !selectedNodeIds.includes(edge.source) && !selectedNodeIds.includes(edge.target)
    ));
    saveToHistory();
  }, [nodes, setNodes, setEdges, saveToHistory]);

  const saveFunnel = useCallback(() => {
    const savedFunnels = localStorage.getItem('funnels');
    if (savedFunnels) {
      const funnels = JSON.parse(savedFunnels);
      const updatedFunnels = funnels.map((f: any) => 
        f.id === funnelId 
          ? { 
              ...f, 
              name: funnelName,
              canvasData: { nodes, edges },
              updatedAt: new Date().toISOString() 
            }
          : f
      );
      localStorage.setItem('funnels', JSON.stringify(updatedFunnels));
      
      toast({
        title: "Funil salvo!",
        description: "Suas alterações foram salvas com sucesso.",
      });
    }
  }, [funnelId, funnelName, nodes, edges, toast]);

  const exportAsImage = useCallback(async () => {
    if (reactFlowWrapper.current) {
      const canvas = await html2canvas(reactFlowWrapper.current);
      const link = document.createElement('a');
      link.download = `${funnelName}-funnel.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  }, [funnelName]);

  const exportAsPDF = useCallback(async () => {
    if (reactFlowWrapper.current) {
      const canvas = await html2canvas(reactFlowWrapper.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${funnelName}-funnel.pdf`);
    }
  }, [funnelName]);

  const updateNodeContent = useCallback((nodeId: string, content: NodeContent) => {
    setNodes((nds) => nds.map(node => 
      node.id === nodeId 
        ? { 
            ...node, 
            data: { 
              ...node.data, 
              content,
              hasContent: !!content && Object.keys(content).length > 0
            }
          }
        : node
    ));
    saveToHistory();
  }, [setNodes, saveToHistory]);

  return (
    <div className="w-full h-screen flex bg-gray-50 dark:bg-gray-900">
      <CanvasSidebar onAddNode={addNode} />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 border-b bg-white dark:bg-gray-800 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            {isEditingName ? (
              <Input
                value={funnelName}
                onChange={(e) => onFunnelNameChange(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingName(false);
                  }
                }}
                className="text-xl font-bold"
                autoFocus
              />
            ) : (
              <h1 
                className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-green-600"
                onClick={() => setIsEditingName(true)}
              >
                {funnelName}
                <Edit3 className="w-4 h-4 inline ml-2" />
              </h1>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={undo} disabled={historyIndex <= 0}>
              <Undo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1}>
              <Redo className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={exportAsImage}>
              <Download className="w-4 h-4 mr-2" />
              PNG
            </Button>
            <Button variant="outline" size="sm" onClick={exportAsPDF}>
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            <Button onClick={saveFunnel} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodeContextMenu={onNodeContextMenu}
            onPaneContextMenu={onPaneContextMenu}
            nodeTypes={nodeTypes}
            fitView
            snapToGrid
            snapGrid={[20, 20]}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            minZoom={0.1}
            maxZoom={4}
            attributionPosition="bottom-left"
          >
            <Controls />
            <MiniMap 
              nodeColor="#10b981"
              maskColor="rgba(0, 0, 0, 0.1)"
              position="bottom-right"
            />
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={1}
              color="#e5e7eb"
            />
            
            <Panel position="top-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {nodes.length} nós • {edges.length} conexões
                </span>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          nodeId={contextMenu.nodeId}
          onClose={() => setContextMenu(null)}
          onDuplicate={duplicateNode}
          onDelete={deleteNode}
          onCopy={copyNodes}
          onPaste={pasteNodes}
        />
      )}

      {/* Content Editor */}
      {isEditorOpen && selectedNode && (
        <ContentEditor
          node={selectedNode}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={(content) => updateNodeContent(selectedNode.id, content)}
        />
      )}
    </div>
  );
};

export const InfiniteCanvas = (props: InfiniteCanvasProps) => (
  <ReactFlowProvider>
    <InfiniteCanvasInner {...props} />
  </ReactFlowProvider>
);
