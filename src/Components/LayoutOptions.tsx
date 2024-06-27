import React from "react";

interface LayoutOptionsProps {
  layoutType: string;
  setLayoutType: (layoutType: string) => void;
  grouping: boolean;
  toggleGrouping: () => void;
}

const LayoutOptions: React.FC<LayoutOptionsProps> = ({
  layoutType,
  setLayoutType,
  grouping,
  toggleGrouping,
}) => {
  return (
    <div className="flex space-x-4">
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

      <div className="flex flex-col justify-center items-center space-y-3">
        <span className="text-gray-900">Grouping</span>
        <input
          checked={grouping}
          onChange={toggleGrouping}
          className="hidden"
          id="react-toggle"
          type="checkbox"
        />
        <label
          htmlFor="react-toggle"
          className="cursor-pointer w-14 h-8 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out"
        >
          <div
            className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${
              grouping ? "translate-x-6 bg-blue-500 peer-focus:bg-black" : ""
            }`}
          />
        </label>
      </div>
    </div>
  );
};

export default LayoutOptions;
