export function NavBar() {
  return (
    <header className="border-b border-gray-200 p-4 h-12 flex items-center justify-between">
      <div>Workflow Editor</div>
      <div className="flex gap-2">
        <button className="px-2 py-1 bg-gray-500 text-white rounded-md text-xs">Export</button>
        <button className="px-2 py-1 bg-gray-500 text-white rounded-md text-xs">Import</button>
      </div>
    </header>
  );
}