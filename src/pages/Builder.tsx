
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { InfiniteCanvas } from "@/components/canvas/InfiniteCanvas";

const Builder = () => {
  const { funnelId } = useParams();
  const navigate = useNavigate();
  const [funnel, setFunnel] = useState<any>(null);
  const [funnelName, setFunnelName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadFunnel = useCallback(() => {
    try {
      const savedFunnels = localStorage.getItem('funnels');
      if (savedFunnels) {
        const funnels = JSON.parse(savedFunnels);
        const currentFunnel = funnels.find((f: any) => f.id === funnelId);
        if (currentFunnel) {
          setFunnel(currentFunnel);
          setFunnelName(currentFunnel.name);
        } else {
          toast({
            title: "Funil não encontrado",
            description: "O funil solicitado não foi encontrado.",
            variant: "destructive",
          });
          navigate('/dashboard');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error loading funnel:', error);
      toast({
        title: "Erro ao carregar",
        description: "Erro ao carregar o funil. Redirecionando...",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [funnelId, navigate, toast]);

  useEffect(() => {
    if (funnelId) {
      loadFunnel();
    } else {
      navigate('/dashboard');
    }
  }, [funnelId, loadFunnel, navigate]);

  const handleFunnelNameChange = useCallback((newName: string) => {
    setFunnelName(newName);
    
    try {
      // Save to localStorage
      const savedFunnels = localStorage.getItem('funnels');
      if (savedFunnels) {
        const funnels = JSON.parse(savedFunnels);
        const updatedFunnels = funnels.map((f: any) => 
          f.id === funnelId 
            ? { ...f, name: newName, updatedAt: new Date().toISOString() }
            : f
        );
        localStorage.setItem('funnels', JSON.stringify(updatedFunnels));
      }
    } catch (error) {
      console.error('Error updating funnel name:', error);
    }
  }, [funnelId]);

  const goBack = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Carregando funil...
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Aguarde enquanto carregamos seu funil.
          </p>
        </div>
      </div>
    );
  }

  if (!funnel) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Funil não encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            O funil solicitado não foi encontrado.
          </p>
          <Button onClick={goBack}>
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back button - positioned absolutely to not interfere with canvas */}
      <Button 
        variant="ghost" 
        onClick={goBack} 
        className="absolute top-4 left-4 z-50 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <InfiniteCanvas
        funnelId={funnelId!}
        funnelName={funnelName}
        onFunnelNameChange={handleFunnelNameChange}
      />
    </div>
  );
};

export default Builder;
