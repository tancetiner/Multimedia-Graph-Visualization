// NoLayout.tsx
import React from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";

interface NoLayoutProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  nodeTypes: NodeTypes;
}

const NoLayout: React.FC<NoLayoutProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  nodeTypes,
}) => {
  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
      )
    </div>
  );
};

export default NoLayout;
