
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTemplateOperations } from '@/hooks/useTemplateOperations';
import { Template } from '@/types/canvas';
import { Download, Upload, Trash2, Save, FolderOpen } from 'lucide-react';

interface TemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTemplate: (template: Template) => void;
  onSaveTemplate: () => { nodes: any[], edges: any[] };
}

export const TemplateManager = ({ 
  isOpen, 
  onClose, 
  onLoadTemplate, 
  onSaveTemplate 
}: TemplateManagerProps) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { 
    saveTemplate, 
    loadTemplates, 
    deleteTemplate, 
    exportTemplate, 
    importTemplate 
  } = useTemplateOperations();

  const handleOpen = () => {
    setTemplates(loadTemplates());
  };

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      const { nodes, edges } = onSaveTemplate();
      saveTemplate(templateName, templateDescription, nodes, edges);
      setTemplateName('');
      setTemplateDescription('');
      setShowSaveDialog(false);
      setTemplates(loadTemplates());
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplate(templateId);
    setTemplates(loadTemplates());
    setTemplateToDelete(null);
  };

  const handleImportTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importTemplate(file).then(() => {
        setTemplates(loadTemplates());
      }).catch(() => {
        // Error handled in hook
      });
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" onOpenAutoFocus={handleOpen}>
          <DialogHeader>
            <DialogTitle>Gerenciar Templates</DialogTitle>
            <DialogDescription>
              Salve, carregue, importe e exporte templates do seu canvas
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={() => setShowSaveDialog(true)}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Salvar Template
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Importar
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportTemplate}
                className="hidden"
              />
            </div>

            {/* Templates List */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-sm">{template.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {template.description || 'Sem descrição'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {template.nodes.length} nós • {template.edges.length} conexões
                    </p>
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onLoadTemplate(template);
                        onClose();
                      }}
                      className="flex-1 text-xs"
                    >
                      <FolderOpen className="w-3 h-3 mr-1" />
                      Carregar
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => exportTemplate(template)}
                      className="text-xs"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setTemplateToDelete(template.id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {templates.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <p>Nenhum template salvo ainda.</p>
                  <p className="text-sm">Crie seu primeiro template!</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Template Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Salvar Template</DialogTitle>
            <DialogDescription>
              Salve o estado atual do canvas como um template
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="template-name">Nome do Template</Label>
              <Input
                id="template-name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Digite o nome do template"
              />
            </div>
            
            <div>
              <Label htmlFor="template-description">Descrição (opcional)</Label>
              <Textarea
                id="template-description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                placeholder="Descreva o template..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveTemplate} disabled={!templateName.trim()}>
              Salvar Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!templateToDelete} onOpenChange={() => setTemplateToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Template</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este template? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTemplateToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => templateToDelete && handleDeleteTemplate(templateToDelete)}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
