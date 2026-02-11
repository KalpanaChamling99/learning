import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";
import { guideSections } from "../../data/guide";

export default function UserGuidePanel() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function toggleSection(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 px-4 py-3">
        <div className="rounded-lg bg-accent-500/10 p-1.5 text-accent-500">
          <BookOpen className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">User Guide</h3>
      </div>

      <div className="flex-1 overflow-y-auto panel-scroll">
        {guideSections.map((section) => {
          const isExpanded = expandedId === section.id;
          return (
            <div key={section.id} className="border-b border-gray-100 last:border-0">
              <button
                onClick={() => toggleSection(section.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                {section.title}
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isExpanded && (
                <div className="px-4 pb-3 text-sm leading-relaxed text-gray-600">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
