import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronsLeft, ChevronsRight } from "lucide-react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

export type PaginationVariant = "classic" | "minimal" | "pill" | "centered";

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  defaultPageSize?: number;
  paginationVariant?: PaginationVariant;
}

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

function getVisiblePages(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);

  const pages: (number | "ellipsis")[] = [0];

  if (current > 2) pages.push("ellipsis");

  const rangeStart = Math.max(1, current - 1);
  const rangeEnd = Math.min(total - 2, current + 1);
  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

  if (current < total - 3) pages.push("ellipsis");

  pages.push(total - 1);
  return pages;
}

/* ── Rows-per-page selector (shared across variants) ── */
function PerPageSelect({
  perPage,
  onChange,
}: {
  perPage: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="relative">
      <select
        value={perPage}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-8 cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-0 pl-2.5 pr-7 text-xs font-medium text-gray-700 shadow-sm outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VARIANT 1 — Classic
   Bordered button group with first/last, page numbers,
   ellipsis, and a contained pill look.
   ═══════════════════════════════════════════════════════ */
function PaginationClassic({
  safePage, totalPages, start, end, total, perPage, setPage, setPerPage, visiblePages,
}: PaginationSharedProps) {
  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 bg-gray-50/50 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-2.5">
        <span className="text-xs font-medium text-gray-500">Show</span>
        <PerPageSelect perPage={perPage} onChange={(v) => { setPerPage(v); setPage(0); }} />
        <span className="text-xs text-gray-500">
          of <span className="font-medium text-gray-700">{total}</span> results
        </span>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-xs tabular-nums text-gray-500">
          <span className="font-semibold text-gray-700">{start}</span>&ndash;<span className="font-semibold text-gray-700">{end}</span>
        </p>

        <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white p-0.5 shadow-sm">
          <button onClick={() => setPage(0)} disabled={safePage === 0} title="First page"
            className="rounded-md p-1.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 disabled:pointer-events-none disabled:opacity-30">
            <ChevronsLeft className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setPage(Math.max(0, safePage - 1))} disabled={safePage === 0} title="Previous page"
            className="rounded-md p-1.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 disabled:pointer-events-none disabled:opacity-30">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>

          <div className="flex items-center">
            {visiblePages.map((item, idx) =>
              item === "ellipsis" ? (
                <span key={`ellipsis-${idx}`} className="flex h-8 w-8 items-center justify-center text-xs text-gray-400">...</span>
              ) : (
                <button key={item} onClick={() => setPage(item)}
                  className={`h-8 min-w-[32px] rounded-md px-1.5 text-xs font-semibold transition-all ${
                    item === safePage ? "bg-primary-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}>
                  {item + 1}
                </button>
              )
            )}
          </div>

          <button onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))} disabled={safePage === totalPages - 1} title="Next page"
            className="rounded-md p-1.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 disabled:pointer-events-none disabled:opacity-30">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setPage(totalPages - 1)} disabled={safePage === totalPages - 1} title="Last page"
            className="rounded-md p-1.5 text-gray-400 transition-all hover:bg-gray-100 hover:text-gray-600 disabled:pointer-events-none disabled:opacity-30">
            <ChevronsRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VARIANT 2 — Minimal
   Clean text-based prev/next with a slim progress bar.
   No page numbers — just Previous / Next text buttons.
   ═══════════════════════════════════════════════════════ */
function PaginationMinimal({
  safePage, totalPages, start, end, total, perPage, setPage, setPerPage,
}: PaginationSharedProps) {
  const progress = total > 0 ? (end / total) * 100 : 0;

  return (
    <div className="border-t border-gray-100">
      <div className="h-0.5 bg-gray-100">
        <div className="h-full rounded-r-full bg-primary-500/60 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <PerPageSelect perPage={perPage} onChange={(v) => { setPerPage(v); setPage(0); }} />
          <span className="text-xs text-gray-500">per page</span>
        </div>

        <p className="text-xs tabular-nums text-gray-500">
          <span className="font-medium text-gray-700">{start}&ndash;{end}</span> of <span className="font-medium text-gray-700">{total}</span>
        </p>

        <div className="flex items-center gap-1">
          <button onClick={() => setPage(Math.max(0, safePage - 1))} disabled={safePage === 0}
            className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40">
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <span className="text-xs tabular-nums font-medium text-gray-700">
            {safePage + 1} / {totalPages}
          </span>
          <button onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))} disabled={safePage === totalPages - 1}
            className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 transition-all hover:bg-gray-100 hover:text-gray-700 disabled:pointer-events-none disabled:opacity-40">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VARIANT 3 — Pill
   Rounded pill-shaped page numbers with a colorful
   active indicator, floating style.
   ═══════════════════════════════════════════════════════ */
function PaginationPill({
  safePage, totalPages, start, end, total, perPage, setPage, setPerPage, visiblePages,
}: PaginationSharedProps) {
  return (
    <div className="flex flex-col gap-4 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex items-center gap-2.5">
        <PerPageSelect perPage={perPage} onChange={(v) => { setPerPage(v); setPage(0); }} />
        <span className="text-xs text-gray-400">
          Showing <span className="font-semibold text-gray-600">{start}&ndash;{end}</span> of <span className="font-semibold text-gray-600">{total}</span>
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <button onClick={() => setPage(Math.max(0, safePage - 1))} disabled={safePage === 0}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-all hover:bg-primary-50 hover:text-primary-600 disabled:pointer-events-none disabled:opacity-30">
          <ChevronLeft className="h-4 w-4" />
        </button>

        {visiblePages.map((item, idx) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${idx}`} className="flex h-9 w-5 items-center justify-center text-xs tracking-widest text-gray-300">...</span>
          ) : (
            <button key={item} onClick={() => setPage(item)}
              className={`h-9 min-w-[36px] rounded-full px-2 text-sm font-semibold transition-all ${
                item === safePage
                  ? "bg-primary-600 text-white shadow-md shadow-primary-600/30"
                  : "text-gray-500 hover:bg-primary-50 hover:text-primary-700"
              }`}>
              {item + 1}
            </button>
          )
        )}

        <button onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))} disabled={safePage === totalPages - 1}
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition-all hover:bg-primary-50 hover:text-primary-600 disabled:pointer-events-none disabled:opacity-30">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VARIANT 4 — Centered
   Two-row layout: info on top, centered navigation
   below with outlined page numbers.
   ═══════════════════════════════════════════════════════ */
