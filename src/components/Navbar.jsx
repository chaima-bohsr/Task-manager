function Navbar({ remainingTasks }) {
  return (
    <nav className="flex justify-between items-center p-2  ">
      <h1 className="text-md font-bold ">Task Manager</h1>
      <p className="text-xs text-green-400">Active: {remainingTasks}</p>
    </nav>
  );
}

export default Navbar;
