import Dagre from "@dagrejs/dagre";
import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  Panel,
  useReactFlow,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Background,
  Controls,
  MiniMap,
} from "reactflow";

import { BlockType } from "../Helpers/FilterGraph";

import "reactflow/dist/style.css";
import CustomNode from "../Helpers/CustomNode";

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, options) => {
  g.setGraph({ rankdir: options.direction });

  nodes.forEach((node) => g.setNode(node.id, node));
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));

  Dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const { x, y } = g.node(node.id);
    return { ...node, position: { x, y } };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
};

const adjustNodePositions = (nodes: Node[]) => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  const inputNodes = nodes.filter(
    (node) => node.data.blockType === BlockType.INPUT
  );
  const outputNodes = nodes.filter(
    (node) => node.data.blockType === BlockType.OUTPUT
  );
  const nonIOBlocks = nodes.filter(
    (node) =>
      node.data.blockType !== BlockType.INPUT &&
      node.data.blockType !== BlockType.OUTPUT
  );

  nonIOBlocks.forEach((node) => {
    if (node.position.x < minX) minX = node.position.x;
    if (node.position.x > maxX) maxX = node.position.x;
    if (node.position.y < minY) minY = node.position.y;
    if (node.position.y > maxY) maxY = node.position.y;
  });

  inputNodes.sort((a, b) => a.position.y - b.position.y);

  outputNodes.sort((a, b) => a.position.y - b.position.y);

  // Adjust input nodes to the most left position
  let distanceY = maxY - minY;
  let intervalY = (distanceY * 2) / inputNodes.length - 1;
  let midY = (minY + maxY) / 2;
  let midIdx = Math.floor(inputNodes.length / 2);
  inputNodes.forEach((node, idx) => {
    node.position = {
      x: minX - 200,
      y: midY + (idx - midIdx) * intervalY,
    };
  });

  // Adjust output nodes to the most right position
  intervalY = (distanceY * 2) / inputNodes.length - 1;
  midY = (minY + maxY) / 2;
  midIdx = Math.floor(inputNodes.length / 2);
  outputNodes.forEach((node, idx) => {
    node.position = { x: maxX + 200, y: midY + (idx - midIdx) * intervalY };
  });

  return [...nonIOBlocks, ...inputNodes, ...outputNodes];
};

const nodeTypes = {
  customNode: CustomNode,
};

interface DagreLayoutProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

const DagreLayout: React.FC<DagreLayoutProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  setNodes,
  setEdges,
}) => {
  const { fitView } = useReactFlow();

  useEffect(() => {
    onLayout("LR");
  }, []);

  const onLayout = useCallback(
    (direction) => {
      const layouted = getLayoutedElements(nodes, edges, { direction });
      const adjustedNodes = adjustNodePositions(layouted.nodes);

      setNodes([...adjustedNodes]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Panel position="top-right" className="space-x-4">
          <button onClick={() => onLayout("LR")}>Horizontal Layout</button>
        </Panel>
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default DagreLayout;
