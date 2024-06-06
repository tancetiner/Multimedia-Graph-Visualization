// CustomEdge.tsx
import { getBezierPath, getMarkerEnd } from "reactflow";
import { gradientColors } from "./constants";

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const gradientId = `gradient-${id}`;
  const [startColor, endColor] = gradientColors[data.type] || ["#000", "#000"];

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
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
      </defs>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={getMarkerEnd(markerEnd)}
        stroke={`url(#${gradientId})`}
        strokeWidth={2}
        fill="none"
      />
    </>
  );
};

export default CustomEdge;
