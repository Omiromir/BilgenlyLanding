import { ChevronRight, Upload } from "lucide-react";
import { useDashboardPageMeta } from "../../../features/dashboard/hooks/useDashboardPageMeta";
import { teacherQuizSteps } from "../../../features/dashboard/mock/teacherWorkspace";

export function TeacherGenerateQuizPage() {
  const meta = useDashboardPageMeta();

  return (
    <div className="mx-auto max-w-[920px] space-y-6 pt-2">
      <div className="text-center">
        <h1 className="text-[3rem] font-semibold tracking-[-0.04em] text-[var(--dashboard-text-strong)]">
          {meta?.title ?? "Generate Quiz with AI"}
        </h1>
        <p className="mt-2 text-[1.05rem] text-slate-500">
          Upload your lecture materials and let AI create comprehensive quiz
          questions
        </p>
      </div>

      <div className="flex items-center justify-center gap-5">
        {teacherQuizSteps.map((item, index) => (
          <div key={item.step} className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  item.active
                    ? "bg-[var(--dashboard-brand)] text-white"
                    : "bg-[var(--dashboard-surface-muted)] text-[var(--dashboard-text-soft)]"
                }`}
              >
                {item.step}
              </div>
              <span
                className={`text-[1.02rem] ${
                  item.active ? "font-medium text-[var(--dashboard-brand)]" : "text-[var(--dashboard-text-soft)]"
                }`}
              >
                {item.label}
              </span>
            </div>
            {index < teacherQuizSteps.length - 1 ? (
              <ChevronRight className="h-5 w-5 text-slate-400" />
            ) : null}
          </div>
        ))}
      </div>

      <section className="dashboard-card rounded-[28px] border p-8">
        <div className="rounded-[22px] border border-dashed border-[var(--dashboard-border)] px-6 py-18 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center text-slate-500">
            <Upload className="h-14 w-14" strokeWidth={1.7} />
          </div>
          <h2 className="mt-5 text-[2rem] font-medium text-[var(--dashboard-text-strong)]">
            Upload Lecture Materials
          </h2>
          <p className="mt-2 text-[1.02rem] text-slate-500">
            Drag and drop or click to browse
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Supports PDF, TXT, DOCX (Max 50MB)
          </p>
        </div>
      </section>

      <section className="dashboard-card rounded-[28px] border p-8">
        <h2 className="text-[2rem] font-medium text-[var(--dashboard-text-strong)]">
          Or paste text content
        </h2>
        <textarea
          placeholder="Paste your lecture notes, article, or any educational content here..."
          className="dashboard-input mt-5 min-h-[180px] w-full resize-none rounded-[18px] border border-[var(--dashboard-border-soft)] px-4 py-4 text-[1rem] outline-none transition focus:border-[var(--dashboard-brand)] focus:bg-white"
        />

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            className="dashboard-button-primary rounded-[14px] px-6 py-3 text-sm font-medium transition"
          >
            Continue with Text
          </button>
        </div>
      </section>
    </div>
  );
}
