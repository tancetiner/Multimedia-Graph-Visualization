import React from "react";

interface LayoutOptionsProps {
  layoutType: string;
  setLayoutType: (layoutType: string) => void;
}

const LayoutOptions: React.FC<LayoutOptionsProps> = ({
  layoutType,
  setLayoutType,
}) => {
  return (
    <div className="flex flex-col justify-center items-center space-y-2">
      <span className="select-none">Layout Type</span>
      <select
        value={layoutType}
        onChange={(e) => setLayoutType(e.target.value)}
        className="p-2 border"
      >
        {["No Layout", "Dagre Layout", "ELK Layout"].map((count) => (
          <option key={count} value={count}>
            {count}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LayoutOptions;
