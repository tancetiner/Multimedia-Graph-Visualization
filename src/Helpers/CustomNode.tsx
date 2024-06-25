import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { BlockType } from "./Block";
import { useEffect, useState } from "react";

interface CustomNodeProps {
  data: {
    label: string;
    blockType: BlockType;
    handleCount: number;
    nodeId: string;
    layoutDirection: string;
  };
}

export default function CustomNode(props: CustomNodeProps) {
  const updateNodeInternals = useUpdateNodeInternals();

  const blockTypeToColor = {
    [BlockType.INPUT]: "bg-blue-400",
    [BlockType.OUTPUT]: "bg-green-400",
    [BlockType.FILTER]: "bg-red-400",
    [BlockType.GROUP]: "bg-yellow-400",
  };

  const [handleCount, setHandleCount] = useState(props.data.handleCount);
  const [layoutDirection, setLayoutDirection] = useState(
    props.data.layoutDirection
  );

  useEffect(() => {
    setHandleCount(props.data.handleCount);
    updateNodeInternals(props.data.nodeId);
  }, [props.data.handleCount, updateNodeInternals]);

  useEffect(() => {
    setLayoutDirection(props.data.layoutDirection);
    console.log("layoutDirection: ", props.data.layoutDirection);
  }, [props.data.layoutDirection]);

  return (
    <>
      <Handle
        type="target"
        position={
          layoutDirection === "horizontal" ? Position.Left : Position.Top
        }
      />
      <div
        className={`p-2 rounded-lg ${blockTypeToColor[props.data.blockType]}`}
      >
        <label htmlFor="text">{props.data.label}</label>
      </div>
      {Array.from({ length: handleCount }).map((_, index) => (
        <Handle
          key={index}
          type="source"
          position={
            layoutDirection === "horizontal" ? Position.Right : Position.Bottom
          }
          id={`handle-${index}`}
          style={
            layoutDirection === "horizontal"
              ? { top: `${(index + 1) * (100 / (handleCount + 1))}%` }
              : { left: `${(index + 1) * (100 / (handleCount + 1))}%` }
          }
        />
      ))}
    </>
  );
}
