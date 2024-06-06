import { Handle, Position } from "reactflow";

const CustomNode = ({ data }) => {
  const inputs = data.inputs || [];
  const outputs = data.outputs || [];

  return (
    <div className="custom-node">
      {inputs.map((input, index) => (
        <Handle
          key={`input-${index}`}
          type="target"
          position={Position.Left}
          id={`input-${index}`}
          style={{ top: `${(index + 1) * 20}px` }}
        />
      ))}
      <div className="node-content">{data.label}</div>
      {outputs.map((output, index) => (
        <Handle
          key={`output-${index}`}
          type="source"
          position={Position.Right}
          id={`output-${index}`}
          style={{ top: `${(index + 1) * 20}px` }}
        />
      ))}
    </div>
  );
};

export default CustomNode;
