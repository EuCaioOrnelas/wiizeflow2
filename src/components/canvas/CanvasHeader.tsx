
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit3, Undo, Redo } from 'lucide-react';
import { CanvasToolbar } from './CanvasToolbar';

interface CanvasHeaderProps {
  funnelName: string;
  onFunnelNameChange: (name: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExportAsImage: () => void;
  onExportAsPDF: () => void;
  onSave: () => void;
}

export const CanvasHeader = ({
  funnelName,
  onFunnelNameChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExportAsImage,
  onExportAsPDF,
  onSave
}: CanvasHeaderProps) => {
  const [isEditingName, setIsEditingName] = useState(false);

  return (
    <div className="h-16 border-b bg-white dark:bg-gray-800 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        {isEditingName ? (
          <Input
            value={funnelName}
            onChange={(e) => onFunnelNameChange(e.target.value)}
            onBlur={() => setIsEditingName(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setIsEditingName(false);
              }
            }}
            className="text-xl font-bold"
            autoFocus
          />
        ) : (
          <h1 
            className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-green-600"
            onClick={() => setIsEditingName(true)}
          >
            {funnelName}
            <Edit3 className="w-4 h-4 inline ml-2" />
          </h1>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onUndo} disabled={!canUndo}>
          <Undo className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onRedo} disabled={!canRedo}>
          <Redo className="w-4 h-4" />
        </Button>
        <CanvasToolbar
          onExportAsImage={onExportAsImage}
          onExportAsPDF={onExportAsPDF}
          onSave={onSave}
        />
      </div>
    </div>
  );
};
