import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { BlockType } from "./FilterGraph";
import { useEffect, useState } from "react";

interface CustomNodeProps {
  data: {
    label: string;
    blockType: BlockType;
    handleCount: number;
    nodeId: string;
  };
}

export default function CustomNode(props: CustomNodeProps) {
  const updateNodeInternals = useUpdateNodeInternals();

  const blockTypeToColor = {
    [BlockType.INPUT]: "bg-blue-400",
    [BlockType.OUTPUT]: "bg-green-400",
    [BlockType.FILTER]: "bg-red-400",
  };

  const [handleCount, setHandleCount] = useState(props.data.handleCount);

  useEffect(() => {
    setHandleCount(props.data.handleCount);
    updateNodeInternals(props.data.nodeId);
  }, [props.data.handleCount, updateNodeInternals]);

  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div
        className={`py-4 px-2 rounded-lg ${
          blockTypeToColor[props.data.blockType]
        }`}
      >
        <label htmlFor="text">{props.data.label}</label>
      </div>
      {Array.from({ length: handleCount }).map((_, index) => (
        <Handle
          key={index}
          type="source"
          position={Position.Right}
          id={`handle-${index}`}
          style={{ top: `${(index + 1) * (100 / (handleCount + 1))}%` }}
        />
      ))}
    </>
  );
}
