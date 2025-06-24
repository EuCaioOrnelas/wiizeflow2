
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { ContentItem } from '@/types/contentEditor';

interface ListItemEditorProps {
  item: ContentItem;
  onAddListItem: () => void;
  onUpdateListItem: (listItemId: string, text: string) => void;
  onToggleChecklist?: (listItemId: string) => void;
}

export const ListItemEditor = ({ 
  item, 
  onAddListItem, 
  onUpdateListItem, 
  onToggleChecklist 
}: ListItemEditorProps) => {
  return (
    <div className="space-y-2">
      {item.items?.map((listItem) => (
        <div key={listItem.id} className="flex items-center space-x-2">
          {item.type === 'checklist' && onToggleChecklist && (
            <input
              type="checkbox"
              checked={listItem.checked || false}
              onChange={() => onToggleChecklist(listItem.id)}
              className="rounded border-gray-300"
            />
          )}
          <Input
            value={listItem.text}
            onChange={(e) => onUpdateListItem(listItem.id, e.target.value)}
            placeholder="Item da lista..."
            className="flex-1"
          />
        </div>
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={onAddListItem}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar item
      </Button>
    </div>
  );
};
