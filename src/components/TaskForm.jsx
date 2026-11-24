export default function TaskForm({
  showForm,
  input,
  setInput,
  AddTask,
  onClose,
  editId,
  saveEdit,
  deleteTask,
}) {
  function handleSubmit(e) {
    e.preventDefault();
    if (editId !== null) {
      saveEdit();
    } else {
      AddTask();
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{
          transform: showForm ? "translateX(0)" : "translateX(100%)",
          transition: "transform 200ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className={`fixed inset-0 z-50 modal-doodle-bg ${
          showForm ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div className="flex justify-between items-center p-2 pb-6">
          <button
            type="button"
            onClick={onClose}
            className="bg-transparent border-0 outline-none focus:outline-none cursor-pointer"
          >
            <i className="fa-solid fa-arrow-left-long text-stone-500 hover:text-stone-700"></i>
          </button>

          <div className="flex items-center gap-2">
            {editId !== null && (
              <button
                type="button"
                onClick={() => {
                  deleteTask(editId);
                  onClose();
                }}
                className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200/70 text-sm font-medium hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            )}

            <button
              type="submit"
              className={`px-2 py-1 rounded text-sm cursor-pointer ${
                input.length > 0
                  ? "bg-emerald-700 text-[#fdfaf4]"
                  : "bg-gray-100 text-stone-700d"
              }`}
            >
              Save
            </button>
          </div>
        </div>

        <input
          type="text"
          placeholder="Enter new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full focus:outline-none px-3 text-stone-900 placeholder:text-stone-400"
        />
      </form>
    </div>
  );
}
