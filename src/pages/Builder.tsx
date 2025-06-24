import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Target, 
  ArrowLeft, 
  Save, 
  MousePointer, 
  Mail, 
  MessageCircle, 
  ShoppingCart, 
  FileText, 
  Heart,
  Trash2,
  Plus,
  Type,
  Palette,
  Upload
} from "lucide-react";

interface Block {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  icon: any;
  color: string;
  customImage?: string;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  fromPosition: { x: number; y: number };
  toPosition: { x: number; y: number };
}

interface TextElement {
  id: string;
  text: string;
  position: { x: number; y: number };
  fontSize: number;
  color: string;
}

const blockTypes = [
  { type: 'capture', name: 'Página de Captura', icon: MousePointer, color: 'bg-blue-500' },
  { type: 'sales', name: 'Página de Vendas', icon: Target, color: 'bg-green-500' },
  { type: 'thankyou', name: 'Página de Obrigado', icon: Heart, color: 'bg-purple-500' },
  { type: 'email', name: 'E-mail', icon: Mail, color: 'bg-yellow-500' },
  { type: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-600' },
  { type: 'checkout', name: 'Checkout', icon: ShoppingCart, color: 'bg-red-500' },
  { type: 'other', name: 'Outros', icon: Plus, color: 'bg-gray-500' },
  { type: 'text', name: 'Texto', icon: Type, color: 'bg-indigo-500' },
];

const colorOptions = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500',
  'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-gray-500',
  'bg-orange-500', 'bg-teal-500', 'bg-cyan-500', 'bg-lime-500'
];

