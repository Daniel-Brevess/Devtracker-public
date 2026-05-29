import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Circle,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  createFocus,
  deleteFocus,
  getAllFocuses,
  updateFocus,
} from "../../../services/focus/focusService";
import {
  createTask,
  deleteTask,
  getTasksByFocus,
  toggleTaskStatus,
  updateTask,
} from "../../../services/task/taskService";
import { getApiErrorMessage } from "../../../utils/apiError";

const taskPriorityOptions = [
  {
    activeClassName: "bg-emerald-500/10 text-emerald-300",
    hoverClassName: "hover:bg-emerald-500/10 hover:text-emerald-300",
    label: "Low",
    value: "LOW",
  },
  {
    activeClassName: "bg-yellow-500/10 text-yellow-300",
    hoverClassName: "hover:bg-yellow-500/10 hover:text-yellow-300",
    label: "Medium",
    value: "MEDIUM",
  },
  {
    activeClassName: "bg-red-500/10 text-red-300",
    hoverClassName: "hover:bg-red-500/10 hover:text-red-300",
    label: "High",
    value: "HIGH",
  },
];

function getTaskPriorityOption(priority) {
  return (
    taskPriorityOptions.find((option) => option.value === priority) ||
    taskPriorityOptions[1]
  );
}

function mapFocusToGroup(focus, tasks = []) {
  return {
    id: focus.id,
    title: focus.title,
    createdAt: focus.createdAt,
    tasks: tasks.map(mapTaskToCard),
  };
}

function mapTaskToCard(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    meta: task.description || task.priority,
    done: Boolean(task.status),
  };
}

