import { useCallback, useEffect, useState } from "react";
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  MarkerType,
  Connection,
  Node,
} from "reactflow";

import { initializeGraph, Block } from "./Helpers/FilterGraph";
import NoLayout from "./Graph-Representations/NoLayout";
import TreeLayout from "./Graph-Representations/TreeLayout";
import ForceLayout from "./Graph-Representations/ForceLayout";
import DagreLayout from "./Graph-Representations/DagreLayout";
import ELKLayout from "./Graph-Representations/ElkLayout";

import "reactflow/dist/style.css";

const returnPositions = (i: number) => {
  return { y: 40, x: i * 200 + 40 };
};

const blocksToNodes = (blocks: Block[]): Node[] => {
  return blocks.map((block, i) => {
    return {
      id: block.id.toString(),
      position: returnPositions(i),
      data: { label: block.name, blockType: block.type },
    };
  });
};

const blocksToEdges = (blocks: Block[]): Edge[] => {
  const edges: Edge[] = [];

  blocks.forEach((block) => {
    block.outputs.forEach((output) => {
      const targetId = output.path[output.path.length - 1];
      edges.push({
        id: `e${block.id}-${targetId}`,
        source: block.id.toString(),
        target: targetId.toString(),
        label: output.type.toString(),
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      });
    });
  });

  console.log(edges);

  return edges;
};

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);

  const [inputCount, setInputCount] = useState(1);
  const [outputCount, setOutputCount] = useState(1);
  const [blockCount, setBlockCount] = useState(1);
  const [layoutType, setLayoutType] = useState("No Layout");

  const returnLayoutView = (layout: string) => {
    if (layout == "No Layout") {
      return (
        <NoLayout
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        />
      );
    } else if (layout == "Tree Layout") {
      return (
        <TreeLayout
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          setEdges={setEdges}
          setNodes={setNodes}
        />
      );
    } else if (layout == "Force Layout") {
      return (
        <ForceLayout
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        />
      );
    } else if (layout == "Dagre Layout") {
      return (
        <DagreLayout
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          setNodes={setNodes}
          setEdges={setEdges}
        />
      );
    } else if (layout == "ELK Layout") {
      return (
        <ELKLayout
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
        />
      );
    }
  };

  const setRandomGraph = () => {
    setBlocks(initializeGraph(inputCount, outputCount, blockCount));
  };

  useEffect(() => {
    setNodes(blocksToNodes(blocks));
    setEdges(blocksToEdges(blocks));
  }, [blocks]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen">
        <div className="h-[calc(4rem)] bg-blue-200 w-full flex items-center">
          <span className="text-black text-2xl font-semibold mx-auto">
            Multimedia Graph
          </span>
        </div>
        <div className="h-4/5 w-full">
          {nodes.length != 0 ? (
            returnLayoutView(layoutType)
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <span className="text-2xl text-slate-600">
                {" "}
                No graph to display. Create a graph from below.
              </span>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center px-10 w-full h-[calc(20vh-4rem)] bg-blue-200 space-x-8">
          <div className="flex flex-col justify-start items-center space-y-2">
            <span>Layout Type</span>
            <select
              value={layoutType}
              onChange={(e) => setLayoutType(e.target.value)}
              className="p-2 border"
            >
              {[
                "No Layout",
                "Tree Layout",
                "Force Layout",
                "Dagre Layout",
                "ELK Layout",
              ].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-start items-center space-y-2">
            <span>Input Count</span>
            <select
              value={inputCount}
              onChange={(e) => setInputCount(Number(e.target.value))}
              className="w-[calc(4rem)] p-2 border"
            >
              {[1, 2, 3].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-start items-center space-y-2">
            <span>Output Count</span>
            <select
              value={outputCount}
              onChange={(e) => setOutputCount(Number(e.target.value))}
              className="w-[calc(4rem)] p-2 border"
            >
              {[1, 2, 3].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col justify-start items-center space-y-2">
            <span>Filter Count</span>
            <select
              value={blockCount}
              onChange={(e) => setBlockCount(Number(e.target.value))}
              className="w-[calc(4rem)] p-2 border"
            >
              {[1, 2, 3, 4, 5].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={setRandomGraph}
            className="bg-slate-600 hover:bg-slate-400 text-slate-100 rounded-lg h-12 p-2"
          >
            New Graph
          </button>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