const Builder = () => {
  const { funnelId } = useParams();
  const [funnel, setFunnel] = useState<any>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<any>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedFunnels = localStorage.getItem('funnels');
    if (savedFunnels) {
      const funnels = JSON.parse(savedFunnels);
      const currentFunnel = funnels.find((f: any) => f.id === funnelId);
      if (currentFunnel) {
        setFunnel(currentFunnel);
        setBlocks(currentFunnel.blocks || []);
        setConnections(currentFunnel.connections || []);
        setTextElements(currentFunnel.textElements || []);
      }
    }
  }, [funnelId]);

  const handleDragStart = (blockType: any) => {
    setDraggedBlock(blockType);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedBlock || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggedBlock.type === 'text') {
      const newText: TextElement = {
        id: Date.now().toString(),
        text: 'Clique para editar',
        position: { x, y },
        fontSize: 16,
        color: '#000000'
      };
      setTextElements(prev => [...prev, newText]);
    } else {
      const newBlock: Block = {
        id: Date.now().toString(),
        type: draggedBlock.type,
        name: draggedBlock.name,
        position: { x, y },
        icon: draggedBlock.icon,
        color: draggedBlock.color
      };
      setBlocks(prev => [...prev, newBlock]);
    }
    setDraggedBlock(null);
  };

  const handleBlockMouseDown = (e: React.MouseEvent, blockId: string) => {
    if (e.button !== 0) return; // Only left click

    const block = blocks.find(b => b.id === blockId);
    if (!block || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - block.position.x;
    const offsetY = e.clientY - rect.top - block.position.y;

    setDragOffset({ x: offsetX, y: offsetY });
    setSelectedBlock(blockId);
    setIsDragging(true);

    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedBlock || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    setBlocks(prev => prev.map(block =>
      block.id === selectedBlock
        ? { ...block, position: { x: Math.max(0, x), y: Math.max(0, y) } }
        : block
    ));

    // Update connections
    updateConnectionsForBlock(selectedBlock);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const updateConnectionsForBlock = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    setConnections(prev => prev.map(conn => {
      if (conn.from === blockId) {
        return {
          ...conn,
          fromPosition: {
            x: block.position.x + 80, // center of block
            y: block.position.y + 40
          }
        };
      }
      if (conn.to === blockId) {
        return {
          ...conn,
          toPosition: {
            x: block.position.x + 80,
            y: block.position.y + 40
          }
        };
      }
      return conn;
    }));
  };

  const handleBlockClick = (blockId: string) => {
    if (connectingFrom) {
      if (connectingFrom !== blockId) {
        createConnection(connectingFrom, blockId);
      }
      setConnectingFrom(null);
    } else {
      setSelectedBlock(blockId);
      setSelectedText(null);
    }
  };

  const startConnection = (blockId: string) => {
    setConnectingFrom(blockId);
  };

  const createConnection = (fromId: string, toId: string) => {
    const fromBlock = blocks.find(b => b.id === fromId);
    const toBlock = blocks.find(b => b.id === toId);
    
    if (!fromBlock || !toBlock) return;

    const newConnection: Connection = {
      id: Date.now().toString(),
      from: fromId,
      to: toId,
      fromPosition: {
        x: fromBlock.position.x + 80,
        y: fromBlock.position.y + 40
      },
      toPosition: {
        x: toBlock.position.x + 80,
        y: toBlock.position.y + 40
      }
    };

    setConnections(prev => [...prev, newConnection]);
  };

  const handleBlockDoubleClick = (blockId: string) => {
    setEditingBlock(blockId);
  };

  const handleBlockNameChange = (blockId: string, newName: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, name: newName } : block
    ));
  };

  const handleBlockColorChange = (blockId: string, newColor: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, color: newColor } : block
    ));
  };

  const handleCustomImageUpload = (blockId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setBlocks(prev => prev.map(block => 
        block.id === blockId ? { ...block, customImage: imageUrl } : block
      ));
    };
    reader.readAsDataURL(file);
  };

  const deleteBlock = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    setConnections(prev => prev.filter(conn => conn.from !== blockId && conn.to !== blockId));
    setSelectedBlock(null);
  };

  const deleteConnection = (connectionId: string) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
  };

  const handleTextClick = (textId: string) => {
    setSelectedText(textId);
    setSelectedBlock(null);
  };

  const handleTextChange = (textId: string, newText: string) => {
    setTextElements(prev => prev.map(text =>
      text.id === textId ? { ...text, text: newText } : text
    ));
  };

  const deleteText = (textId: string) => {
    setTextElements(prev => prev.filter(text => text.id !== textId));
    setSelectedText(null);
  };

  const saveFunnel = () => {
    const savedFunnels = localStorage.getItem('funnels');
    if (savedFunnels) {
      const funnels = JSON.parse(savedFunnels);
      const updatedFunnels = funnels.map((f: any) => 
        f.id === funnelId 
          ? { ...f, blocks, connections, textElements, updatedAt: new Date().toISOString() }
          : f
      );
      localStorage.setItem('funnels', JSON.stringify(updatedFunnels));
      
      toast({
        title: "Funil salvo!",
        description: "Suas alterações foram salvas com sucesso.",
      });
    }
  };

  const goBack = () => {
    window.location.href = '/dashboard';
  };

  if (!funnel) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex transition-colors duration-300">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r shadow-sm transition-colors duration-300">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={goBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button onClick={saveFunnel} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
          <h1 className="text-xl font-bold text-gray-900">{funnel.name}</h1>
        </div>

        {/* Block Types */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Blocos</h2>
          <div className="space-y-3">
            {blockTypes.map((blockType) => (
              <div
                key={blockType.type}
                draggable
                onDragStart={() => handleDragStart(blockType)}
                className="flex items-center p-3 bg-gray-50 rounded-lg cursor-grab hover:bg-gray-100 transition-colors"
              >
                <div className={`w-8 h-8 ${blockType.color} rounded flex items-center justify-center mr-3`}>
                  <blockType.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{blockType.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Block Properties */}
        {selectedBlock && (
          <div className="p-6 border-t">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Propriedades</h3>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => startConnection(selectedBlock)}
                  className="border-green-500 text-green-600 hover:bg-green-50"
                >
                  Conectar
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteBlock(selectedBlock)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {blocks.find(b => b.id === selectedBlock) && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Nome do bloco:</p>
                  <Input 
                    value={blocks.find(b => b.id === selectedBlock)?.name || ''}
                    onChange={(e) => handleBlockNameChange(selectedBlock, e.target.value)}
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Cor do bloco:</p>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 ${color} rounded border-2 ${
                          blocks.find(b => b.id === selectedBlock)?.color === color 
                            ? 'border-gray-800' 
                            : 'border-gray-200'
                        }`}
                        onClick={() => handleBlockColorChange(selectedBlock, color)}
                      />
                    ))}
                  </div>
                </div>

                {blocks.find(b => b.id === selectedBlock)?.type === 'other' && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Imagem personalizada:</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleCustomImageUpload(selectedBlock, file);
                        }
                      }}
                      className="text-xs"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Selected Text Properties */}
        {selectedText && (
          <div className="p-6 border-t">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Texto</h3>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => deleteText(selectedText)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            {textElements.find(t => t.id === selectedText) && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Conteúdo:</p>
                <Input 
                  value={textElements.find(t => t.id === selectedText)?.text || ''}
                  onChange={(e) => handleTextChange(selectedText, e.target.value)}
                  className="text-sm"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Canvas */}
      <div className="flex-1 p-6">
        <div
          ref={canvasRef}
          className="w-full h-full bg-white rounded-lg border-2 border-dashed border-gray-200 relative overflow-hidden transition-colors duration-300"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={() => {
            setSelectedBlock(null);
            setSelectedText(null);
            setConnectingFrom(null);
          }}
        >
          {blocks.length === 0 && textElements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Arraste blocos da barra lateral para começar a criar seu funil
                </p>
              </div>
            </div>
          )}

          {/* Render Connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <marker
                id="arrowhead-default"
                markerWidth="12"
                markerHeight="8"
                refX="11"
                refY="4"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <polygon
                  points="0,0 0,8 12,4"
                  fill="#374151"
                  className="arrow-marker"
                />
              </marker>
            </defs>
            {connections.map((connection) => {
              const fromBlock = blocks.find(b => b.id === connection.from);
              const toBlock = blocks.find(b => b.id === connection.to);
              
              if (!fromBlock || !toBlock) return null;

              // Calculate connection points on the edges of blocks
              const fromX = fromBlock.position.x + 160; // right edge of from block
              const fromY = fromBlock.position.y + 40; // center height of from block
              const toX = toBlock.position.x; // left edge of to block
              const toY = toBlock.position.y + 40; // center height of to block

              return (
                <g key={connection.id}>
                  <line
                    x1={fromX}
                    y1={fromY}
                    x2={toX - 10} // Stop before the target block to show arrow
                    y2={toY}
                    stroke="#374151"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead-default)"
                    className="pointer-events-auto cursor-pointer hover:stroke-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConnection(connection.id);
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Render Blocks */}
          {blocks.map((block) => (
            <div
              key={block.id}
              className={`absolute p-4 bg-white border-2 rounded-lg shadow-sm cursor-pointer transition-all ${
                selectedBlock === block.id 
                  ? 'border-green-500 shadow-lg' 
                  : connectingFrom === block.id
                  ? 'border-green-500 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{
                left: block.position.x,
                top: block.position.y,
                minWidth: '160px'
              }}
              onMouseDown={(e) => handleBlockMouseDown(e, block.id)}
              onClick={(e) => {
                e.stopPropagation();
                handleBlockClick(block.id);
              }}
              onDoubleClick={() => handleBlockDoubleClick(block.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${block.color} rounded flex items-center justify-center flex-shrink-0`}>
                  {block.customImage ? (
                    <img src={block.customImage} alt="Custom" className="w-6 h-6 object-cover rounded" />
                  ) : (
                    <block.icon className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {editingBlock === block.id ? (
                    <Input
                      value={block.name}
                      onChange={(e) => handleBlockNameChange(block.id, e.target.value)}
                      onBlur={() => setEditingBlock(null)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setEditingBlock(null);
                        }
                      }}
                      className="text-xs p-1 h-6"
                      autoFocus
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-900 truncate block">
                      {block.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Render Text Elements */}
          {textElements.map((textElement) => (
            <div
              key={textElement.id}
              className={`absolute cursor-pointer ${
                selectedText === textElement.id ? 'ring-2 ring-green-500' : ''
              }`}
              style={{
                left: textElement.position.x,
                top: textElement.position.y,
                fontSize: textElement.fontSize,
                color: textElement.color
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleTextClick(textElement.id);
              }}
            >
              {textElement.text}
            </div>
          ))}

          {/* Connection Helper */}
          {connectingFrom && (
            <div className="absolute top-4 left-4 bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm">
              Clique em outro bloco para conectar
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Builder;
