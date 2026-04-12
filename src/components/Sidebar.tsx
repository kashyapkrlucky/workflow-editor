export function Sidebar() {
  return (
    <div className="w-64 border-r border-gray-200 p-4">
      <p className="text-xs mb-2 uppercase font-medium text-gray-700">Node Actions</p>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2">
          <input
            type="text"
            placeholder="Node name"
            className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
          />
          <select className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs">
            <option value="">Select node type</option>
            <option value="start">Start</option>
            <option value="end">End</option>
          </select>
        </div>
        <div>
          <textarea
            className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
            placeholder="Variables (JSON)"
          ></textarea>
        </div>
        <div className="flex flex-row gap-2">
          <button className="px-2 py-1 bg-blue-500 text-white rounded-md text-xs">
            Save Changes
          </button>
          <button className="px-2 py-1 bg-red-500 text-white rounded-md text-xs">
            Delete
          </button>
        </div>
      </div>

      <p className="text-xs mt-4 mb-2 uppercase font-medium text-gray-700">Workflow Json</p>
      <textarea
        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
        rows={10}
        placeholder="Workflow JSON"
      ></textarea>
    </div>
  );
}
