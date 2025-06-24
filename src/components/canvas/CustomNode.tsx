
import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  MousePointer, 
  Mail, 
  MessageCircle, 
  ShoppingCart, 
  Heart,
  FileText,
  Plus,
  Edit3,
  Circle
} from 'lucide-react';

const iconMap = {
  capture: MousePointer,
  sales: Target,
  thankyou: Heart,
  email: Mail,
  whatsapp: MessageCircle,
  checkout: ShoppingCart,
  other: Plus,
  text: FileText,
};

const colorMap = {
  capture: 'bg-blue-500',
  sales: 'bg-green-500',
  thankyou: 'bg-purple-500',
  email: 'bg-yellow-500',
  whatsapp: 'bg-green-600',
  checkout: 'bg-red-500',
  other: 'bg-gray-500',
  text: 'bg-indigo-500',
};

interface NodeContent {
  title?: string;
  description?: string;
  items?: any[];
}

interface CustomNodeData extends Record<string, unknown> {
  label: string;
  type: string;
  content: NodeContent | null;
  hasContent: boolean;
}

export const CustomNode = memo(({ data, selected }: NodeProps<CustomNodeData>) => {
  const [isHovered, setIsHovered] = useState(false);
  const Icon = iconMap[data.type as keyof typeof iconMap] || FileText;
  const bgColor = colorMap[data.type as keyof typeof colorMap] || 'bg-gray-500';

  return (
    <Card 
      className={`
        relative min-w-[200px] p-4 transition-all duration-200 cursor-pointer
        ${selected ? 'ring-2 ring-green-500 shadow-lg' : 'shadow-sm hover:shadow-md'}
        ${isHovered ? 'scale-105' : ''}
        bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Handles for connections */}
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 !bg-green-500 !border-2 !border-white"
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 !bg-green-500 !border-2 !border-white"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 !bg-green-500 !border-2 !border-white"
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 !bg-green-500 !border-2 !border-white"
      />

      {/* Content indicator */}
      {data.hasContent && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <Circle className="w-2 h-2 text-white fill-current" />
        </div>
      )}

      {/* Edit button */}
      {isHovered && (
        <Button
          size="sm"
          variant="ghost"
          className="absolute -top-2 right-2 w-6 h-6 p-0 bg-white dark:bg-gray-700 shadow-md hover:bg-gray-50 dark:hover:bg-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            // This will trigger the double-click handler
            const event = new MouseEvent('dblclick', {
              bubbles: true,
              cancelable: true,
            });
            e.currentTarget.parentElement?.dispatchEvent(event);
          }}
        >
          <Edit3 className="w-3 h-3" />
        </Button>
      )}

      {/* Node content */}
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {data.label}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {data.type}
          </p>
        </div>
      </div>

      {/* Content preview */}
      {data.content && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
            {data.content.title || data.content.description || 'Conteúdo adicionado'}
          </p>
        </div>
      )}
    </Card>
  );
});

CustomNode.displayName = 'CustomNode';
