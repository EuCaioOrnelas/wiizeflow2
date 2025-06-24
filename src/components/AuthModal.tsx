
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onSwitchMode: (mode: 'login' | 'signup') => void;
}

const AuthModal = ({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Redirecionar para a página de autenticação dedicada
      window.location.href = '/auth';
    }
  }, [isOpen]);

  const handleRedirect = () => {
    onClose();
    window.location.href = '/auth';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {mode === 'login' ? 'Fazer Login' : 'Criar Conta'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4 py-6">
          <p className="text-gray-600">
            Redirecionando para a página de autenticação...
          </p>
          
          <Button 
            onClick={handleRedirect}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {mode === 'login' ? 'Ir para Login' : 'Ir para Cadastro'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