export default function TasksSection() {
  const selectedTaskRef = useRef(null);
  const [focusGroups, setFocusGroups] = useState([]);
  const [isCreateFocusModalOpen, setIsCreateFocusModalOpen] = useState(false);
  const [focusTitle, setFocusTitle] = useState("");
  const [createFocusMessage, setCreateFocusMessage] = useState("");
  const [isCreatingFocus, setIsCreatingFocus] = useState(false);
  const [isLoadingFocuses, setIsLoadingFocuses] = useState(true);
  const [focusesMessage, setFocusesMessage] = useState("");
  const [focusBeingEdited, setFocusBeingEdited] = useState(null);
  const [editFocusTitle, setEditFocusTitle] = useState("");
  const [editFocusMessage, setEditFocusMessage] = useState("");
  const [isUpdatingFocus, setIsUpdatingFocus] = useState(false);
  const [focusBeingDeleted, setFocusBeingDeleted] = useState(null);
  const [deleteFocusMessage, setDeleteFocusMessage] = useState("");
  const [isDeletingFocus, setIsDeletingFocus] = useState(false);
  const [taskFormFocusId, setTaskFormFocusId] = useState(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskPriority, setTaskPriority] = useState("MEDIUM");
  const [isPriorityMenuOpen, setIsPriorityMenuOpen] = useState(false);
  const [createTaskMessage, setCreateTaskMessage] = useState("");
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskBeingEdited, setTaskBeingEdited] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskDescription, setEditTaskDescription] = useState("");
  const [editTaskPriority, setEditTaskPriority] = useState("MEDIUM");
  const [isEditTaskPriorityMenuOpen, setIsEditTaskPriorityMenuOpen] =
    useState(false);
  const [editTaskMessage, setEditTaskMessage] = useState("");
  const [isUpdatingTask, setIsUpdatingTask] = useState(false);
  const [taskBeingDeleted, setTaskBeingDeleted] = useState(null);
  const [deleteTaskMessage, setDeleteTaskMessage] = useState("");
  const [isDeletingTask, setIsDeletingTask] = useState(false);
  const [taskBeingToggled, setTaskBeingToggled] = useState(null);
  const [toggleTaskMessage, setToggleTaskMessage] = useState("");
  const [isTogglingTask, setIsTogglingTask] = useState(false);

  useEffect(() => {
    async function loadFocuses() {
      setIsLoadingFocuses(true);
      setFocusesMessage("");

      try {
        const focuses = await getAllFocuses();
        const focusGroupsWithTasks = await Promise.all(
          focuses.map(async (focus) => {
            const tasks = await getTasksByFocus(focus.id);

            return mapFocusToGroup(focus, tasks);
          })
        );

        setFocusGroups(focusGroupsWithTasks);
      } catch (error) {
        setFocusesMessage(
          getApiErrorMessage(error, "Could not load focuses. Try again.")
        );
      } finally {
        setIsLoadingFocuses(false);
      }
    }

    loadFocuses();
  }, []);

  useEffect(() => {
    function handleClickOutsideSelectedTask(event) {
      if (isUpdatingTask || isDeletingTask || isTogglingTask || !selectedTaskId) {
        return;
      }

      if (
        selectedTaskRef.current &&
        !selectedTaskRef.current.contains(event.target)
      ) {
        setSelectedTaskId(null);
        setTaskBeingEdited(null);
        setTaskBeingDeleted(null);
        setTaskBeingToggled(null);
        setEditTaskMessage("");
        setDeleteTaskMessage("");
        setToggleTaskMessage("");
        setIsEditTaskPriorityMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutsideSelectedTask);

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSelectedTask);
    };
  }, [isDeletingTask, isTogglingTask, isUpdatingTask, selectedTaskId]);

  const taskSummary = useMemo(() => {
    const tasks = focusGroups.flatMap((group) => group.tasks);

    return {
      open: tasks.filter((task) => !task.done).length,
      completed: tasks.filter((task) => task.done).length,
      activeFocus: focusGroups[0]?.title || "None",
    };
  }, [focusGroups]);
  const focusColumns = useMemo(
    () => [
      focusGroups.filter((_, index) => index % 2 === 0),
      focusGroups.filter((_, index) => index % 2 === 1),
    ],
    [focusGroups]
  );

  function openCreateFocusModal() {
    setFocusTitle("");
    setCreateFocusMessage("");
    setIsCreateFocusModalOpen(true);
  }

  function closeCreateFocusModal() {
    if (isCreatingFocus) return;

    setFocusTitle("");
    setCreateFocusMessage("");
    setIsCreateFocusModalOpen(false);
  }

  function openEditFocusModal(focusGroup) {
    setFocusBeingEdited(focusGroup);
    setEditFocusTitle(focusGroup.title);
    setEditFocusMessage("");
  }

  function closeEditFocusModal() {
    if (isUpdatingFocus) return;

    setFocusBeingEdited(null);
    setEditFocusTitle("");
    setEditFocusMessage("");
  }

  function openDeleteFocusModal(focusGroup) {
    setFocusBeingDeleted(focusGroup);
    setDeleteFocusMessage("");
  }

  function closeDeleteFocusModal() {
    if (isDeletingFocus) return;

    setFocusBeingDeleted(null);
    setDeleteFocusMessage("");
  }

  function openTaskForm(focusId) {
    setTaskFormFocusId(focusId);
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("MEDIUM");
    setCreateTaskMessage("");
    setIsPriorityMenuOpen(false);
  }

  function closeTaskForm() {
    if (isCreatingTask) return;

    setTaskFormFocusId(null);
    setTaskTitle("");
    setTaskDescription("");
    setTaskPriority("MEDIUM");
    setCreateTaskMessage("");
    setIsPriorityMenuOpen(false);
  }

  function selectTask(task) {
    if (isUpdatingTask) return;

    setSelectedTaskId(task.id);

    if (taskBeingEdited?.id !== task.id) {
      setTaskBeingEdited(null);
      setEditTaskMessage("");
      setIsEditTaskPriorityMenuOpen(false);
    }
  }

  function openEditTaskMode(task, focusId) {
    setSelectedTaskId(task.id);
    setTaskBeingEdited({
      ...task,
      focusId,
    });
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description || "");
    setEditTaskPriority(task.priority || "MEDIUM");
    setEditTaskMessage("");
    setIsEditTaskPriorityMenuOpen(false);
  }

  function closeEditTaskMode() {
    if (isUpdatingTask) return;

    setTaskBeingEdited(null);
    setEditTaskTitle("");
    setEditTaskDescription("");
    setEditTaskPriority("MEDIUM");
    setEditTaskMessage("");
    setIsEditTaskPriorityMenuOpen(false);
  }

  async function handleDeleteTask(task, focusId) {
    setSelectedTaskId(task.id);
    setTaskBeingDeleted({
      ...task,
      focusId,
    });
    setDeleteTaskMessage("");
    setIsDeletingTask(true);

    try {
      await deleteTask({
        focusId,
        taskId: task.id,
      });

      setFocusGroups((currentGroups) =>
        currentGroups.map((group) =>
          group.id === focusId
            ? {
                ...group,
                tasks: group.tasks.filter(
                  (currentTask) => currentTask.id !== task.id
                ),
              }
            : group
        )
      );

      setSelectedTaskId(null);
      setTaskBeingEdited(null);
      setTaskBeingDeleted(null);
      setDeleteTaskMessage("");
      setIsEditTaskPriorityMenuOpen(false);
    } catch (error) {
      setDeleteTaskMessage(
        getApiErrorMessage(error, "Could not delete task. Try again.")
      );
    } finally {
      setIsDeletingTask(false);
    }
  }

  async function handleToggleTaskStatus(task, focusId) {
    if (isTogglingTask || isUpdatingTask || isDeletingTask) return;

    setTaskBeingToggled({
      ...task,
      focusId,
    });
    setToggleTaskMessage("");
    setIsTogglingTask(true);

    try {
      const updatedTask = await toggleTaskStatus({
        focusId,
        taskId: task.id,
      });

      setFocusGroups((currentGroups) =>
        currentGroups.map((group) =>
          group.id === updatedTask.idFocus
            ? {
                ...group,
                tasks: group.tasks.map((currentTask) =>
                  currentTask.id === updatedTask.id
                    ? mapTaskToCard(updatedTask)
                    : currentTask
                ),
              }
            : group
        )
      );

      setTaskBeingToggled(null);
      setToggleTaskMessage("");
    } catch (error) {
      setToggleTaskMessage(
        getApiErrorMessage(error, "Could not update task status. Try again.")
      );
    } finally {
      setIsTogglingTask(false);
    }
  }

  async function handleCreateFocus(event) {
    event.preventDefault();

    const trimmedTitle = focusTitle.trim();
    setCreateFocusMessage("");

    if (!trimmedTitle) {
      setCreateFocusMessage("Add a title for this focus.");
      return;
    }

    setIsCreatingFocus(true);

    try {
      const createdFocus = await createFocus({ title: trimmedTitle });

      setFocusGroups((currentGroups) => [
        mapFocusToGroup(createdFocus),
        ...currentGroups,
      ]);

      setFocusTitle("");
      setIsCreateFocusModalOpen(false);
    } catch (error) {
      setCreateFocusMessage(
        getApiErrorMessage(error, "Could not create focus. Try again.")
      );
    } finally {
      setIsCreatingFocus(false);
    }
  }

  async function handleUpdateFocus(event) {
    event.preventDefault();

    const trimmedTitle = editFocusTitle.trim();
    setEditFocusMessage("");

    if (!trimmedTitle) {
      setEditFocusMessage("Add a title for this focus.");
      return;
    }

    setIsUpdatingFocus(true);

    try {
      const updatedFocus = await updateFocus({
        id: focusBeingEdited.id,
        title: trimmedTitle,
      });

      setFocusGroups((currentGroups) =>
        currentGroups.map((group) =>
          group.id === updatedFocus.id
            ? {
                ...group,
                title: updatedFocus.title,
                createdAt: updatedFocus.createdAt,
              }
            : group
        )
      );

      setFocusBeingEdited(null);
      setEditFocusTitle("");
      setEditFocusMessage("");
    } catch (error) {
      setEditFocusMessage(
        getApiErrorMessage(error, "Could not update focus. Try again.")
      );
    } finally {
      setIsUpdatingFocus(false);
    }
  }

  async function handleDeleteFocus() {
    setDeleteFocusMessage("");
    setIsDeletingFocus(true);

    try {
      await deleteFocus({ id: focusBeingDeleted.id });

      setFocusGroups((currentGroups) =>
        currentGroups.filter((group) => group.id !== focusBeingDeleted.id)
      );

      setFocusBeingDeleted(null);
      setDeleteFocusMessage("");
    } catch (error) {
      setDeleteFocusMessage(
        getApiErrorMessage(error, "Could not delete focus. Try again.")
      );
    } finally {
      setIsDeletingFocus(false);
    }
  }

  async function handleCreateTask(event) {
    event.preventDefault();

    const trimmedTitle = taskTitle.trim();
    const trimmedDescription = taskDescription.trim();
    setCreateTaskMessage("");

    if (!trimmedTitle) {
      setCreateTaskMessage("Add a title for this task.");
      return;
    }

    setIsCreatingTask(true);

    try {
      const createdTask = await createTask({
        focusId: taskFormFocusId,
        title: trimmedTitle,
        description: trimmedDescription,
        priority: taskPriority,
      });

      setFocusGroups((currentGroups) =>
        currentGroups.map((group) =>
          group.id === createdTask.idFocus
            ? {
                ...group,
                tasks: [...group.tasks, mapTaskToCard(createdTask)],
              }
            : group
        )
      );

      setTaskFormFocusId(null);
      setTaskTitle("");
      setTaskDescription("");
      setTaskPriority("MEDIUM");
      setCreateTaskMessage("");
      setIsPriorityMenuOpen(false);
    } catch (error) {
      setCreateTaskMessage(
        getApiErrorMessage(error, "Could not create task. Try again.")
      );
    } finally {
      setIsCreatingTask(false);
    }
  }

  async function handleUpdateTask(event) {
    event.preventDefault();

    const trimmedTitle = editTaskTitle.trim();
    const trimmedDescription = editTaskDescription.trim();
    setEditTaskMessage("");

    if (!trimmedTitle) {
      setEditTaskMessage("Add a title for this task.");
      return;
    }

    setIsUpdatingTask(true);

    try {
      const updatedTask = await updateTask({
        focusId: taskBeingEdited.focusId,
        taskId: taskBeingEdited.id,
        title: trimmedTitle,
        description: trimmedDescription,
        priority: editTaskPriority,
      });

      setFocusGroups((currentGroups) =>
        currentGroups.map((group) =>
          group.id === updatedTask.idFocus
            ? {
                ...group,
                tasks: group.tasks.map((task) =>
                  task.id === updatedTask.id ? mapTaskToCard(updatedTask) : task
                ),
              }
            : group
        )
      );

      setSelectedTaskId(updatedTask.id);
      setTaskBeingEdited(null);
      setEditTaskTitle("");
      setEditTaskDescription("");
      setEditTaskPriority("MEDIUM");
      setEditTaskMessage("");
      setIsEditTaskPriorityMenuOpen(false);
    } catch (error) {
      setEditTaskMessage(
        getApiErrorMessage(error, "Could not update task. Try again.")
      );
    } finally {
      setIsUpdatingTask(false);
    }
  }

  const selectedPriorityLabel =
    getTaskPriorityOption(taskPriority).label;
  const selectedPriorityClassName =
    getTaskPriorityOption(taskPriority).activeClassName;
  const selectedEditPriorityLabel =
    getTaskPriorityOption(editTaskPriority).label;
  const selectedEditPriorityClassName =
    getTaskPriorityOption(editTaskPriority).activeClassName;

  function renderCreateTaskForm() {
    return (
      <form
        onSubmit={handleCreateTask}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-black/40 p-3"
      >
        <div className="grid gap-2.5">
          <input
            name="taskTitle"
            type="text"
            value={taskTitle}
            onChange={(event) => {
              setTaskTitle(event.target.value);
              setCreateTaskMessage("");
            }}
            maxLength={255}
            placeholder="Task title"
            className="w-full rounded-xl border border-white/10 bg-zinc-950/70 px-3 py-2 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-blue-500/50"
          />

          <input
            name="taskDescription"
            type="text"
            value={taskDescription}
            onChange={(event) => {
              setTaskDescription(event.target.value);
              setCreateTaskMessage("");
            }}
            maxLength={255}
            placeholder="Description"
            className="w-full rounded-xl border border-white/10 bg-zinc-950/70 px-3 py-2 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-blue-500/50"
          />

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setIsPriorityMenuOpen((currentState) => !currentState)
              }
              className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-zinc-950/70 px-3 py-2 text-sm transition hover:border-white/20"
            >
              <span
                className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${selectedPriorityClassName}`}
              >
                {selectedPriorityLabel}
              </span>
              <ChevronDown className="h-4 w-4 text-zinc-500" />
            </button>

            {isPriorityMenuOpen && (
              <div className="absolute left-0 right-0 top-11 z-20 rounded-2xl border border-white/10 bg-zinc-950 p-1.5 shadow-xl shadow-black/40">
                {taskPriorityOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setTaskPriority(option.value);
                      setIsPriorityMenuOpen(false);
                      setCreateTaskMessage("");
                    }}
                    className={`flex w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                      taskPriority === option.value
                        ? option.activeClassName
                        : `text-zinc-400 ${option.hoverClassName}`
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {createTaskMessage && (
            <span className="text-sm text-red-400">{createTaskMessage}</span>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeTaskForm}
              disabled={isCreatingTask}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCreatingTask}
              className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreatingTask ? "Creating..." : "Create task"}
            </button>
          </div>
        </div>
      </form>
    );
  }

  function renderEditTaskForm() {
    return (
      <form onSubmit={handleUpdateTask} className="mt-3 space-y-2.5">
        <input
          name="editTaskTitle"
          type="text"
          value={editTaskTitle}
          onChange={(event) => {
            setEditTaskTitle(event.target.value);
            setEditTaskMessage("");
          }}
          maxLength={255}
          className="w-full rounded-xl border border-white/10 bg-zinc-950/80 px-3 py-2 text-sm text-white outline-none transition-all focus:border-blue-500/50"
        />

        <input
          name="editTaskDescription"
          type="text"
          value={editTaskDescription}
          onChange={(event) => {
            setEditTaskDescription(event.target.value);
            setEditTaskMessage("");
          }}
          maxLength={255}
          placeholder="Description"
          className="w-full rounded-xl border border-white/10 bg-zinc-950/80 px-3 py-2 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-blue-500/50"
        />

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setIsEditTaskPriorityMenuOpen((currentState) => !currentState)
            }
            className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-zinc-950/80 px-3 py-2 text-sm transition hover:border-white/20"
          >
            <span
              className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${selectedEditPriorityClassName}`}
            >
              {selectedEditPriorityLabel}
            </span>
            <ChevronDown className="h-4 w-4 text-zinc-500" />
          </button>

          {isEditTaskPriorityMenuOpen && (
            <div className="absolute left-0 right-0 top-11 z-30 rounded-2xl border border-white/10 bg-zinc-950 p-1.5 shadow-xl shadow-black/40">
              {taskPriorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setEditTaskPriority(option.value);
                    setIsEditTaskPriorityMenuOpen(false);
                    setEditTaskMessage("");
                  }}
                  className={`flex w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                    editTaskPriority === option.value
                      ? option.activeClassName
                      : `text-zinc-400 ${option.hoverClassName}`
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {editTaskMessage && (
          <span className="block text-sm text-red-400">{editTaskMessage}</span>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={closeEditTaskMode}
            disabled={isUpdatingTask}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isUpdatingTask}
            className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUpdatingTask ? "Saving..." : "Edit task"}
          </button>
        </div>
      </form>
    );
  }

  return (
    <section className="flex-1 overflow-y-auto px-8 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Tasks
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              Plan your development work
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
              Organize what needs to be built, reviewed, and shipped next.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateFocusModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            New focus
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Open
            </p>
            <strong className="mt-2 block text-2xl text-white">
              {taskSummary.open}
            </strong>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Completed
            </p>
            <strong className="mt-2 block text-2xl text-white">
              {taskSummary.completed}
            </strong>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-5">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              Focus
            </p>
            <strong className="mt-2 block truncate text-2xl text-white">
              {taskSummary.activeFocus}
            </strong>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
          <Search className="h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />
        </div>

        <div className="mt-6">
          {isLoadingFocuses && (
            <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-5 backdrop-blur-sm lg:col-span-2">
              <p className="text-sm font-medium text-white">
                Loading focuses...
              </p>
              <span className="mt-1 block text-xs text-zinc-600">
                Your focus cards will appear here.
              </span>
            </div>
          )}

          {!isLoadingFocuses && focusesMessage && (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-5 backdrop-blur-sm lg:col-span-2">
              <p className="text-sm font-medium text-red-300">
                {focusesMessage}
              </p>
            </div>
          )}

          {!isLoadingFocuses && !focusesMessage && focusGroups.length === 0 && (
            <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-5 backdrop-blur-sm lg:col-span-2">
              <p className="text-sm font-medium text-white">
                No focuses yet.
              </p>
              <span className="mt-1 block text-xs text-zinc-600">
                Create your first focus to organize tasks around it.
              </span>
            </div>
          )}

          {!isLoadingFocuses && !focusesMessage && focusGroups.length > 0 && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
              {focusColumns.map((column, columnIndex) => (
                <div key={columnIndex} className="space-y-6">
                  {column.map((group) => (
                    <div
                      key={group.id}
                      className="rounded-3xl border border-white/10 bg-zinc-950/50 p-5 backdrop-blur-sm"
                    >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="min-w-0 truncate text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  {group.title}
                </h2>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditFocusModal(group)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-500 transition hover:border-blue-400/40 hover:text-blue-400"
                    aria-label={`Edit ${group.title} focus`}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => openDeleteFocusModal(group)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-500 transition hover:border-red-400/40 hover:text-red-400"
                    aria-label={`Delete ${group.title} focus`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <CalendarDays className="h-4 w-4 text-blue-400" />
                </div>
              </div>

              <div className="space-y-3">
                {group.tasks.length === 0 && (
                  <button
                    type="button"
                    onClick={() => openTaskForm(group.id)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-black/40 p-4 text-left transition hover:border-blue-400/40 hover:bg-blue-500/5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-blue-400">
                      <Plus className="h-4 w-4" />
                    </span>

                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-white">
                        Add tasks to this focus
                      </span>
                      <span className="mt-1 block text-xs text-zinc-600">
                        Start filling this focus with the work you want to do.
                      </span>
                    </span>
                  </button>
                )}

                {group.tasks.length === 0 &&
                  taskFormFocusId === group.id &&
                  renderCreateTaskForm()}

                {group.tasks.map((task) => {
                  const StatusIcon = task.done ? CheckCircle2 : Circle;
                  const priorityOption = getTaskPriorityOption(task.priority);
                  const isSelectedTask = selectedTaskId === task.id;
                  const isEditingTask = taskBeingEdited?.id === task.id;
                  const isTogglingThisTask =
                    isTogglingTask && taskBeingToggled?.id === task.id;

                  return (
                    <div
                      key={task.id}
                      ref={isSelectedTask ? selectedTaskRef : null}
                      role="button"
                      tabIndex={0}
                      onClick={() => selectTask(task)}
                      onKeyDown={(event) => {
                        if (
                          event.target === event.currentTarget &&
                          (event.key === "Enter" || event.key === " ")
                        ) {
                          event.preventDefault();
                          selectTask(task);
                        }
                      }}
                      className={`relative flex cursor-pointer items-start gap-3 rounded-2xl border px-4 transition hover:border-white/15 ${
                        isSelectedTask
                          ? "z-20 scale-[1.02] border-blue-400/30 bg-zinc-950 px-5 py-4 shadow-2xl shadow-black/30"
                          : "z-0 border-white/5 bg-black/40 py-3"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleToggleTaskStatus(task, group.id);
                        }}
                        disabled={isTogglingThisTask}
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60 ${
                          task.done
                            ? "text-emerald-400 hover:text-emerald-300"
                            : "text-zinc-600 hover:text-emerald-400"
                        }`}
                        aria-label={
                          task.done ? "Mark task as open" : "Mark task as done"
                        }
                      >
                        <StatusIcon className="h-4 w-4" />
                      </button>

                      <div className="min-w-0 flex-1">
                        {!isEditingTask && (
                          <>
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p
                                  className={`truncate text-sm font-medium ${
                                    task.done
                                      ? "text-zinc-500 line-through"
                                      : "text-white"
                                  }`}
                                >
                                  {task.title}
                                </p>

                                <span className="mt-1 block text-xs text-zinc-600">
                                  {task.meta}
                                </span>
                              </div>

                              {isSelectedTask && (
                                <div className="flex shrink-0 items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      openEditTaskMode(task, group.id);
                                    }}
                                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition hover:border-blue-400/40 hover:text-blue-300"
                                  >
                                    Edit task
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleDeleteTask(task, group.id);
                                    }}
                                    disabled={
                                      isDeletingTask &&
                                      taskBeingDeleted?.id === task.id
                                    }
                                    className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:border-red-400/40 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    {isDeletingTask &&
                                    taskBeingDeleted?.id === task.id
                                      ? "Deleting..."
                                      : "Delete task"}
                                  </button>
                                </div>
                              )}
                            </div>

                            <span
                              className={`mt-1.5 inline-flex rounded px-1.5 py-px text-[9px] font-semibold lowercase leading-none ${priorityOption.activeClassName}`}
                            >
                              {priorityOption.label.toLowerCase()}
                            </span>

                            {deleteTaskMessage &&
                              taskBeingDeleted?.id === task.id && (
                                <span className="mt-2 block text-xs text-red-400">
                                  {deleteTaskMessage}
                                </span>
                              )}

                            {toggleTaskMessage &&
                              taskBeingToggled?.id === task.id && (
                                <span className="mt-2 block text-xs text-red-400">
                                  {toggleTaskMessage}
                                </span>
                              )}
                          </>
                        )}

                        {isEditingTask && renderEditTaskForm()}
                      </div>
                    </div>
                  );
                })}

                {group.tasks.length > 0 && taskFormFocusId !== group.id && (
                  <button
                    type="button"
                    onClick={() => openTaskForm(group.id)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-black/30 px-4 py-3 text-sm font-medium text-zinc-400 transition hover:border-blue-400/40 hover:bg-blue-500/5 hover:text-blue-300"
                  >
                    <Plus className="h-4 w-4" />
                    Add task
                  </button>
                )}

                {group.tasks.length > 0 &&
                  taskFormFocusId === group.id &&
                  renderCreateTaskForm()}
              </div>
            </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isCreateFocusModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  New focus
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  Create a focus area before adding tasks to it.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreateFocusModal}
                disabled={isCreatingFocus}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFocus} className="mt-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Focus title</label>

                <input
                  name="focusTitle"
                  type="text"
                  value={focusTitle}
                  onChange={(event) => {
                    setFocusTitle(event.target.value);
                    setCreateFocusMessage("");
                  }}
                  maxLength={255}
                  placeholder="Ex: Authentication flow"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-blue-500/50"
                />
              </div>

              {createFocusMessage && (
                <span className="block text-sm text-red-400">
                  {createFocusMessage}
                </span>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeCreateFocusModal}
                  disabled={isCreatingFocus}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreatingFocus}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreatingFocus ? "Creating..." : "Create focus"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {focusBeingEdited && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Edit focus
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  Update only the focus title.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditFocusModal}
                disabled={isUpdatingFocus}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateFocus} className="mt-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Focus title</label>

                <input
                  name="editFocusTitle"
                  type="text"
                  value={editFocusTitle}
                  onChange={(event) => {
                    setEditFocusTitle(event.target.value);
                    setEditFocusMessage("");
                  }}
                  maxLength={255}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-blue-500/50"
                />
              </div>

              {editFocusMessage && (
                <span className="block text-sm text-red-400">
                  {editFocusMessage}
                </span>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeEditFocusModal}
                  disabled={isUpdatingFocus}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isUpdatingFocus}
                  className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isUpdatingFocus ? "Saving..." : "Save focus"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {focusBeingDeleted && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Delete focus
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  This will remove the focus and all tasks inside it.
                </p>
              </div>

              <button
                type="button"
                onClick={closeDeleteFocusModal}
                disabled={isDeletingFocus}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-white/5 bg-black/40 p-4">
              <p className="text-sm font-medium text-white">
                {focusBeingDeleted.title}
              </p>
              <span className="mt-1 block text-xs text-zinc-600">
                Confirm that you want to delete this focus and its tasks.
              </span>
            </div>

            {deleteFocusMessage && (
              <span className="mt-4 block text-sm text-red-400">
                {deleteFocusMessage}
              </span>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteFocusModal}
                disabled={isDeletingFocus}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteFocus}
                disabled={isDeletingFocus}
                className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeletingFocus ? "Deleting..." : "Delete focus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
