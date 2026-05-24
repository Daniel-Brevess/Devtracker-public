import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Code2,
  MoreVertical,
  Pencil,
  Plus,
  Rocket,
  Target,
  Trash2,
  X,
} from "lucide-react";

import {
  createGoal,
  deleteGoal,
  getAllGoals,
  updateGoal,
} from "../../../services/goal/goalService";
import { getApiErrorMessage } from "../../../utils/apiError";

const difficultyOptions = [
  {
    activeClassName: "bg-emerald-500/10 text-emerald-300",
    dotClassName: "bg-emerald-400",
    label: "Easy",
    value: "LOW",
  },
  {
    activeClassName: "bg-yellow-500/10 text-yellow-300",
    dotClassName: "bg-yellow-400",
    label: "Medium",
    value: "MEDIUM",
  },
  {
    activeClassName: "bg-red-500/10 text-red-300",
    dotClassName: "bg-red-400",
    label: "Hard",
    value: "HIGH",
  },
];

const statusOptions = [
  {
    activeClassName: "bg-zinc-500/10 text-zinc-300",
    dotClassName: "bg-zinc-300",
    label: "Pending",
    value: "TODO",
  },
  {
    activeClassName: "bg-blue-500/10 text-blue-300",
    dotClassName: "bg-blue-400",
    label: "In Progress",
    value: "IN_PROGRESS",
  },
  {
    activeClassName: "bg-emerald-500/10 text-emerald-300",
    dotClassName: "bg-emerald-400",
    label: "Completed",
    value: "DONE",
  },
  {
    activeClassName: "bg-orange-500/10 text-orange-300",
    dotClassName: "bg-orange-400",
    label: "Paused",
    value: "DISCARDED",
  },
];

