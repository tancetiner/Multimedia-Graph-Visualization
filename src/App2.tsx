import { stratify, tree } from "d3-hierarchy";
import { useCallback } from "react";
import ReactFlow, {
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "reactflow";

import "reactflow/dist/style.css";

const g = tree();

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "input" },
    position: { x: 0, y: 0 },
  },
  {
    id: "2",
    data: { label: "node 2" },
    position: { x: 0, y: 100 },
  },
  {
    id: "7",
    data: { label: "node 7" },
    position: { x: 0, y: 200 },
  },
  {
    id: "4",
    data: { label: "node 4" },
    position: { x: 0, y: 300 },
  },
  {
    id: "6",
    data: { label: "node 6" },
    position: { x: 0, y: 400 },
  },
  {
    id: "5",
    data: { label: "node 5" },
    position: { x: 0, y: 500 },
  },
  {
    id: "3",
    data: { label: "node 3" },
    position: { x: 200, y: 100 },
  },
];

const initialEdges = [
  { id: "e12", source: "1", target: "2", animated: true },
  { id: "e13", source: "1", target: "3", animated: true },
  { id: "e27", source: "2", target: "7", animated: true },
  { id: "e24", source: "2", target: "4", animated: true },
  { id: "e26", source: "2", target: "6", animated: true },
  { id: "e65", source: "6", target: "5", animated: true },
];

const getLayoutedElements = (nodes, edges, options) => {
  if (nodes.length === 0) return { nodes, edges };

  const { width, height } = document
    .querySelector(`[data-id="${nodes[0].id}"]`)
    .getBoundingClientRect();
  const hierarchy = stratify()
    .id((node) => node.id)
    .parentId((node) => edges.find((edge) => edge.target === node.id)?.source);
  const root = hierarchy(nodes);
  const layout = g.nodeSize([width * 2, height * 2])(root);

  return {
    nodes: layout
      .descendants()
      .map((node) => ({ ...node.data, position: { x: node.x, y: node.y } })),
    edges,
  };
};

const LayoutFlow = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(nodes, edges, {
          direction,
        });

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);

      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges],
  );

  return (
    <div className="h-screen w-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Panel position="top-right">
          <button onClick={onLayout}>layout</button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default function App2() {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}
