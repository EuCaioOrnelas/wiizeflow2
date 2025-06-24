
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { EdgeType } from '@/types/canvas';
import { Minus, CornerDownRight, Zap, Route, Workflow } from 'lucide-react';

interface EdgeTypeSelectorProps {
  currentType: EdgeType;
  onTypeChange: (type: EdgeType) => void;
}

export const EdgeTypeSelector = ({ currentType, onTypeChange }: EdgeTypeSelectorProps) => {
  const edgeTypes: { type: EdgeType; name: string; icon: React.ReactNode; description: string }[] = [
    { 
      type: 'default', 
      name: 'Padrão', 
      icon: <Minus className="w-4 h-4" />, 
      description: 'Linha reta simples' 
    },
    { 
      type: 'straight', 
      name: 'Reta', 
      icon: <Minus className="w-4 h-4" />, 
      description: 'Linha completamente reta' 
    },
    { 
      type: 'step', 
      name: 'Escada', 
      icon: <CornerDownRight className="w-4 h-4" />, 
      description: 'Linha em formato de escada' 
    },
    { 
      type: 'smoothstep', 
      name: 'Escada Suave', 
      icon: <Route className="w-4 h-4" />, 
      description: 'Linha em escada com cantos arredondados' 
    },
    { 
      type: 'simplebezier', 
      name: 'Curva', 
      icon: <Workflow className="w-4 h-4" />, 
      description: 'Linha curva suave' 
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Zap className="w-4 h-4 mr-2" />
          Tipo de Linha
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium text-sm mb-3">Escolher Tipo de Linha</h4>
          {edgeTypes.map((edgeType) => (
            <button
              key={edgeType.type}
              onClick={() => onTypeChange(edgeType.type)}
              className={`w-full p-3 text-left rounded-lg border transition-colors hover:bg-gray-50 ${
                currentType === edgeType.type 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {edgeType.icon}
                </div>
                <div>
                  <div className="font-medium text-sm">{edgeType.name}</div>
                  <div className="text-xs text-gray-500">{edgeType.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
