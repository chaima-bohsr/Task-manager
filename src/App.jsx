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
  const [editInput, setEditInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");

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
  }

  function startEdit(task) {
    setEditInput(task.title);
    setEditId(task.id);
  }

  function saveEdit() {
    const trimmedInput = editInput.trim();
    if (trimmedInput === "") return;
    setTasks(
      tasks.map((task) =>
        task.id === editId ? { ...task, title: trimmedInput } : task,
      ),
    );
    setEditId(null);
    setEditInput("");
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
      setEditInput("");
    }
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
    <div>
      <Navbar remainingTasks={remainingTasks} />
      <div className="flex gap-2">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={filter === f ? "bg-blue-500 text-white" : "bg-gray-200"}
          >
            {f}
          </button>
        ))}
      </div>

      <TaskForm input={input} setInput={setInput} AddTask={AddTask} />
      {filterTasks.length === 0 ? (
        <p className="text-gray-500">
          {tasks.length === 0
            ? "You have no tasks"
            : "No tasks match this filter"}
        </p>
      ) : (
        <TaskItem
          tasks={filterTasks}
          editId={editId}
          editInput={editInput}
          setEditInput={setEditInput}
          startEdit={startEdit}
          saveEdit={saveEdit}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
        />
      )}
      {completedTasks > 0 && (
        <button type="button" className="bg-red-100 " onClick={deleteCompleted}>
          Delete Completed
        </button>
      )}
    </div>
  );
}

export default App;
