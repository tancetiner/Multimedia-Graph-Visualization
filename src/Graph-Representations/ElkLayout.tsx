import ELK from "elkjs/lib/elk.bundled.js";
import React, { useCallback } from "react";
import ReactFlow, {
  Background,
  Panel,
  useReactFlow,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Controls,
  MiniMap,
  NodeTypes,
} from "reactflow";

import "reactflow/dist/style.css";

const elk = new ELK();

const useLayoutedElements = () => {
  const { getNodes, setNodes, getEdges, fitView } = useReactFlow();
  const defaultOptions = {
    "elk.algorithm": "layered",
    "elk.layered.spacing.nodeNodeBetweenLayers": 100,
    "elk.spacing.nodeNode": 80,
  };

  const getLayoutedElements = useCallback((options: Record<string, any>) => {
    const layoutOptions = { ...defaultOptions, ...options };
    const graph = {
      id: "root",
      layoutOptions: layoutOptions,
      children: getNodes(),
      edges: getEdges(),
    };

    elk.layout(graph).then(({ children }) => {
      if (children) {
        // By mutating the children in-place we saves ourselves from creating a
        // needless copy of the nodes array.
        children.forEach((node) => {
          node.position = { x: node.x, y: node.y };
          node.width = node.width || 0; // Handle null width
        });

        setNodes(children);
        window.requestAnimationFrame(() => {
          fitView();
        });
      }
    });
  }, []);

  return { getLayoutedElements };
};

interface ElkLayoutProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  nodeTypes: NodeTypes;
  edgeTypes: any;
  changeLayoutDirection: (direction: string) => void;
}

const DagreLayout: React.FC<ElkLayoutProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  nodeTypes,
  edgeTypes,
  changeLayoutDirection,
}) => {
  const { getLayoutedElements } = useLayoutedElements();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
    >
      <Panel position="top-right" className="space-x-4">
        <button
          onClick={() => {
            getLayoutedElements({
              "elk.direction": "DOWN",
            });
            changeLayoutDirection("vertical");
          }}
        >
          Vertical Layout
        </button>
        <button
          onClick={() => {
            getLayoutedElements({
              "elk.direction": "RIGHT",
            });
            changeLayoutDirection("horizontal");
          }}
        >
          Horizontal Layout
        </button>
      </Panel>
      <Background gap={12} size={1} />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
};

export default DagreLayout;
