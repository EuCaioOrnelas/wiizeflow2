
import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CustomNodeData } from '@/types/canvas';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Target, 
  MousePointer, 
  Mail, 
  MessageCircle, 
  ShoppingCart, 
  Heart,
  FileText,
  Plus,
  Palette,
  Edit3,
  Circle
} from 'lucide-react';

interface CustomNodeComponentProps extends NodeProps {
  data: CustomNodeData;
  onUpdateNode?: (nodeId: string, updates: Partial<CustomNodeData>) => void;
  onOpenEditor?: (nodeId: string) => void;
}

const emojis = ['📝', '🚀', '⚙️', '💡', '🎯', '📊', '💰', '🔥', '✨', '⭐', '🎨', '📈', '🔔', '🎉', '💎', '🏆'];
const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export const CustomNode = memo(({ id, data, selected, onUpdateNode }: CustomNodeComponentProps) => {
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'capture':
        return <MousePointer className="w-4 h-4 text-white" />;
      case 'sales':
        return <Target className="w-4 h-4 text-white" />;
      case 'thankyou':
        return <Heart className="w-4 h-4 text-white" />;
      case 'checkout':
        return <ShoppingCart className="w-4 h-4 text-white" />;
      case 'email':
        return <Mail className="w-4 h-4 text-white" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4 text-white" />;
      case 'text':
        return <FileText className="w-4 h-4 text-white" />;
      case 'other':
        if (data.customIcon) {
          return <span className="text-white text-sm">{data.customIcon}</span>;
        }
        return <Plus className="w-4 h-4 text-white" />;
      default:
        return <FileText className="w-4 h-4 text-white" />;
    }
  };

  const getNodeColor = (type: string) => {
    if (type === 'other' && data.customColor) {
      return `border-2 text-gray-800`;
    }
    
    switch (type) {
      case 'capture':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'sales':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'thankyou':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'checkout':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'email':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'whatsapp':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'text':
        return 'bg-indigo-100 border-indigo-300 text-indigo-800';
      case 'other':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getIconBackgroundColor = (type: string) => {
    if (type === 'other' && data.customColor) {
      return { backgroundColor: data.customColor };
    }
    
    switch (type) {
      case 'capture':
        return 'bg-blue-500';
      case 'sales':
        return 'bg-green-500';
      case 'thankyou':
        return 'bg-purple-500';
      case 'checkout':
        return 'bg-red-500';
      case 'email':
        return 'bg-yellow-500';
      case 'whatsapp':
        return 'bg-green-600';
      case 'text':
        return 'bg-indigo-500';
      case 'other':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleCustomIconChange = (icon: string) => {
    if (data.type === 'other' && onUpdateNode) {
      onUpdateNode(id, { customIcon: icon });
    }
    setShowCustomizer(false);
  };

  const handleCustomColorChange = (color: string) => {
    if (data.type === 'other' && onUpdateNode) {
      onUpdateNode(id, { customColor: color });
    }
    setShowCustomizer(false);
  };

  const handleOpenEditor = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Trigger double click event to open content editor
    const event = new MouseEvent('dblclick', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    e.currentTarget.parentElement?.dispatchEvent(event);
  };

  const hasContent = data.hasContent && data.content;
  const nodeColor = getNodeColor(data.type);
  const selectedClass = selected ? 'ring-2 ring-blue-500 ring-opacity-50' : '';
  const iconBgClass = getIconBackgroundColor(data.type);

  return (
    <div className={`relative ${selectedClass}`} 
         onMouseEnter={() => setShowEditButton(true)}
         onMouseLeave={() => setShowEditButton(false)}>
      
      {/* Indicador de conteúdo */}
      {hasContent && (
        <div className="absolute -top-1 -right-1 z-10">
          <Circle className="w-3 h-3 text-blue-500 fill-blue-500" />
        </div>
      )}

      {/* Botão de edição */}
      {showEditButton && (
        <div className="absolute -top-2 -right-8 z-10">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 bg-white shadow-md hover:bg-gray-50"
            onClick={handleOpenEditor}
          >
            <Edit3 className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Handles nas 4 direções - agora menores e mais suaves - todos como source e target */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ top: -3 }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ top: -3 }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ left: -3 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ left: -3 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ right: -3 }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ right: -3 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ bottom: -3 }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="w-1.5 h-1.5 !bg-gray-400 !border-gray-600 opacity-0 hover:opacity-60"
        style={{ bottom: -3 }}
      />
      
      <div className={`
        px-4 py-3 rounded-lg border-2 shadow-md min-w-[120px] max-w-[200px]
        ${nodeColor} ${selectedClass}
        transition-all duration-200 hover:shadow-lg
      `}>
        <div className="flex items-center space-x-2 mb-1">
          <div className={`w-6 h-6 ${typeof iconBgClass === 'string' ? iconBgClass : ''} rounded flex items-center justify-center flex-shrink-0`}
               style={typeof iconBgClass === 'object' ? iconBgClass : {}}>
            {getNodeIcon(data.type)}
          </div>
          <span className="font-medium text-sm">{data.label}</span>
          
          {data.type === 'other' && (
            <Popover open={showCustomizer} onOpenChange={setShowCustomizer}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                  <Palette className="w-3 h-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Escolher Emoji</h4>
                    <div className="grid grid-cols-8 gap-1">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleCustomIconChange(emoji)}
                          className="w-8 h-8 text-lg hover:bg-gray-100 rounded flex items-center justify-center"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Escolher Cor</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleCustomColorChange(color)}
                          className="w-8 h-8 rounded border-2 border-gray-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        
        <div className="text-xs opacity-75 capitalize mb-2">
          {data.type === 'capture' ? 'Captura' : 
           data.type === 'sales' ? 'Vendas' :
           data.type === 'thankyou' ? 'Obrigado' :
           data.type === 'checkout' ? 'Checkout' :
           data.type === 'email' ? 'E-mail' :
           data.type === 'whatsapp' ? 'WhatsApp' :
           data.type === 'text' ? 'Anotação' :
           data.type === 'other' ? 'Customizado' : data.type}
        </div>

        {hasContent && (
          <div className="text-xs bg-white bg-opacity-50 rounded p-1 mt-2">
            {data.content && data.content.title && (
              <div className="font-medium truncate">{data.content.title}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
