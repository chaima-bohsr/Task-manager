export default function TaskItem({
  tasks,
  editId,
  editInput,
  setEditInput,
  startEdit,
  saveEdit,
  toggleTask,
  deleteTask,
}) {
  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.id === editId ? (
              <>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveEdit();
                  }}
                >
                  <input
                    type="text"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                  />
                  <button type="submit">Save</button>
                </form>
              </>
            ) : (
              <>
                <span
                  className={task.completed ? "text-gray-300 line-through" : ""}
                >
                  {task.title}
                </span>
                <button
                  className="bg-blue-100 px-1"
                  onClick={() => startEdit(task)}
                >
                  Edit
                </button>
              </>
            )}
            <button
              className="bg-green-100 px-1"
              onClick={() => toggleTask(task.id)}
            >
              completed
            </button>
            <button
              className="bg-red-100 px-1"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
