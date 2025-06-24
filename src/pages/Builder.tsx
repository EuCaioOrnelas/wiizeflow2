
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
  Trash2
} from "lucide-react";

interface Block {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  icon: any;
  color: string;
}

interface Connection {
  id: string;
  from: string;
  to: string;
}

const blockTypes = [
  { type: 'capture', name: 'Página de Captura', icon: MousePointer, color: 'bg-blue-500' },
  { type: 'sales', name: 'Página de Vendas', icon: Target, color: 'bg-green-500' },
  { type: 'thankyou', name: 'Página de Obrigado', icon: Heart, color: 'bg-purple-500' },
  { type: 'email', name: 'E-mail', icon: Mail, color: 'bg-yellow-500' },
  { type: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-600' },
  { type: 'checkout', name: 'Checkout', icon: ShoppingCart, color: 'bg-red-500' },
];

const Builder = () => {
  const { funnelId } = useParams();
  const [funnel, setFunnel] = useState<any>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggedBlock, setDraggedBlock] = useState<any>(null);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [editingBlock, setEditingBlock] = useState<string | null>(null);
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

    const newBlock: Block = {
      id: Date.now().toString(),
      type: draggedBlock.type,
      name: draggedBlock.name,
      position: { x, y },
      icon: draggedBlock.icon,
      color: draggedBlock.color
    };

    setBlocks(prev => [...prev, newBlock]);
    setDraggedBlock(null);
  };

  const handleBlockClick = (blockId: string) => {
    setSelectedBlock(blockId);
  };

  const handleBlockDoubleClick = (blockId: string) => {
    setEditingBlock(blockId);
  };

  const handleBlockNameChange = (blockId: string, newName: string) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, name: newName } : block
    ));
  };

  const deleteBlock = (blockId: string) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
    setConnections(prev => prev.filter(conn => conn.from !== blockId && conn.to !== blockId));
    setSelectedBlock(null);
  };

  const saveFunnel = () => {
    const savedFunnels = localStorage.getItem('funnels');
    if (savedFunnels) {
      const funnels = JSON.parse(savedFunnels);
      const updatedFunnels = funnels.map((f: any) => 
        f.id === funnelId 
          ? { ...f, blocks, connections, updatedAt: new Date().toISOString() }
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r shadow-sm">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={goBack} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button onClick={saveFunnel} className="bg-blue-600 hover:bg-blue-700">
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
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => deleteBlock(selectedBlock)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            {blocks.find(b => b.id === selectedBlock) && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Nome do bloco:</p>
                <Input 
                  value={blocks.find(b => b.id === selectedBlock)?.name || ''}
                  onChange={(e) => handleBlockNameChange(selectedBlock, e.target.value)}
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
          className="w-full h-full bg-white rounded-lg border-2 border-dashed border-gray-200 relative overflow-hidden"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => setSelectedBlock(null)}
        >
          {blocks.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  Arraste blocos da barra lateral para começar a criar seu funil
                </p>
              </div>
            </div>
          )}

          {/* Render Blocks */}
          {blocks.map((block) => (
            <div
              key={block.id}
              className={`absolute p-4 bg-white border-2 rounded-lg shadow-sm cursor-pointer transition-all ${
                selectedBlock === block.id 
                  ? 'border-blue-500 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              style={{
                left: block.position.x,
                top: block.position.y,
                minWidth: '160px'
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleBlockClick(block.id);
              }}
              onDoubleClick={() => handleBlockDoubleClick(block.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${block.color} rounded flex items-center justify-center flex-shrink-0`}>
                  <block.icon className="w-4 h-4 text-white" />
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
        </div>
      </div>
    </div>
  );
};

export default Builder;
