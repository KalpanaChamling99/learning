import { useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import AiChatPanel from "./AiChatPanel";
import UserGuidePanel from "./UserGuidePanel";

export type PanelView = "ai" | "guide" | null;

interface RightPanelProps {
  activeView: PanelView;
  onClose: () => void;
}

export default function RightPanel({ activeView, onClose }: RightPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const open = activeView !== null;

  return (
    <div
      className={`fixed bottom-0 right-0 z-50 flex w-80 flex-col rounded-tl-xl bg-white shadow-xl transition-all duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      } ${expanded ? "top-0 rounded-tl-none" : "h-[400px]"}`}
    >
      {open && (
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 items-center justify-end gap-1 border-b border-gray-200 px-3 py-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              title={expanded ? "Minimize" : "Expand"}
            >
              {expanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={() => { onClose(); setExpanded(false); }}
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            {activeView === "ai" ? <AiChatPanel /> : <UserGuidePanel />}
          </div>
        </div>
      )}
    </div>
  );
}
