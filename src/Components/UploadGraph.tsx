import React from "react";

interface UploadGraphProps {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadGraph: React.FC<UploadGraphProps> = ({ handleFileUpload }) => {
  return (
    <div className="flex flex-col justify-center items-center space-y-2 border-transparent">
      <span className="select-none">Import Graph from File</span>
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="p-2"
      />
    </div>
  );
};

export default UploadGraph;
