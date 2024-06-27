import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { useEffect, useState } from "react";

interface GroupNodeProps {
  data: {
    label: string;
    handleCount: number;
    nodeId: string;
    layoutDirection: string;
    numberOfFilters: number;
  };
}

export default function GroupNode(props: GroupNodeProps) {
  const updateNodeInternals = useUpdateNodeInternals();

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
  }, [props.data.layoutDirection]);

  return (
    <>
      <Handle
        type="target"
        position={
          layoutDirection === "horizontal" ? Position.Left : Position.Top
        }
      />
      <div className="p-2 h-48 w-48 rounded-lg bg-yellow-400 flex flex-col justify-center">
        <label htmlFor="text" className="mx-auto">
          {props.data.label}
        </label>
        <label htmlFor="text" className="mx-auto">
          {props.data.numberOfFilters} Filters
        </label>
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
