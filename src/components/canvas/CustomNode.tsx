
import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { CustomNodeData } from '@/types/canvas';

interface CustomNodeComponentProps extends NodeProps {
  data: CustomNodeData;
}

export const CustomNode = memo(({ data, selected }: CustomNodeComponentProps) => {
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'start':
        return '🚀';
      case 'process':
        return '⚙️';
      case 'decision':
        return '❓';
      case 'end':
        return '🏁';
      default:
        return '📝';
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'start':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'process':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'decision':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'end':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const hasContent = data.hasContent && data.content;
  const nodeColor = getNodeColor(data.type);
  const selectedClass = selected ? 'ring-2 ring-blue-500 ring-opacity-50' : '';

  return (
    <div className={`relative ${selectedClass}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-gray-400"
      />
      
      <div className={`
        px-4 py-3 rounded-lg border-2 shadow-md min-w-[120px] max-w-[200px]
        ${nodeColor} ${selectedClass}
        transition-all duration-200 hover:shadow-lg
      `}>
        <div className="flex items-center space-x-2 mb-1">
          <span className="text-lg">{getNodeIcon(data.type)}</span>
          <span className="font-medium text-sm">{data.label}</span>
        </div>
        
        <div className="text-xs opacity-75 capitalize mb-2">
          {data.type}
        </div>

        {hasContent && (
          <div className="text-xs bg-white bg-opacity-50 rounded p-1 mt-2">
            {data.content && data.content.title && (
              <div className="font-medium">{data.content.title}</div>
            )}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-gray-400"
      />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';
