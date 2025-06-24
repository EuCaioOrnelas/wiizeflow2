
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Node } from '@xyflow/react';
import {
  Bold,
  Italic,
  Underline,
  Link,
  List,
  ListOrdered,
  CheckSquare,
  Type,
  Palette,
  Save,
  X,
  Plus
} from 'lucide-react';

interface ContentItem {
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
  url?: string; // For links
  items?: { id: string; text: string; checked?: boolean }[]; // For lists and checklists
}

interface NodeContent {
  title?: string;
  description?: string;
  items?: ContentItem[];
}

interface ContentEditorProps {
  node: Node;
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: NodeContent) => void;
}

export const ContentEditor = ({ node, isOpen, onClose, onSave }: ContentEditorProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (node.data.content) {
      const content = node.data.content as NodeContent;
      setTitle(content.title || '');
      setDescription(content.description || '');
      setContentItems(content.items || []);
    }
  }, [node]);

  const addContentItem = (type: ContentItem['type']) => {
    const newItem: ContentItem = {
      id: Date.now().toString(),
      type,
      content: '',
      style: {},
    };

    if (type === 'list' || type === 'checklist') {
      newItem.items = [];
    }

    setContentItems(prev => [...prev, newItem]);
  };

  const updateContentItem = (id: string, updates: Partial<ContentItem>) => {
    setContentItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeContentItem = (id: string) => {
    setContentItems(prev => prev.filter(item => item.id !== id));
  };

  const addListItem = (itemId: string) => {
    setContentItems(prev => prev.map(item => {
      if (item.id === itemId && (item.type === 'list' || item.type === 'checklist')) {
        return {
          ...item,
          items: [
            ...(item.items || []),
            { 
              id: Date.now().toString(), 
              text: '', 
              checked: item.type === 'checklist' ? false : undefined 
            }
          ]
        };
      }
      return item;
    }));
  };

  const updateListItem = (itemId: string, listItemId: string, text: string) => {
    setContentItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          items: item.items?.map(listItem => 
            listItem.id === listItemId ? { ...listItem, text } : listItem
          )
        };
      }
      return item;
    }));
  };

  const toggleChecklistItem = (itemId: string, listItemId: string) => {
    setContentItems(prev => prev.map(item => {
      if (item.id === itemId && item.type === 'checklist') {
        return {
          ...item,
          items: item.items?.map(listItem => 
            listItem.id === listItemId ? { ...listItem, checked: !listItem.checked } : listItem
          )
        };
      }
      return item;
    }));
  };

  const toggleStyle = (id: string, styleKey: keyof ContentItem['style']) => {
    setContentItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          style: {
            ...item.style,
            [styleKey]: !item.style?.[styleKey]
          }
        };
      }
      return item;
    }));
  };

  const handleSave = () => {
    const content: NodeContent = {
      title,
      description,
      items: contentItems,
    };
    
    onSave(content);
    toast({
      title: "Conteúdo salvo!",
      description: "As alterações foram salvas com sucesso.",
    });
    onClose();
  };

  const getContentPreview = (item: ContentItem): string => {
    switch (item.type) {
      case 'h1':
        return `# ${item.content}`;
      case 'h2':
        return `## ${item.content}`;
      case 'subtitle':
        return `### ${item.content}`;
      case 'paragraph':
        return item.content;
      case 'list':
        return `• ${item.items?.map(i => i.text).join(', ') || 'Lista vazia'}`;
      case 'checklist':
        return `☑ ${item.items?.map(i => i.text).join(', ') || 'Checklist vazia'}`;
      case 'link':
        return `🔗 ${item.content} (${item.url || ''})`;
      default:
        return item.content;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Editar Conteúdo - {node.data.label}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Título Principal
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título principal..."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Descrição
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite uma descrição..."
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Content Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Conteúdo Estruturado</h3>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => addContentItem('h1')}>
                  <Type className="w-4 h-4 mr-2" />
                  H1
                </Button>
                <Button size="sm" variant="outline" onClick={() => addContentItem('h2')}>
                  <Type className="w-4 h-4 mr-2" />
                  H2
                </Button>
                <Button size="sm" variant="outline" onClick={() => addContentItem('paragraph')}>
                  <Type className="w-4 h-4 mr-2" />
                  Parágrafo
                </Button>
                <Button size="sm" variant="outline" onClick={() => addContentItem('list')}>
                  <List className="w-4 h-4 mr-2" />
                  Lista
                </Button>
                <Button size="sm" variant="outline" onClick={() => addContentItem('checklist')}>
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Checklist
                </Button>
                <Button size="sm" variant="outline" onClick={() => addContentItem('link')}>
                  <Link className="w-4 h-4 mr-2" />
                  Link
                </Button>
              </div>
            </div>

            {/* Content Items List */}
            <div className="space-y-4">
              {contentItems.map((item) => (
                <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
                      {item.type}
                    </span>
                    <div className="flex items-center space-x-2">
                      {/* Style buttons */}
                      <Button
                        size="sm"
                        variant={item.style?.bold ? "default" : "outline"}
                        onClick={() => toggleStyle(item.id, 'bold')}
                      >
                        <Bold className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant={item.style?.italic ? "default" : "outline"}
                        onClick={() => toggleStyle(item.id, 'italic')}
                      >
                        <Italic className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant={item.style?.underline ? "default" : "outline"}
                        onClick={() => toggleStyle(item.id, 'underline')}
                      >
                        <Underline className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeContentItem(item.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Content input based on type */}
                  {(item.type === 'h1' || item.type === 'h2' || item.type === 'subtitle' || item.type === 'paragraph') && (
                    <Input
                      value={item.content}
                      onChange={(e) => updateContentItem(item.id, { content: e.target.value })}
                      placeholder={`Digite o ${item.type}...`}
                    />
                  )}

                  {item.type === 'link' && (
                    <div className="space-y-2">
                      <Input
                        value={item.content}
                        onChange={(e) => updateContentItem(item.id, { content: e.target.value })}
                        placeholder="Texto do link..."
                      />
                      <Input
                        value={item.url || ''}
                        onChange={(e) => updateContentItem(item.id, { url: e.target.value })}
                        placeholder="URL do link..."
                      />
                    </div>
                  )}

                  {(item.type === 'list' || item.type === 'checklist') && (
                    <div className="space-y-2">
                      {item.items?.map((listItem) => (
                        <div key={listItem.id} className="flex items-center space-x-2">
                          {item.type === 'checklist' && (
                            <input
                              type="checkbox"
                              checked={listItem.checked || false}
                              onChange={() => toggleChecklistItem(item.id, listItem.id)}
                              className="rounded border-gray-300"
                            />
                          )}
                          <Input
                            value={listItem.text}
                            onChange={(e) => updateListItem(item.id, listItem.id, e.target.value)}
                            placeholder="Item da lista..."
                            className="flex-1"
                          />
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addListItem(item.id)}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar item
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar Conteúdo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
