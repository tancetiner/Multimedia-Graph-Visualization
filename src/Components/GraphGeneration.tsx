import React from "react";

interface GraphGenerationProps {
  inputCount: number;
  setInputCount: (count: number) => void;
  outputCount: number;
  setOutputCount: (count: number) => void;
  blockCount: number;
  setBlockCount: (count: number) => void;
  setRandomGraph: () => void;
}

const GraphGeneration: React.FC<GraphGenerationProps> = ({
  inputCount,
  setInputCount,
  outputCount,
  setOutputCount,
  blockCount,
  setBlockCount,
  setRandomGraph,
}) => {
  return (
    <div className="flex flex-row justify-start items-center space-x-4">
      <div className="flex flex-col justify-start items-center space-y-2">
        <span className="select-none">Input Count</span>
        <select
          value={inputCount}
          onChange={(e) => setInputCount(Number(e.target.value))}
          className="w-[calc(4rem)] p-2 border"
        >
          {Array.from({ length: 5 }, (_, i) => i + 1).map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col justify-start items-center space-y-2">
        <span className="select-none">Output Count</span>
        <select
          value={outputCount}
          onChange={(e) => setOutputCount(Number(e.target.value))}
          className="w-[calc(4rem)] p-2 border"
        >
          {Array.from({ length: 5 }, (_, i) => i + 1).map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col justify-start items-center space-y-2">
        <span className="select-none">Filter Count</span>
        <select
          value={blockCount}
          onChange={(e) => setBlockCount(Number(e.target.value))}
          className="w-[calc(4rem)] p-2 border"
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={setRandomGraph}
        className="bg-slate-600 hover:bg-slate-400 text-slate-100 rounded-lg h-12 p-2 select-none"
      >
        New Graph
      </button>
    </div>
  );
};

export default GraphGeneration;
