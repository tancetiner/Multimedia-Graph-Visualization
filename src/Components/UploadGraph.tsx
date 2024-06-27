import React from "react";

interface UploadGraphProps {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadGraph: React.FC<UploadGraphProps> = ({ handleFileUpload }) => {
  return (
    <div className="flex flex-col justify-center items-center space-y-2 border-transparent">
      <span className="select-none">Import Graph from File</span>
      <div className="flex items-center justify-center w-[calc(12rem)]">
        <label className="flex flex-col items-center justify-center w-full h-[calc(2.5rem)] border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-100 hover:bg-slate-50">
          <div className="flex flex-col items-center justify-center py-2">
            <svg
              className="w-8 h-8 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>
    </div>
  );
};

export default UploadGraph;
