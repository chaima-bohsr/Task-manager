import { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskItem from "./components/TaskItem";
import Navbar from "./components/Navbar";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [showCoin, setShowCoin] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const currentFilter = filter.toLowerCase();

  const filterTasks = tasks.filter((task) => {
    if (currentFilter === "active") {
      return !task.completed;
    }
    if (currentFilter === "completed") {
      return task.completed;
    }
    return true;
  });

  function AddTask() {
    const trimmedInput = input.trim();
    if (trimmedInput === "") return;

    const now = Date.now();
    const newTask = {
      id: now,
      createdAt: now,
      title: trimmedInput,
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setInput("");
    setShowForm(false);

    setShowCoin(true);
    setTimeout(() => {
      setShowCoin(false);
    }, 1000);
  }

  function startEdit(task) {
    setInput(task.title);
    setEditId(task.id);
    setShowForm(true);
  }

  function saveEdit() {
    const trimmedInput = input.trim();
    if (trimmedInput === "") return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === editId ? { ...task, title: trimmedInput } : task,
      ),
    );
    setEditId(null);
    setInput("");
    setShowForm(false);
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (editId === id) {
      setEditId(null);
      setInput("");
    }
  }

  function startSelection(id) {
    setIsSelectionMode(true);
    setSelectedIds([id]);
  }

  function toggleSelectTask(id) {
    setSelectedIds((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      if (updated.length === 0) {
        setIsSelectionMode(false);
      }
      return updated;
    });
  }

  function cancelSelection() {
    setIsSelectionMode(false);
    setSelectedIds([]);
  }

  function deleteSelectedTasks() {
    setTasks((prev) => prev.filter((task) => !selectedIds.includes(task.id)));
    setSelectedIds([]);
    setIsSelectionMode(false);
  }

  const remainingTasks = tasks.filter((task) => !task.completed).length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  function deleteCompleted() {
    setTasks((prev) => prev.filter((task) => !task.completed));
  }

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#fdfaf4] text-stone-800">
      <Navbar
        remainingTasks={remainingTasks}
        isSelectionMode={isSelectionMode}
        selectedCount={selectedIds.length}
        onDeleteSelected={deleteSelectedTasks}
        onCancelSelection={cancelSelection}
      />

      <div className="flex w-full text-xs border-b border-stone-200 shadow-[0_4px_12px_-2px_rgba(120,113,108,0.12)]">
        {["All", "Active", "Completed"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`flex-1 py-2.5 text-center cursor-pointer transition-colors ${
              filter === f
                ? "text-emerald-700 border-b-2 border-emerald-700 font-semibold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {currentFilter === "completed" && completedTasks > 0 && (
        <div className="flex justify-end px-4 pt-3">
          <button
            type="button"
            onClick={deleteCompleted}
            aria-label="Delete completed tasks"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200/70 text-xs font-medium hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-trash-can"></i>
            <span>Clear completed</span>
          </button>
        </div>
      )}

      <TaskForm
        input={input}
        setInput={setInput}
        AddTask={AddTask}
        editId={editId}
        saveEdit={saveEdit}
        deleteTask={deleteTask}
        onClose={() => {
          setShowForm(false);
          setInput("");
          setEditId(null);
        }}
        showForm={showForm}
      />

      {filterTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-stone-400 px-4 text-center">
          <i className="fa-regular fa-clipboard text-3xl mb-2.5 text-stone-300"></i>
          <p className="text-sm font-medium text-stone-500">
            {tasks.length === 0
              ? "You have no tasks"
              : "No tasks match this filter"}
          </p>
          <p className="mt-1 text-xs text-stone-400">
            {tasks.length === 0
              ? "Tap + to add your first task"
              : "Try switching to another filter tab"}
          </p>
        </div>
      ) : (
        <TaskItem
          tasks={filterTasks}
          startEdit={startEdit}
          toggleTask={toggleTask}
          isSelectionMode={isSelectionMode}
          selectedIds={selectedIds}
          startSelection={startSelection}
          toggleSelectTask={toggleSelectTask}
        />
      )}

      <button
        type="button"
        onClick={() => setShowForm(true)}
        aria-label="Add task"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xl shadow-lg shadow-stone-900/10 flex items-center justify-center cursor-pointer transition-colors z-40"
      >
        <i className="fa-solid fa-plus"></i>
      </button>

      {showCoin && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-stone-200 text-xs font-medium px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
          <i className="fa-solid fa-circle-check text-emerald-700"></i>
          <span className="text-emerald-700">Task added</span>
        </div>
      )}
    </div>
  );
}

export default App;
