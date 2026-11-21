export default function TaskForm({ input, setInput, AddTask }) {
  function handleSubmit(e) {
    e.preventDefault();
    AddTask();
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="bg-green-100" type="submit">
          Add Task
        </button>
      </form>
    </div>
  );
}