const filterOptions = [
  { label: "All Goals", value: "ALL" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Pending", value: "TODO" },
  { label: "Completed", value: "DONE" },
  { label: "Paused", value: "DISCARDED" },
];

const goalVisuals = [
  {
    Icon: Code2,
    bgClassName: "bg-blue-500/10 text-blue-300",
  },
  {
    Icon: Rocket,
    bgClassName: "bg-orange-500/10 text-orange-300",
  },
  {
    Icon: Target,
    bgClassName: "bg-blue-500/10 text-blue-300",
  },
  {
    Icon: CheckCircle2,
    bgClassName: "bg-emerald-500/10 text-emerald-300",
  },
];

function getDifficultyOption(difficulty) {
  return (
    difficultyOptions.find((option) => option.value === difficulty) ||
    difficultyOptions[1]
  );
}

function getStatusOption(status) {
  return (
    statusOptions.find((option) => option.value === status) || statusOptions[0]
  );
}

function getGoalVisual(index) {
  return goalVisuals[index % goalVisuals.length];
}

function formatGoalDate(value) {
  if (!value) return "No creation date";

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function mapGoalToCard(goal) {
  return {
    id: goal.id,
    title: goal.title,
    description: goal.description || "No description added yet.",
    difficulty: goal.difficulty,
    status: goal.status,
    createdAt: goal.createdAt,
  };
}

function GoalBadge({ option }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${option.activeClassName}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${option.dotClassName}`} />
      {option.label}
    </span>
  );
}

function FieldSelect({ label, options, value, onChange }) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <label className="block space-y-2">
      <span className="text-sm text-zinc-400">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all focus:border-blue-500/50"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      </div>
      {selectedOption?.activeClassName && (
        <GoalBadge option={selectedOption} />
      )}
    </label>
  );
}

export default function GoalsSection() {
  const [goals, setGoals] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [isLoadingGoals, setIsLoadingGoals] = useState(true);
  const [goalsMessage, setGoalsMessage] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [goalBeingEdited, setGoalBeingEdited] = useState(null);
  const [goalBeingDeleted, setGoalBeingDeleted] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDifficulty, setFormDifficulty] = useState("MEDIUM");
  const [formStatus, setFormStatus] = useState("TODO");
  const [formMessage, setFormMessage] = useState("");
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isDeletingGoal, setIsDeletingGoal] = useState(false);

  useEffect(() => {
    async function loadGoals() {
      setIsLoadingGoals(true);
      setGoalsMessage("");

      try {
        const responseGoals = await getAllGoals();
        setGoals(responseGoals.map(mapGoalToCard));
      } catch (error) {
        setGoalsMessage(
          getApiErrorMessage(error, "Could not load goals. Try again.")
        );
      } finally {
        setIsLoadingGoals(false);
      }
    }

    loadGoals();
  }, []);

  const filteredGoals = useMemo(() => {
    const orderedGoals = [...goals].sort(
      (firstGoal, secondGoal) =>
        new Date(secondGoal.createdAt || 0) - new Date(firstGoal.createdAt || 0)
    );

    if (activeFilter === "ALL") return orderedGoals;

    return orderedGoals.filter((goal) => goal.status === activeFilter);
  }, [activeFilter, goals]);

  function resetForm() {
    setFormTitle("");
    setFormDescription("");
    setFormDifficulty("MEDIUM");
    setFormStatus("TODO");
    setFormMessage("");
  }

  function openCreateModal() {
    resetForm();
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    if (isSavingGoal) return;

    resetForm();
    setIsCreateModalOpen(false);
  }

  function openEditModal(goal) {
    setGoalBeingEdited(goal);
    setFormTitle(goal.title);
    setFormDescription(goal.description === "No description added yet." ? "" : goal.description);
    setFormDifficulty(goal.difficulty || "MEDIUM");
    setFormStatus(goal.status || "TODO");
    setFormMessage("");
  }

  function closeEditModal() {
    if (isSavingGoal) return;

    setGoalBeingEdited(null);
    resetForm();
  }

  function openDeleteModal(goal) {
    setGoalBeingDeleted(goal);
    setDeleteMessage("");
  }

  function closeDeleteModal() {
    if (isDeletingGoal) return;

    setGoalBeingDeleted(null);
    setDeleteMessage("");
  }

  async function handleCreateGoal(event) {
    event.preventDefault();

    const trimmedTitle = formTitle.trim();
    const trimmedDescription = formDescription.trim();
    setFormMessage("");

    if (!trimmedTitle) {
      setFormMessage("Add a title for this goal.");
      return;
    }

    setIsSavingGoal(true);

    try {
      const createdGoal = await createGoal({
        title: trimmedTitle,
        description: trimmedDescription,
        difficulty: formDifficulty,
        status: formStatus,
      });

      setGoals((currentGoals) => [mapGoalToCard(createdGoal), ...currentGoals]);
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      setFormMessage(
        getApiErrorMessage(error, "Could not create goal. Try again.")
      );
    } finally {
      setIsSavingGoal(false);
    }
  }

  async function handleUpdateGoal(event) {
    event.preventDefault();

    const trimmedTitle = formTitle.trim();
    const trimmedDescription = formDescription.trim();
    setFormMessage("");

    if (!trimmedTitle) {
      setFormMessage("Add a title for this goal.");
      return;
    }

    setIsSavingGoal(true);

    try {
      const updatedGoal = await updateGoal({
        goalId: goalBeingEdited.id,
        title: trimmedTitle,
        description: trimmedDescription,
        difficulty: formDifficulty,
        status: formStatus,
      });

      setGoals((currentGoals) =>
        currentGoals.map((goal) =>
          goal.id === updatedGoal.id ? mapGoalToCard(updatedGoal) : goal
        )
      );
      setGoalBeingEdited(null);
      resetForm();
    } catch (error) {
      setFormMessage(
        getApiErrorMessage(error, "Could not update goal. Try again.")
      );
    } finally {
      setIsSavingGoal(false);
    }
  }

  async function handleDeleteGoal() {
    setDeleteMessage("");
    setIsDeletingGoal(true);

    try {
      await deleteGoal({ goalId: goalBeingDeleted.id });

      setGoals((currentGoals) =>
        currentGoals.filter((goal) => goal.id !== goalBeingDeleted.id)
      );
      setGoalBeingDeleted(null);
    } catch (error) {
      setDeleteMessage(
        getApiErrorMessage(error, "Could not delete goal. Try again.")
      );
    } finally {
      setIsDeletingGoal(false);
    }
  }

  function renderGoalForm({ title, description, onSubmit, onClose }) {
    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
        <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/50">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                {description}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSavingGoal}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Close goal form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            <label className="block space-y-2">
              <span className="text-sm text-zinc-400">Goal title</span>
              <input
                name="goalTitle"
                type="text"
                value={formTitle}
                onChange={(event) => {
                  setFormTitle(event.target.value);
                  setFormMessage("");
                }}
                maxLength={255}
                placeholder="Ex: Become a full stack developer"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-blue-500/50"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-zinc-400">Description</span>
              <textarea
                name="goalDescription"
                value={formDescription}
                onChange={(event) => {
                  setFormDescription(event.target.value);
                  setFormMessage("");
                }}
                maxLength={255}
                rows={3}
                placeholder="Write a short objective for this goal."
                className="min-h-24 w-full resize-none rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-600 focus:border-blue-500/50"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <FieldSelect
                label="Difficulty"
                options={difficultyOptions}
                value={formDifficulty}
                onChange={(value) => {
                  setFormDifficulty(value);
                  setFormMessage("");
                }}
              />

              <FieldSelect
                label="Status"
                options={statusOptions}
                value={formStatus}
                onChange={(value) => {
                  setFormStatus(value);
                  setFormMessage("");
                }}
              />
            </div>

            {formMessage && (
              <span className="block text-sm text-red-400">{formMessage}</span>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSavingGoal}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSavingGoal}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-black transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSavingGoal ? "Saving..." : "Save goal"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-1 overflow-hidden">
      <div className="flex h-full w-full flex-col overflow-y-auto px-8 py-8">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Goals
            </h1>
            <p className="mt-2 text-sm text-zinc-500">
              Track your long-term goals and progress.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] hover:bg-blue-400"
          >
            <Plus className="h-4 w-4" />
            Create Goal
          </button>
        </div>

        <div className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-3 overflow-x-auto">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setActiveFilter(option.value)}
                className={`shrink-0 border-b-2 px-4 py-2 text-sm font-medium transition ${
                  activeFilter === option.value
                    ? "border-blue-400 text-blue-300"
                    : "border-transparent text-zinc-500 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <span className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-400">
            {filteredGoals.length} goals found
          </span>
        </div>

        {isLoadingGoals && (
          <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6">
            <p className="text-sm text-zinc-400">Loading goals...</p>
          </div>
        )}

        {!isLoadingGoals && goalsMessage && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6">
            <p className="text-sm text-red-300">{goalsMessage}</p>
          </div>
        )}

        {!isLoadingGoals && !goalsMessage && filteredGoals.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6">
            <p className="text-sm font-medium text-white">No goals found.</p>
            <span className="mt-1 block text-xs text-zinc-600">
              Create your first goal or change the selected filter.
            </span>
          </div>
        )}

        {!isLoadingGoals && !goalsMessage && filteredGoals.length > 0 && (
          <div className="space-y-4 pb-8">
            {filteredGoals.map((goal, index) => {
              const difficultyOption = getDifficultyOption(goal.difficulty);
              const statusOption = getStatusOption(goal.status);
              const visual = getGoalVisual(index);
              const Icon = visual.Icon;

              return (
                <article
                  key={goal.id}
                  className="grid gap-5 rounded-3xl border border-white/10 bg-zinc-950/50 p-5 backdrop-blur-sm transition hover:border-blue-400/25 hover:bg-zinc-950/70 lg:grid-cols-[1.35fr_0.55fr_0.7fr_auto]"
                >
                  <div className="flex min-w-0 gap-5">
                    <div
                      className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl ${visual.bgClassName}`}
                    >
                      <Icon className="h-9 w-9" />
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-base font-semibold text-white">
                        {goal.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 max-w-xl text-sm leading-6 text-zinc-500">
                        {goal.description}
                      </p>
                      <span className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Created on {formatGoalDate(goal.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-zinc-500">Difficulty</span>
                    <GoalBadge option={difficultyOption} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-zinc-500">Status</span>
                    <GoalBadge option={statusOption} />
                  </div>

                  <div className="flex items-start justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(goal)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-500 transition hover:border-blue-400/40 hover:text-blue-300"
                      aria-label={`Edit ${goal.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => openDeleteModal(goal)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-500 transition hover:border-red-400/40 hover:text-red-300"
                      aria-label={`Delete ${goal.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <MoreVertical className="mt-2 h-5 w-5 text-zinc-600" />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {isCreateModalOpen &&
        renderGoalForm({
          title: "Create goal",
          description: "Add a long-term objective to track inside DevTracker.",
          onSubmit: handleCreateGoal,
          onClose: closeCreateModal,
        })}

      {goalBeingEdited &&
        renderGoalForm({
          title: "Edit goal",
          description: "Update the title, description, difficulty or status.",
          onSubmit: handleUpdateGoal,
          onClose: closeEditModal,
        })}

      {goalBeingDeleted && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Delete goal
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  This goal will be removed from your list.
                </p>
              </div>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeletingGoal}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-400 transition hover:border-white/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Close delete modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-white/5 bg-black/40 p-4">
              <p className="text-sm font-medium text-white">
                {goalBeingDeleted.title}
              </p>
              <span className="mt-1 block text-xs text-zinc-600">
                Confirm that you want to delete this goal.
              </span>
            </div>

            {deleteMessage && (
              <span className="mt-4 block text-sm text-red-400">
                {deleteMessage}
              </span>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeletingGoal}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteGoal}
                disabled={isDeletingGoal}
                className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeletingGoal ? "Deleting..." : "Delete goal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
