
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Node } from '@xyflow/react';
import { Save, X } from 'lucide-react';
import { CustomNodeData, NodeContent } from '@/types/canvas';
import { useContentEditor } from '@/hooks/useContentEditor';
import { ContentItemButtons } from '@/components/content-editor/ContentItemButtons';
import { ContentItemCard } from '@/components/content-editor/ContentItemCard';

interface ContentEditorProps {
  node: Node<CustomNodeData>;
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: NodeContent) => void;
}

export const ContentEditor = ({ node, isOpen, onClose, onSave }: ContentEditorProps) => {
  const { toast } = useToast();
  
  const {
    title,
    description,
    contentItems,
    setTitle,
    setDescription,
    addContentItem,
    updateContentItem,
    removeContentItem,
    addListItem,
    updateListItem,
    toggleChecklistItem,
    handleSave,
  } = useContentEditor({ node, onSave });

  const onSaveAndClose = () => {
    handleSave();
    toast({
      title: "Conteúdo salvo!",
      description: "As alterações foram salvas com sucesso.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Editar Conteúdo - {String(node.data.label || 'Node')}</span>
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
              <ContentItemButtons onAddItem={addContentItem} />
            </div>

            {/* Content Items List */}
            <div className="space-y-4">
              {contentItems.map((item) => (
                <ContentItemCard
                  key={item.id}
                  item={item}
                  onUpdate={(updates) => updateContentItem(item.id, updates)}
                  onRemove={() => removeContentItem(item.id)}
                  onAddListItem={() => addListItem(item.id)}
                  onUpdateListItem={(listItemId, text) => updateListItem(item.id, listItemId, text)}
                  onToggleChecklist={(listItemId) => toggleChecklistItem(item.id, listItemId)}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={onSaveAndClose} className="bg-green-600 hover:bg-green-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar Conteúdo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
