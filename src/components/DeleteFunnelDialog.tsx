
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

interface DeleteFunnelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  funnelName: string;
  isDeleting: boolean;
}

export const DeleteFunnelDialog = ({
  isOpen,
  onClose,
  onConfirm,
  funnelName,
  isDeleting
}: DeleteFunnelDialogProps) => {
  const [confirmText, setConfirmText] = useState('');

  const handleClose = () => {
    setConfirmText('');
    onClose();
  };

  const handleConfirm = () => {
    if (confirmText === 'DELETE') {
      onConfirm();
      setConfirmText('');
    }
  };

  const isValid = confirmText === 'DELETE';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <DialogTitle className="text-red-600">Excluir Funil</DialogTitle>
          </div>
          <DialogDescription className="text-left space-y-2">
            <p>
              Você está prestes a excluir permanentemente o funil <strong>"{funnelName}"</strong>.
            </p>
            <p className="text-red-600 font-medium">
              ⚠️ Esta ação não pode ser desfeita! Todos os dados do funil serão perdidos permanentemente.
            </p>
            <p>
              Para confirmar a exclusão, digite <strong>DELETE</strong> no campo abaixo:
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="confirm">Digite "DELETE" para confirmar:</Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="mt-1"
              disabled={isDeleting}
            />
          </div>

          <div className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={!isValid || isDeleting}
            >
              {isDeleting ? 'Excluindo...' : 'Excluir Permanentemente'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
