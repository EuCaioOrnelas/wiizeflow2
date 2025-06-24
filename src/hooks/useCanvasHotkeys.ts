
import { useHotkeys } from 'react-hotkeys-hook';

interface UseCanvasHotkeysProps {
  onUndo: () => void;
  onRedo: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onSave: () => void;
}

export const useCanvasHotkeys = ({
  onUndo,
  onRedo,
  onCopy,
  onPaste,
  onDelete,
  onSave
}: UseCanvasHotkeysProps) => {
  useHotkeys('ctrl+z, cmd+z', onUndo);
  useHotkeys('ctrl+y, cmd+y, ctrl+shift+z, cmd+shift+z', onRedo);
  useHotkeys('ctrl+c, cmd+c', onCopy);
  useHotkeys('ctrl+v, cmd+v', onPaste);
  useHotkeys('delete, backspace', onDelete);
  useHotkeys('ctrl+s, cmd+s', (e) => {
    e.preventDefault();
    onSave();
  });
};
