
import { Input } from '@/components/ui/input';
import { StyleButtons } from './StyleButtons';
import { ListItemEditor } from './ListItemEditor';
import { ContentItem } from '@/types/contentEditor';

interface ContentItemCardProps {
  item: ContentItem;
  onUpdate: (updates: Partial<ContentItem>) => void;
  onRemove: () => void;
  onAddListItem: () => void;
  onUpdateListItem: (listItemId: string, text: string) => void;
  onToggleChecklist: (listItemId: string) => void;
}

export const ContentItemCard = ({
  item,
  onUpdate,
  onRemove,
  onAddListItem,
  onUpdateListItem,
  onToggleChecklist,
}: ContentItemCardProps) => {
  const toggleStyle = (styleKey: keyof ContentItem['style']) => {
    onUpdate({
      style: {
        ...item.style,
        [styleKey]: !item.style?.[styleKey]
      }
    });
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">
          {item.type}
        </span>
        <StyleButtons
          item={item}
          onToggleStyle={toggleStyle}
          onRemove={onRemove}
        />
      </div>

      {/* Content input based on type */}
      {(item.type === 'h1' || item.type === 'h2' || item.type === 'subtitle' || item.type === 'paragraph') && (
        <Input
          value={item.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder={`Digite o ${item.type}...`}
        />
      )}

      {item.type === 'link' && (
        <div className="space-y-2">
          <Input
            value={item.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            placeholder="Texto do link..."
          />
          <Input
            value={item.url || ''}
            onChange={(e) => onUpdate({ url: e.target.value })}
            placeholder="URL do link..."
          />
        </div>
      )}

      {(item.type === 'list' || item.type === 'checklist') && (
        <ListItemEditor
          item={item}
          onAddListItem={onAddListItem}
          onUpdateListItem={onUpdateListItem}
          onToggleChecklist={item.type === 'checklist' ? onToggleChecklist : undefined}
        />
      )}
    </div>
  );
};
