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
import { useToast } from '@/hooks/use-toast';
import { CustomNode } from './CustomNode';
import { ContentEditor } from './ContentEditor';
import { CanvasSidebar } from './CanvasSidebar';
import { ContextMenu } from './ContextMenu';
import { CanvasHeader } from './CanvasHeader';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';
import { useCanvasHotkeys } from '@/hooks/useCanvasHotkeys';
import { useCanvasOperations } from '@/hooks/useCanvasOperations';
import { CustomNodeData, InfiniteCanvasProps } from '@/types/canvas';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { EdgeTypeSelector } from './EdgeTypeSelector';
import { EdgeType } from '@/types/canvas';

const nodeTypes = {
  custom: (props: any) => (
    <CustomNode 
      {...props} 
      onUpdateNode={(nodeId: string, updates: Partial<CustomNodeData>) => {
        // Esta função será definida no componente interno
        if (props.onUpdateNode) {
          props.onUpdateNode(nodeId, updates);
        }
      }} 
    />
  ),
};

const InfiniteCanvasInner = ({ funnelId, funnelName, onFunnelNameChange }: InfiniteCanvasProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CustomNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node<CustomNodeData> | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId?: string } | null>(null);
  const [currentEdgeType, setCurrentEdgeType] = useState<EdgeType>('smoothstep');
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { screenToFlowPosition } = useReactFlow();

  // Custom hooks
  const {
    saveToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    setHistoryIndex
  } = useCanvasHistory();

  const {
    addNode,
    duplicateNode,
    deleteNode,
    copyNodes,
    pasteNodes,
    deleteSelected,
    updateNodeContent
  } = useCanvasOperations({
    nodes,
    edges,
    setNodes,
    setEdges,
    saveToHistory
  });

  // Função para atualizar dados do nó
  const handleUpdateNode = useCallback((nodeId: string, updates: Partial<CustomNodeData>) => {
    setNodes(nodes => nodes.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, ...updates } }
        : node
    ));
    saveToHistory();
  }, [setNodes, saveToHistory]);

  // Modificar os nodeTypes para incluir a função de atualização
  const customNodeTypes = {
    custom: (props: any) => (
      <CustomNode {...props} onUpdateNode={handleUpdateNode} />
    ),
  };

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    const prevState = undo();
    if (prevState) {
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(prev => prev - 1);
    }
  }, [undo, setNodes, setEdges, setHistoryIndex]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(prev => prev + 1);
    }
  }, [redo, setNodes, setEdges, setHistoryIndex]);

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

  // Hotkeys
  useCanvasHotkeys({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onCopy: copyNodes,
    onPaste: pasteNodes,
    onDelete: deleteSelected,
    onSave: () => saveFunnel()
  });

  // Drag and Drop handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow');
    
    if (typeof type === 'undefined' || !type) {
      return;
    }

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    addNode(type, position);
  }, [screenToFlowPosition, addNode]);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        type: currentEdgeType,
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 2 },
        markerEnd: {
          type: 'arrowclosed',
          width: 20,
          height: 20,
          color: '#10b981',
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      saveToHistory();
    },
    [setEdges, saveToHistory, currentEdgeType]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<CustomNodeData>) => {
    setSelectedNode(node);
  }, []);

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node<CustomNodeData>) => {
    setSelectedNode(node);
    setIsEditorOpen(true);
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node<CustomNodeData>) => {
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

  return (
    <div className="w-full h-screen flex bg-gray-50 dark:bg-gray-900">
      <CanvasSidebar onAddNode={addNode} />
      
      <div className="flex-1 flex flex-col">
        <CanvasHeader
          funnelName={funnelName}
          onFunnelNameChange={onFunnelNameChange}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          onExportAsImage={exportAsImage}
          onExportAsPDF={exportAsPDF}
          onSave={saveFunnel}
        />

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
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={customNodeTypes}
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
              variant={BackgroundVariant.Lines}
              gap={20} 
              size={1}
              color="#e5e7eb"
            />
            
            <Panel position="top-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {nodes.length} nós • {edges.length} conexões
                </span>
                <EdgeTypeSelector 
                  currentType={currentEdgeType}
                  onTypeChange={setCurrentEdgeType}
                />
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
