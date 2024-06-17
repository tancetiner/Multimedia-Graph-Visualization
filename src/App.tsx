import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  MarkerType,
  Connection,
  Node,
  NodeTypes,
} from "reactflow";

import { initializeGraph, Block } from "./Helpers/FilterGraph";
import NoLayout from "./Graph-Representations/NoLayout";
import HierarchyLayout from "./Graph-Representations/HierarchyLayout";
import ForceLayout from "./Graph-Representations/ForceLayout";
import DagreLayout from "./Graph-Representations/DagreLayout";
import ELKLayout from "./Graph-Representations/ElkLayout";

import exampleGraphs from "./Helpers/example-graphs.json";
import CustomNode from "./Helpers/CustomNode";

const returnPositions = (i: number) => {
  return { y: 40, x: i * 200 + 40 };
};

const blocksToNodes = (blocks: Block[]): Node[] => {
  console.log(blocks);
  return blocks.map((block, i) => {
    return {
      id: block.id.toString(),
      position: returnPositions(i),
      type: "customNode",
      data: {
        label: block.name,
        blockType: block.type,
        handleCount: block.outputs.length,
        nodeId: block.id,
      },
    };
  });
};

const blocksToEdges = (blocks: Block[]): Edge[] => {
  const edges: Edge[] = [];

  blocks.forEach((block) => {
    let sourceHandleIdx = 0;
    block.outputs.forEach((output) => {
      const targetId = output.path[output.path.length - 1];
      edges.push({
        id: `e${block.id.replace(/\s+/g, "")}-${targetId.replace(/\s+/g, "")}`,
        source: block.id.toString(),
        sourceHandle: `handle-${sourceHandleIdx.toString()}`,
        target: targetId.toString(),
        label: output.type.toString(),
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      });
      sourceHandleIdx++;
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
  const [exampleGraphIdx, setExampleGraphIdx] = useState<number>(0);

  const nodeTypes: NodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  const returnLayoutView = (layout: string) => {
    if (layout == "No Layout") {
      return (
        <NoLayout
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
        />
      );
    } else if (layout == "Hierarchy Layout") {
      return (
        <HierarchyLayout
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
          nodeTypes={nodeTypes}
        />
      );
    } else if (layout == "ELK Layout") {
      return (
        <ELKLayout
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
        />
      );
    }
  };

  const setRandomGraph = () => {
    setBlocks(initializeGraph(inputCount, outputCount, blockCount));
  };

  const setExampleGraph = () => {
    if (exampleGraphIdx == 0) {
      resetGraph();
      return;
    }
    let blocks = exampleGraphs[exampleGraphIdx - 1].blocks as Block[];
    setBlocks(blocks);
  };

  const resetGraph = () => {
    setNodes([]);
    setEdges([]);
  };

  useEffect(() => {
    setExampleGraph();
  }, [exampleGraphIdx]);

  useEffect(() => {
    setNodes(blocksToNodes(blocks));
    setEdges(blocksToEdges(blocks));
  }, [blocks]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || file.type !== "application/json") {
      alert("Please upload a valid JSON file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        // Handle the JSON data
        console.log(json);
        setBlocks(json.blocks);
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen">
        <div className="h-[calc(4rem)] bg-blue-200 w-full flex items-center">
          <span className="text-black text-2xl font-semibold mx-auto">
            Multimedia Graph Representation
          </span>
        </div>
        <div className="h-4/5 w-full">
          {nodes.length != 0 ? (
            returnLayoutView(layoutType)
          ) : (
            <div className="flex items-center justify-center h-full w-full text-2xl text-slate-600">
              <div>
                <ul>
                  <li> No graph to display. You can: </li>
                  <li>1) Select from example graphs from the dropdown.</li>
                  <li>
                    2) Click on the "Import Graph from File" button to import a
                    graph from a JSON file.
                  </li>
                  <li>
                    3) Click on the "New Graph" button to create a new graph
                    with the specified parameters.
                  </li>

                  <li>
                    Then, select a layout type from the dropdown to visualize
                    the graph.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-evenly items-center px-10 w-full h-[calc(20vh-4rem)] bg-blue-200 space-x-8">
          <div className="flex justify-center space-x-4">
            <div className="flex flex-col justify-center items-center space-y-2 border-transparent">
              <span>Select from Example Graphs</span>
              <select
                value={exampleGraphIdx}
                onChange={(e) => setExampleGraphIdx(Number(e.target.value))}
                className="p-2 border"
              >
                {["Select Graph", ...exampleGraphs].map((graph, idx) => (
                  <option key={idx} value={idx}>
                    {typeof graph == "string" ? graph : graph.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col justify-center items-center space-y-2 border-transparent">
              <span>Import Graph from File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="p-2"
              />
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <div className="flex flex-col justify-center items-center space-y-2">
              <span>Layout Type</span>
              <select
                value={layoutType}
                onChange={(e) => setLayoutType(e.target.value)}
                className="p-2 border"
              >
                {[
                  "No Layout",
                  "Hierarchy Layout",
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
          </div>

          <div className="flex justify-center space-x-4">
            <div className="flex flex-col justify-start items-center space-y-2">
              <span>Input Count</span>
              <select
                value={inputCount}
                onChange={(e) => setInputCount(Number(e.target.value))}
                className="w-[calc(4rem)] p-2 border"
              >
                {Array.from({ length: 5 }, (_, i) => i + 1).map((count) => (
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
                {Array.from({ length: 5 }, (_, i) => i + 1).map((count) => (
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
                {Array.from({ length: 10 }, (_, i) => i + 1).map((count) => (
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
      </div>
    </ReactFlowProvider>
  );
}