function PaginationCentered({
  safePage, totalPages, start, end, total, perPage, setPage, setPerPage, visiblePages,
}: PaginationSharedProps) {
  return (
    <div className="border-t border-gray-100">
      <div className="flex items-center justify-between px-4 py-2.5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-gray-400">Rows</span>
          <PerPageSelect perPage={perPage} onChange={(v) => { setPerPage(v); setPage(0); }} />
        </div>
        <p className="text-xs tabular-nums text-gray-400">
          <span className="font-medium text-gray-600">{start}&ndash;{end}</span> of <span className="font-medium text-gray-600">{total}</span> results
        </p>
      </div>

      <div className="flex items-center justify-center gap-1 border-t border-gray-50 px-4 py-3 sm:px-6">
        <button onClick={() => setPage(0)} disabled={safePage === 0} title="First page"
          className="mr-1 flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-gray-400 transition-all hover:border-gray-200 hover:bg-white hover:text-gray-600 disabled:pointer-events-none disabled:opacity-30">
          <ChevronsLeft className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => setPage(Math.max(0, safePage - 1))} disabled={safePage === 0} title="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-gray-400 transition-all hover:border-gray-200 hover:bg-white hover:text-gray-600 disabled:pointer-events-none disabled:opacity-30">
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {visiblePages.map((item, idx) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${idx}`} className="flex h-8 w-8 items-center justify-center text-xs text-gray-300">...</span>
          ) : (
            <button key={item} onClick={() => setPage(item)}
              className={`h-8 min-w-[32px] rounded-lg border px-2 text-xs font-semibold transition-all ${
                item === safePage
                  ? "border-primary-600 bg-primary-600 text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:border-primary-300 hover:text-primary-600"
              }`}>
              {item + 1}
            </button>
          )
        )}

        <button onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))} disabled={safePage === totalPages - 1} title="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-gray-400 transition-all hover:border-gray-200 hover:bg-white hover:text-gray-600 disabled:pointer-events-none disabled:opacity-30">
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => setPage(totalPages - 1)} disabled={safePage === totalPages - 1} title="Last page"
          className="ml-1 flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-gray-400 transition-all hover:border-gray-200 hover:bg-white hover:text-gray-600 disabled:pointer-events-none disabled:opacity-30">
          <ChevronsRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ── Shared pagination props ── */
interface PaginationSharedProps {
  safePage: number;
  totalPages: number;
  start: number;
  end: number;
  total: number;
  perPage: number;
  setPage: (p: number) => void;
  setPerPage: (p: number) => void;
  visiblePages: (number | "ellipsis")[];
}

const VARIANT_MAP: Record<PaginationVariant, React.ComponentType<PaginationSharedProps>> = {
  classic: PaginationClassic,
  minimal: PaginationMinimal,
  pill: PaginationPill,
  centered: PaginationCentered,
};

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  defaultPageSize = 10,
  paginationVariant = "classic",
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(defaultPageSize);

  const totalPages = Math.max(1, Math.ceil(data.length / perPage));
  const safePage = Math.min(page, totalPages - 1);
  const paged = data.slice(safePage * perPage, safePage * perPage + perPage);
  const start = data.length > 0 ? safePage * perPage + 1 : 0;
  const end = Math.min(safePage * perPage + perPage, data.length);
  const visiblePages = useMemo(() => getVisiblePages(safePage, totalPages), [safePage, totalPages]);

  if (safePage !== page) setPage(safePage);

  const PaginationComponent = VARIANT_MAP[paginationVariant];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card">
      <div className="group/table overflow-x-auto">
        <table className="w-full border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((col, i) => (
                <th
                  key={col.key}
                  className={`border-b border-gray-200 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 ${
                    i === 0
                      ? "md:sticky md:left-0 md:z-10 bg-gray-50 md:after:absolute md:after:right-0 md:after:top-0 md:after:h-full md:after:w-px md:after:bg-gray-200"
                      : ""
                  } ${col.className ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="group transition-colors hover:bg-gray-50"
              >
                {columns.map((col, i) => (
                  <td
                    key={col.key}
                    className={`border-b border-b-gray-100 border-r border-r-transparent px-6 py-4 text-sm text-gray-700 transition-colors group-hover:border-b-gray-200 group-hover:border-r-gray-200 last:border-r-transparent ${
                      i === 0
                        ? "relative md:sticky md:left-0 md:z-10 bg-white group-hover:bg-gray-50 sticky-shadow"
                        : ""
                    } ${col.className ?? ""}`}
                  >
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length > 0 && (
        <PaginationComponent
          safePage={safePage}
          totalPages={totalPages}
          start={start}
          end={end}
          total={data.length}
          perPage={perPage}
          setPage={setPage}
          setPerPage={setPerPage}
          visiblePages={visiblePages}
        />
      )}
    </div>
  );
}
