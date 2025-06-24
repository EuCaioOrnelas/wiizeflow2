
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { InfiniteCanvas } from "@/components/canvas/InfiniteCanvas";

const Builder = () => {
  const { funnelId } = useParams();
  const [funnel, setFunnel] = useState<any>(null);
  const [funnelName, setFunnelName] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const savedFunnels = localStorage.getItem('funnels');
    if (savedFunnels) {
      const funnels = JSON.parse(savedFunnels);
      const currentFunnel = funnels.find((f: any) => f.id === funnelId);
      if (currentFunnel) {
        setFunnel(currentFunnel);
        setFunnelName(currentFunnel.name);
      }
    }
  }, [funnelId]);

  const handleFunnelNameChange = (newName: string) => {
    setFunnelName(newName);
    
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
  };

  const goBack = () => {
    window.location.href = '/dashboard';
  };

  if (!funnel) {
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
