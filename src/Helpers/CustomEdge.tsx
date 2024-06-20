import React, { useEffect } from "react";
import { BaseEdge, EdgeLabelRenderer, getSimpleBezierPath } from "reactflow";
import { LinkType } from "./FilterGraph";

const linkTypeToColor: { [key in LinkType]: string } = {
  [LinkType.audio]: "#ff0000",
  [LinkType.video]: "#00ff00",
  [LinkType.file]: "#0000ff",
  [LinkType.text]: "#ff00ff",
};

interface CustomEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  data: { linkType: LinkType };
}

const CustomEdge: React.FC<CustomEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}) => {
  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const gradientId = `gradient-${id}`;

  return (
    <>
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1={sourceX}
          y1={sourceY}
          x2={targetX}
          y2={targetY}
        >
          <stop offset="0%" stopColor={linkTypeToColor[data.linkType]} />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: `url(#${gradientId})`, strokeWidth: 2 }}
      />
      <EdgeLabelRenderer>
        <label
          className="nodrag nopan bg-slate-500 text-white p-2 rounded-3xl"
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          {data.linkType.toString()}
        </label>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
