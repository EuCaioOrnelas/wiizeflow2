
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  X,
} from 'lucide-react';
import { ContentItem } from '@/types/contentEditor';

interface StyleButtonsProps {
  item: ContentItem;
  onToggleStyle: (styleKey: keyof ContentItem['style']) => void;
  onRemove: () => void;
}

export const StyleButtons = ({ item, onToggleStyle, onRemove }: StyleButtonsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        variant={item.style?.bold ? "default" : "outline"}
        onClick={() => onToggleStyle('bold')}
      >
        <Bold className="w-3 h-3" />
      </Button>
      <Button
        size="sm"
        variant={item.style?.italic ? "default" : "outline"}
        onClick={() => onToggleStyle('italic')}
      >
        <Italic className="w-3 h-3" />
      </Button>
      <Button
        size="sm"
        variant={item.style?.underline ? "default" : "outline"}
        onClick={() => onToggleStyle('underline')}
      >
        <Underline className="w-3 h-3" />
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={onRemove}
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
};
