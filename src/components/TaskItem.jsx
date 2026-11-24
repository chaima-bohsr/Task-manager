import { useRef } from "react";

function formatTaskTime(timestamp) {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const isSameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isSameDay) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function TaskItem({
  tasks,
  startEdit,
  toggleTask,
  isSelectionMode,
  selectedIds = [],
  startSelection = () => {},
  toggleSelectTask = () => {},
}) {
  const timerRef = useRef(null);
  const longPressTriggeredRef = useRef(false);

  function handlePressStart(id) {
    longPressTriggeredRef.current = false;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;
      startSelection(id);
    }, 500);
  }

  function handlePressEnd() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function handleItemClick(task) {
    if (longPressTriggeredRef.current) {
      longPressTriggeredRef.current = false;
      return;
    }

    if (isSelectionMode) {
      toggleSelectTask(task.id);
    } else {
      startEdit(task);
    }
  }

  return (
    <div className="px-3 pt-3 pb-24">
      <ul className="space-y-2.5">
        {tasks.map((task) => {
          const isSelected = selectedIds.includes(task.id);
          const formattedTime = formatTaskTime(task.createdAt || task.id);

          return (
            <li
              key={task.id}
              onMouseDown={() => handlePressStart(task.id)}
              onMouseUp={handlePressEnd}
              onTouchStart={() => handlePressStart(task.id)}
              onTouchEnd={handlePressEnd}
              onClick={() => handleItemClick(task)}
              className={`relative flex items-center justify-between gap-3 px-4 py-5 rounded-xl border cursor-pointer select-none transition-colors ${
                isSelected
                  ? "bg-rose-50 border-rose-200/90 text-rose-900 shadow-sm shadow-rose-100/60"
                  : "bg-[#f3ece0] border-stone-200/90 text-stone-800 hover:border-stone-300 shadow-[0_4px_12px_-4px_rgba(120,113,108,0.1)]"
              }`}
            >
              <div className="min-w-0 flex-1 pr-2">
                <p
                  className={`text-sm font-medium break-words transition-colors ${
                    task.completed ? "line-through" : ""
                  } ${
                    isSelected
                      ? task.completed
                        ? "text-rose-800/70"
                        : "text-rose-900"
                      : task.completed
                        ? "text-stone-400"
                        : "text-stone-800"
                  }`}
                >
                  {task.title}
                </p>

                {formattedTime && (
                  <span
                    className={`mt-1.5 block text-[11px] font-normal ${
                      isSelected ? "text-rose-700/70" : "text-stone-400"
                    }`}
                  >
                    {formattedTime}
                  </span>
                )}
              </div>

              <button
                type="button"
                className={`w-4 h-4 shrink-0 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                  task.completed
                    ? "bg-emerald-700 border-emerald-700 text-[#fdfaf4]"
                    : isSelected
                      ? "bg-[#fdfaf4] border-rose-300"
                      : "bg-[#fdfaf4] border-emerald-700"
                }`}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTask(task.id);
                }}
              >
                {task.completed && (
                  <i className="fa-solid fa-check text-[10px]"></i>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
