
import { useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { CustomNodeData, Template } from '@/types/canvas';
import { useToast } from '@/hooks/use-toast';

export const useTemplateOperations = () => {
  const { toast } = useToast();

  const saveTemplate = useCallback((
    name: string,
    description: string,
    nodes: Node<CustomNodeData>[],
    edges: Edge[]
  ) => {
    const template: Template = {
      id: `template-${Date.now()}`,
      name,
      description,
      nodes,
      edges,
      createdAt: new Date().toISOString()
    };

    const savedTemplates = localStorage.getItem('canvas-templates');
    const templates = savedTemplates ? JSON.parse(savedTemplates) : [];
    templates.push(template);
    localStorage.setItem('canvas-templates', JSON.stringify(templates));

    toast({
      title: "Template salvo!",
      description: `Template "${name}" foi salvo com sucesso.`,
    });

    return template;
  }, [toast]);

  const loadTemplates = useCallback((): Template[] => {
    const savedTemplates = localStorage.getItem('canvas-templates');
    return savedTemplates ? JSON.parse(savedTemplates) : [];
  }, []);

  const deleteTemplate = useCallback((templateId: string) => {
    const savedTemplates = localStorage.getItem('canvas-templates');
    if (savedTemplates) {
      const templates = JSON.parse(savedTemplates);
      const updatedTemplates = templates.filter((t: Template) => t.id !== templateId);
      localStorage.setItem('canvas-templates', JSON.stringify(updatedTemplates));
      
      toast({
        title: "Template removido!",
        description: "Template foi removido com sucesso.",
      });
    }
  }, [toast]);

  const exportTemplate = useCallback((template: Template) => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.name}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template exportado!",
      description: `Template "${template.name}" foi exportado com sucesso.`,
    });
  }, [toast]);

  const importTemplate = useCallback((file: File): Promise<Template> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const template = JSON.parse(e.target?.result as string) as Template;
          
          // Validate template structure
          if (!template.id || !template.name || !template.nodes || !template.edges) {
            throw new Error('Invalid template format');
          }

          // Generate new ID to avoid conflicts
          template.id = `template-${Date.now()}`;
          template.createdAt = new Date().toISOString();

          // Save imported template
          const savedTemplates = localStorage.getItem('canvas-templates');
          const templates = savedTemplates ? JSON.parse(savedTemplates) : [];
          templates.push(template);
          localStorage.setItem('canvas-templates', JSON.stringify(templates));

          toast({
            title: "Template importado!",
            description: `Template "${template.name}" foi importado com sucesso.`,
          });

          resolve(template);
        } catch (error) {
          toast({
            title: "Erro ao importar",
            description: "Arquivo de template inválido.",
            variant: "destructive"
          });
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  }, [toast]);

  return {
    saveTemplate,
    loadTemplates,
    deleteTemplate,
    exportTemplate,
    importTemplate
  };
};
