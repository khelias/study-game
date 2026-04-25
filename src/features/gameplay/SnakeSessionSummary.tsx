import React from 'react';
import { useTranslation } from '../../i18n/useTranslation';
import type { SnakeSessionStats } from '../../stores/playSessionStore';

interface SnakeSessionSummaryProps {
  stats: SnakeSessionStats;
}

/**
 * End-of-session summary card for the snake family. Closes the learning loop
 * the audit (Phase 1 Slice 3b) flagged: previously the snake just died and
 * the screen showed nothing about *what* the kid practiced.
 *
 * Surfaces session-scoped metrics:
 *   - Longest snake reached
 *   - Accuracy (correct / attempted)
 *   - Best in-session streak (also drives grid expansion)
 *   - Top-3 hardest facts (most wrong attempts) — mini-precursor to the
 *     full per-fact mastery tracker planned for Phase 1.
 */
export const SnakeSessionSummary: React.FC<SnakeSessionSummaryProps> = ({ stats }) => {
  const t = useTranslation();
  const summary = t.game.snakeSummary;

  const accuracyPct =
    stats.factsAttempted > 0 ? Math.round((stats.factsCorrect / stats.factsAttempted) * 100) : 0;

  const hardestFacts = Object.entries(stats.factHistory)
    .map(([equation, h]) => ({
      equation,
      attempts: h.attempts,
      wrong: h.attempts - h.correct,
    }))
    .filter((f) => f.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong || b.attempts - a.attempts)
    .slice(0, 3);

  return (
    <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-4 mb-4">
      <div className="text-[0.7rem] sm:text-xs uppercase tracking-wide text-slate-500 font-semibold mb-3">
        {summary.title}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        <SummaryStat label={summary.maxLength} value={`${stats.maxSnakeLength}`} />
        <SummaryStat
          label={summary.accuracy}
          value={stats.factsAttempted > 0 ? `${accuracyPct}%` : '-'}
        />
        <SummaryStat label={summary.bestStreak} value={`${stats.maxStreak}`} />
        <SummaryStat label={summary.factsAttempted} value={`${stats.factsAttempted}`} />
      </div>

      {stats.factsAttempted === 0 ? (
        <p className="text-xs sm:text-sm text-slate-500 italic">{summary.noFactsAttempted}</p>
      ) : hardestFacts.length === 0 ? (
        <p className="text-xs sm:text-sm text-emerald-700 font-semibold">{summary.noMistakes}</p>
      ) : (
        <div>
          <div className="text-[0.65rem] sm:text-xs uppercase tracking-wide text-slate-500 mb-1">
            {summary.hardestFacts}
          </div>
          <ul className="flex flex-wrap gap-2">
            {hardestFacts.map((f) => (
              <li
                key={f.equation}
                className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm font-mono"
              >
                {f.equation}
                <span className="text-rose-500 ml-1.5 font-sans text-[0.65rem]">
                  ✕{f.wrong}/{f.attempts}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const SummaryStat: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-xl bg-white border border-slate-200 px-2 py-2 text-center">
    <div className="text-[0.6rem] sm:text-[0.65rem] uppercase tracking-wide text-slate-500 mb-0.5 leading-tight">
      {label}
    </div>
    <div className="text-base sm:text-lg font-black text-slate-900">{value}</div>
  </div>
);
