import React from "react";

interface ExampleGraphsProps {
  exampleGraphIdx: number;
  setExampleGraphIdx: (idx: number) => void;
  exampleGraphs: any[];
}

const ExampleGraphs: React.FC<ExampleGraphsProps> = ({
  exampleGraphIdx,
  setExampleGraphIdx,
  exampleGraphs,
}) => {
  return (
    <div className="flex flex-col justify-center items-center space-y-2 border-transparent">
      <span className="select-none">Select from Example Graphs</span>
      <select
        value={exampleGraphIdx}
        onChange={(e) => setExampleGraphIdx(Number(e.target.value))}
        className="p-2 border"
      >
        {["Select Graph", ...exampleGraphs].map((graph, idx) => (
          <option key={idx} value={idx}>
            {typeof graph === "string" ? graph : graph.title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExampleGraphs;
