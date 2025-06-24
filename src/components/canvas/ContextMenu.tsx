
import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Copy,
  Paste,
  Trash2,
  Edit3,
  Link,
  Group,
  Duplicate
} from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  nodeId?: string;
  onClose: () => void;
  onDuplicate: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onCopy: () => void;
  onPaste: () => void;
}

export const ContextMenu = ({ 
  x, 
  y, 
  nodeId, 
  onClose, 
  onDuplicate, 
  onDelete, 
  onCopy, 
  onPaste 
}: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <Card
      ref={menuRef}
      className="fixed z-50 p-2 shadow-lg border bg-white dark:bg-gray-800 min-w-[200px]"
      style={{
        left: x,
        top: y,
      }}
    >
      <div className="space-y-1">
        {nodeId ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleAction(() => onDuplicate(nodeId))}
            >
              <Duplicate className="w-4 h-4 mr-2" />
              Duplicar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleAction(onCopy)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar
            </Button>
            <Separator />
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleAction(() => onDelete(nodeId))}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Deletar
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => handleAction(onPaste)}
            >
              <Paste className="w-4 h-4 mr-2" />
              Colar
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
