import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Edge,
  Connection,
  Node,
  NodeTypes,
} from "reactflow";

// Graph Representations
import NoLayout from "./Graph-Representations/NoLayout";
import DagreLayout from "./Graph-Representations/DagreLayout";
import ELKLayout from "./Graph-Representations/ElkLayout";

// Helpers
import { Block } from "./Helpers/Block";
import { initializeGraph } from "./Helpers/Graph";
import exampleGraphs from "./Helpers/example-graphs.json";
import CustomNode from "./Helpers/CustomNode";
import CustomEdge from "./Helpers/CustomEdge";
import { blocksToNodesAndEdges } from "./Helpers/UtilityFunctions";
import Header from "./Components/Header";
import EmptyGraphMessage from "./Components/EmptyGraphMessage";
import ExampleGraphs from "./Components/ExampleGraphs";
import UploadGraph from "./Components/UploadGraph";
import LayoutOptions from "./Components/LayoutOptions";
import GraphGeneration from "./Components/GraphGeneration";
import GroupNode from "./Helpers/GroupNode";

// App Component
export default function App() {
  // State
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);

  const [inputCount, setInputCount] = useState<number>(1);
  const [outputCount, setOutputCount] = useState<number>(1);
  const [blockCount, setBlockCount] = useState<number>(1);
  const [layoutType, setLayoutType] = useState<string>("No Layout");
  const [exampleGraphIdx, setExampleGraphIdx] = useState<number>(0);
  const [layoutDirection, setLayoutDirection] = useState<string>("horizontal");
  const [grouping, setGrouping] = useState<boolean>(false);

  const nodeTypes: NodeTypes = useMemo(
    () => ({ customNode: CustomNode, groupNode: GroupNode }),
    []
  );
  const edgeTypes: any = useMemo(() => ({ customEdge: CustomEdge }), []);

  // Callbacks
  const changeLayoutDirection = useCallback(
    (direction: string) => {
      setLayoutDirection(direction);
    },
    [setLayoutDirection]
  );

  const returnLayoutView = useCallback(
    (layout: string) => {
      switch (layout) {
        case "Dagre Layout":
          return (
            <DagreLayout
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              setNodes={setNodes}
              setEdges={setEdges}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
            />
          );
        case "ELK Layout":
          return (
            <ELKLayout
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              changeLayoutDirection={changeLayoutDirection}
            />
          );
        default:
          return (
            <NoLayout
              nodes={nodes}
              edges={edges}
              onConnect={onConnect}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
            />
          );
      }
    },
    [nodes, edges, onNodesChange, onEdgesChange, nodeTypes, edgeTypes]
  );

  const setRandomGraph = useCallback(() => {
    resetGraph();
    setBlocks(initializeGraph(inputCount, outputCount, blockCount));
  }, [inputCount, outputCount, blockCount]);

  const setExampleGraph = useCallback(() => {
    resetGraph();
    if (exampleGraphIdx > 0) {
      const blocks = exampleGraphs[exampleGraphIdx - 1].blocks as Block[];
      setBlocks(blocks);
    }
  }, [exampleGraphIdx]);

  const resetGraph = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file || file.type !== "application/json") {
        alert("Please upload a valid JSON file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const target = e.target as FileReader;
        try {
          const json = JSON.parse(target.result as string);
          resetGraph();
          setBlocks(json.blocks);
        } catch (err) {
          alert("Failed to parse JSON file.");
        }
      };
      reader.readAsText(file);
    },
    []
  );

  const toggleGrouping = useCallback(() => {
    setGrouping((prevGrouping) => !prevGrouping);
  }, [setGrouping]);

  // Use Effects
  useEffect(() => {
    setExampleGraph();
  }, [exampleGraphIdx, setExampleGraph]);

  useEffect(() => {
    resetGraph();
    const { nodes, edges } = blocksToNodesAndEdges(
      blocks,
      layoutDirection,
      grouping
    );
    setNodes(nodes);
    setEdges(edges);
  }, [blocks, resetGraph, grouping, layoutDirection]);

  // Render
  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen">
        <Header title="Multimedia Graph Visualization" />
        <div className="h-[calc(100vh-10rem)] w-full">
          {nodes.length ? returnLayoutView(layoutType) : <EmptyGraphMessage />}
        </div>
        <div className="flex justify-between items-center px-[calc(4rem)] w-full h-[calc(6rem)] bg-blue-200">
          <div className="">
            <LayoutOptions
              layoutType={layoutType}
              setLayoutType={setLayoutType}
              grouping={grouping}
              toggleGrouping={toggleGrouping}
            />
          </div>

          <div className="flex justify-evenly space-x-[calc(4rem)]">
            <ExampleGraphs
              exampleGraphIdx={exampleGraphIdx}
              setExampleGraphIdx={setExampleGraphIdx}
              exampleGraphs={exampleGraphs}
            />
            <UploadGraph handleFileUpload={handleFileUpload} />
            <GraphGeneration
              inputCount={inputCount}
              setInputCount={setInputCount}
              outputCount={outputCount}
              setOutputCount={setOutputCount}
              blockCount={blockCount}
              setBlockCount={setBlockCount}
              setRandomGraph={setRandomGraph}
            />
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
