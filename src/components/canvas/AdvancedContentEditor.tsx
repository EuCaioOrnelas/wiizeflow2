
import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Node } from '@xyflow/react';
import { 
  Save, 
  X, 
  Bold, 
  Italic, 
  Underline, 
  Palette,
  Link,
  List,
  CheckSquare,
  Heading1,
  Heading2,
  Type,
  ListOrdered,
  Highlighter
} from 'lucide-react';
import { CustomNodeData, NodeContent } from '@/types/canvas';

interface AdvancedContentEditorProps {
  node: Node<CustomNodeData>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: NodeContent) => void;
}

interface ContentBlock {
  id: string;
  type: 'h1' | 'h2' | 'subtitle' | 'paragraph' | 'list' | 'checklist' | 'link';
  content: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
    highlight?: boolean;
  };
  url?: string;
  items?: { id: string; text: string; checked?: boolean }[];
}

export const AdvancedContentEditor = ({ node, isOpen, onClose, onSave }: AdvancedContentEditorProps) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [activeBlock, setActiveBlock] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (node.data.content) {
      const content = node.data.content as NodeContent;
      setTitle(content.title || '');
      setBlocks(content.items || []);
    }
  }, [node]);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            toggleStyle('bold');
            break;
          case 'i':
            e.preventDefault();
            toggleStyle('italic');
            break;
          case 'u':
            e.preventDefault();
            toggleStyle('underline');
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeBlock]);

  const addBlock = useCallback((type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: '',
      style: {},
    };

    if (type === 'list' || type === 'checklist') {
      newBlock.items = [];
    }

    setBlocks(prev => [...prev, newBlock]);
    setActiveBlock(newBlock.id);
  }, []);

  const updateBlock = useCallback((id: string, updates: Partial<ContentBlock>) => {
    setBlocks(prev => prev.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  }, []);

  const removeBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(block => block.id !== id));
    setActiveBlock(null);
  }, []);

  const toggleStyle = useCallback((styleType: 'bold' | 'italic' | 'underline' | 'highlight') => {
    if (activeBlock) {
      updateBlock(activeBlock, {
        style: {
          ...blocks.find(b => b.id === activeBlock)?.style,
          [styleType]: !blocks.find(b => b.id === activeBlock)?.style?.[styleType]
        }
      });
    }
  }, [activeBlock, blocks, updateBlock]);

  const setColor = useCallback((color: string) => {
    if (activeBlock) {
      updateBlock(activeBlock, {
        style: {
          ...blocks.find(b => b.id === activeBlock)?.style,
          color
        }
      });
    }
  }, [activeBlock, blocks, updateBlock]);

  const addListItem = useCallback((blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (block && (block.type === 'list' || block.type === 'checklist')) {
      updateBlock(blockId, {
        items: [
          ...(block.items || []),
          { 
            id: Date.now().toString(), 
            text: '', 
            checked: block.type === 'checklist' ? false : undefined 
          }
        ]
      });
    }
  }, [blocks, updateBlock]);

  const updateListItem = useCallback((blockId: string, itemId: string, text: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (block) {
      updateBlock(blockId, {
        items: block.items?.map(item => 
          item.id === itemId ? { ...item, text } : item
        )
      });
    }
  }, [blocks, updateBlock]);

  const toggleChecklistItem = useCallback((blockId: string, itemId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (block && block.type === 'checklist') {
      updateBlock(blockId, {
        items: block.items?.map(item => 
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
      });
    }
  }, [blocks, updateBlock]);

  const handleSave = useCallback(() => {
    const content: NodeContent = {
      title,
      description: '', // Mantido para compatibilidade
      items: blocks,
    };
    
    onSave(content);
    toast({
      title: "Conteúdo salvo!",
      description: "As alterações foram salvas com sucesso.",
    });
    onClose();
  }, [title, blocks, onSave, onClose, toast]);

  const getBlockStyle = (block: ContentBlock) => {
    const style: React.CSSProperties = {};
    if (block.style?.bold) style.fontWeight = 'bold';
    if (block.style?.italic) style.fontStyle = 'italic';
    if (block.style?.underline) style.textDecoration = 'underline';
    if (block.style?.color) style.color = block.style.color;
    if (block.style?.highlight) style.backgroundColor = '#fef08a';
    return style;
  };

  const renderBlock = (block: ContentBlock) => {
    const commonProps = {
      style: getBlockStyle(block),
      onFocus: () => setActiveBlock(block.id),
      onBlur: () => setActiveBlock(null),
    };

    switch (block.type) {
      case 'h1':
        return (
          <Input
            key={block.id}
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Título principal..."
            className="text-2xl font-bold border-none p-0 focus-visible:ring-0"
            {...commonProps}
          />
        );
      
      case 'h2':
        return (
          <Input
            key={block.id}
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Subtítulo..."
            className="text-xl font-semibold border-none p-0 focus-visible:ring-0"
            {...commonProps}
          />
        );
      
      case 'subtitle':
        return (
          <Input
            key={block.id}
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Parágrafo de destaque..."
            className="text-lg font-medium border-none p-0 focus-visible:ring-0"
            {...commonProps}
          />
        );
      
      case 'paragraph':
        return (
          <Textarea
            key={block.id}
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            placeholder="Digite seu texto aqui..."
            className="border-none p-0 resize-none focus-visible:ring-0 min-h-[40px]"
            {...commonProps}
          />
        );
      
      case 'link':
        return (
          <div key={block.id} className="space-y-2">
            <Input
              value={block.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="Texto do link..."
              className="border-none p-0 focus-visible:ring-0"
              {...commonProps}
            />
            <Input
              value={block.url || ''}
              onChange={(e) => updateBlock(block.id, { url: e.target.value })}
              placeholder="URL do link..."
              className="text-sm text-blue-600 border-none p-0 focus-visible:ring-0"
            />
          </div>
        );
      
      case 'list':
      case 'checklist':
        return (
          <div key={block.id} className="space-y-2">
            {block.items?.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                {block.type === 'checklist' && (
                  <input
                    type="checkbox"
                    checked={item.checked || false}
                    onChange={() => toggleChecklistItem(block.id, item.id)}
                    className="rounded"
                  />
                )}
                {block.type === 'list' && (
                  <span className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 mt-2"></span>
                )}
                <Input
                  value={item.text}
                  onChange={(e) => updateListItem(block.id, item.id, e.target.value)}
                  placeholder="Item da lista..."
                  className="border-none p-0 focus-visible:ring-0"
                  style={block.type === 'checklist' && item.checked ? { textDecoration: 'line-through', opacity: 0.6 } : {}}
                />
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => addListItem(block.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              + Adicionar item
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <span>Editor de Conteúdo - {String(node.data.label || 'Node')}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <div className="px-6 py-2 border-b flex items-center space-x-2 flex-wrap">
          <Button variant="ghost" size="sm" onClick={() => addBlock('h1')}>
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => addBlock('h2')}>
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => addBlock('subtitle')}>
            <Type className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => addBlock('paragraph')}>
            Parágrafo
          </Button>
          <Button variant="ghost" size="sm" onClick={() => addBlock('list')}>
            <List className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => addBlock('checklist')}>
            <CheckSquare className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => addBlock('link')}>
            <Link className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-6" />

          <Button 
            variant={blocks.find(b => b.id === activeBlock)?.style?.bold ? "default" : "ghost"} 
            size="sm" 
            onClick={() => toggleStyle('bold')}
            disabled={!activeBlock}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button 
            variant={blocks.find(b => b.id === activeBlock)?.style?.italic ? "default" : "ghost"} 
            size="sm" 
            onClick={() => toggleStyle('italic')}
            disabled={!activeBlock}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button 
            variant={blocks.find(b => b.id === activeBlock)?.style?.underline ? "default" : "ghost"} 
            size="sm" 
            onClick={() => toggleStyle('underline')}
            disabled={!activeBlock}
          >
            <Underline className="w-4 h-4" />
          </Button>
          <Button 
            variant={blocks.find(b => b.id === activeBlock)?.style?.highlight ? "default" : "ghost"} 
            size="sm" 
            onClick={() => toggleStyle('highlight')}
            disabled={!activeBlock}
          >
            <Highlighter className="w-4 h-4" />
          </Button>

          <div className="flex space-x-1">
            {['#000000', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'].map((color) => (
              <button
                key={color}
                onClick={() => setColor(color)}
                disabled={!activeBlock}
                className="w-6 h-6 rounded border border-gray-300 disabled:opacity-50"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={editorRef}>
          {/* Title */}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título do documento..."
            className="text-3xl font-bold border-none p-0 focus-visible:ring-0"
          />

          <Separator />

          {/* Content Blocks */}
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <div key={block.id} className="group relative">
                <div className="absolute -left-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBlock(block.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                {renderBlock(block)}
              </div>
            ))}
          </div>

          {/* Add Block Button */}
          {blocks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">Comece adicionando um bloco de conteúdo</p>
              <div className="flex justify-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => addBlock('h1')}>
                  <Heading1 className="w-4 h-4 mr-2" />
                  Título
                </Button>
                <Button variant="outline" size="sm" onClick={() => addBlock('paragraph')}>
                  <Type className="w-4 h-4 mr-2" />
                  Parágrafo
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex justify-between items-center border-t">
          <div className="text-sm text-gray-500">
            Atalhos: Ctrl+B (negrito), Ctrl+I (itálico), Ctrl+U (sublinhado), Ctrl+S (salvar)
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
