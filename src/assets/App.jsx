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
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [showCoin, setShowCoin] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const filterTasks = tasks.filter((task) => {
    if (filter === "active") {
      return !task.completed;
    }
    if (filter === "completed") {
      return task.completed;
    }
    return true;
  });

  function AddTask() {
    if (input.trim() === "") return;
    const newTask = {
      id: Date.now(),
      title: input,
      completed: false,
    };
    setTasks([...tasks, newTask]);
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
    setTasks(
      tasks.map((task) =>
        task.id === editId ? { ...task, title: trimmedInput } : task,
      ),
    );
    setEditId(null);
    setInput("");
    setShowForm(false);
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id) {
    setTasks(tasks.filter((task) => task.id !== id));
    if (editId === id) {
      setEditId(null);
      setInput("");
    }
  }

  function startSelection(id) {
    console.log("APP startSelection CALLED WITH:", id);
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
    setTasks(tasks.filter((task) => !selectedIds.includes(task.id)));
    setSelectedIds([]);
    setIsSelectionMode(false);
  }

  const remainingTasks = tasks.filter((task) => !task.completed).length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  function deleteCompleted() {
    setTasks(tasks.filter((task) => task.completed === false));
  }

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar
        remainingTasks={remainingTasks}
        isSelectionMode={isSelectionMode}
        selectedCount={selectedIds.length}
        onDeleteSelected={deleteSelectedTasks}
        onCancelSelection={cancelSelection}
      />
      <div className="flex w-full px-4">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 text-center ${
              filter === f
                ? "text-blue-500 border-b-2 border-blue-500 font-medium"
                : "text-gray-400 border-b border-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {filter === "completed" && completedTasks > 0 && (
        <button
          type="button"
          onClick={deleteCompleted}
          className="px-2 py-1 rounded bg-red-100 text-red-600 text-sm hover:bg-red-200 cursor-pointer"
        >
          <i className="fa-solid fa-trash"></i>
        </button>
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
        <p className="text-gray-500">
          {tasks.length === 0
            ? "You have no tasks"
            : "No tasks match this filter"}
        </p>
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
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xl flex items-center justify-center cursor-pointer z-40"
      >
        <i className="fa-solid fa-plus"></i>
      </button>

      {showCoin && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-gray-200  text-sm px-2 py-1 rounded-full shadow-lg flex items-center gap-1">
          <i className="fa-solid fa-circle-check text-green-400"></i>
          <span>Task added</span>
        </div>
      )}
    </div>
  );
}

export default App;
