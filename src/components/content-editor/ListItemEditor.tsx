
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

interface ListItem {
  id: string;
  text: string;
  checked?: boolean;
}

interface ListItemEditorProps {
  item: ListItem;
  isChecklist: boolean;
  onUpdate: (text: string) => void;
  onToggle: () => void;
  onRemove?: () => void;
}

export const ListItemEditor = ({ 
  item, 
  isChecklist,
  onUpdate, 
  onToggle,
  onRemove
}: ListItemEditorProps) => {
  return (
    <div className="flex items-center space-x-2 py-1">
      {isChecklist && (
        <input
          type="checkbox"
          checked={item.checked || false}
          onChange={onToggle}
          className="rounded border-gray-300"
        />
      )}
      <Input
        value={item.text}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="Item da lista..."
        className="flex-1"
      />
      {onRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};
