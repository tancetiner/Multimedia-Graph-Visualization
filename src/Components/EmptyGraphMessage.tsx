const EmptyGraphMessage = () => {
  return (
    <div className="flex items-center justify-center h-full w-full text-2xl text-slate-600">
      <div className="select-none">
        <ul>
          <li> No graph to display. You can: </li>
          <li>1) Select from example graphs from the dropdown.</li>
          <li>
            2) Click on the "Import Graph from File" button to import a graph
            from a JSON file.
          </li>
          <li>
            3) Click on the "New Graph" button to create a new graph with the
            specified parameters.
          </li>
          <li>
            Then, select a layout type from the dropdown to visualize the graph.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmptyGraphMessage;
