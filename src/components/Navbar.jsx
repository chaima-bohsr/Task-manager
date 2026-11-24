function Navbar({
  remainingTasks,
  isSelectionMode,
  selectedCount,
  onDeleteSelected,
  onCancelSelection,
}) {
  const selectionLabel =
    selectedCount === 1 ? "1 selected" : `${selectedCount} selected`;

  return (
    <nav className="h-14 flex justify-between items-center px-4 bg-[#fdfaf4]">
      {isSelectionMode ? (
        <>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onCancelSelection}
              className="w-7 h-7 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-800 hover:bg-stone-200/50 transition-colors cursor-pointer"
              aria-label="Cancel selection"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </button>
            <p className="text-sm font-bold text-stone-800 leading-none">
              {selectionLabel}
            </p>
          </div>

          <button
            type="button"
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              selectedCount > 0
                ? "text-rose-700 hover:bg-rose-50 cursor-pointer"
                : "text-stone-300 cursor-not-allowed"
            }`}
            aria-label="Delete selected tasks"
          >
            <i className="fa-solid fa-trash-can text-base"></i>
          </button>
        </>
      ) : (
        <>
          <h1 className="flex items-center gap-2 text-lg font-bold text-stone-800 leading-none tracking-tight">
            <i className="fa-solid fa-list-check text-sm "></i>
            <span>My Tasks</span>
          </h1>
          <span className="px-2.5 py-1 rounded-full bg-emerald-700/10 text-[11px] text-emerald-700 font-semibold leading-none">
            Active: {remainingTasks}
          </span>
        </>
      )}
    </nav>
  );
}

export default Navbar;
