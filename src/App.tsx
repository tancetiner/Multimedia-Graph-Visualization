import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
} from "reactflow";

import initializeGraph, { Block } from "./FilterGraph";
import "reactflow/dist/style.css";

const positions = [
  { y: 10, x: 10 },
  { y: 10, x: 1200 },
  { y: 10, x: 200 },
  { y: 10, x: 400 },
  { y: 10, x: 600 },
  { y: 10, x: 800 },
  { y: 10, x: 1000 },
];

const blocksToNodes = (blocks: Map<number, Block>) => {
  return Array.from(blocks.values()).map((block, i) => {
    console.log(block);
    return {
      id: block.id.toString(),
      position: positions[i],
      data: { label: block.name, blockType: block.type },
    };
  });
};

const blocksToEdges = (blocks: Map<number, Block>) => {
  const edges: Edge[] = [];
  for (let i = 0; i < blocks.size; i++) {
    const block = blocks.get(i);
    if (block) {
      for (let j = 0; j < block.out_ids.length; j++) {
        edges.push({
          id: `e${block.id}-${block.out_ids[j]}`,
          source: block.id.toString(),
          target: block.out_ids[j].toString(),
          label: "to the",
        });
      }
    }
  }

  return edges;
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [blocks, setBlocks] = useState<Map<number, Block>>(new Map());

  useEffect(() => {
    setRandomGraph();
  }, []);

  useEffect(() => {
    setNodes(blocksToNodes(blocks));
    setEdges(blocksToEdges(blocks));
  }, [blocks]);

  const setRandomGraph = () => {
    setBlocks(initializeGraph(5));
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="h-screen h-screen">
      <div className="h-2/3 w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>

      <div className="flex justify-center items-center h-1/3 w-full">
        <button
          onClick={setRandomGraph}
          className="bg-black border-red-500 text-white p-2"
        >
          New Graph
        </button>
      </div>
    </div>
  );
}
