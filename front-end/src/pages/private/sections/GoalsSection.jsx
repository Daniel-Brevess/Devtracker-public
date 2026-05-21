import { Target } from "lucide-react";

export default function GoalsSection() {
  return (
    <section className="flex flex-1 items-center justify-center px-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-zinc-950/70 text-zinc-500 backdrop-blur-sm">
          <Target className="h-10 w-10" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold">Goals</h1>

        <span className="mt-2 max-w-sm text-sm text-zinc-500">
          Goals section is under development.
        </span>
      </div>
    </section>
  );
}
