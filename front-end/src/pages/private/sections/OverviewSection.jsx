import { Terminal } from "lucide-react";

export default function OverviewSection() {
  return (
    <section className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-zinc-950/70 text-blue-400 backdrop-blur-sm">
          <Terminal className="h-12 w-12" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold">
          DevTracker Workspace
        </h1>

        <p className="mt-2 max-w-sm text-sm text-zinc-500">
          Dashboard base ready to receive the next MVP features.
        </p>
      </div>
    </section>
  );
}
