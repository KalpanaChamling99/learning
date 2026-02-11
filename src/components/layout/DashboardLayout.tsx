import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Bot, BookOpen } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import RightPanel from "../right-panel/RightPanel";
import type { PanelView } from "../right-panel/RightPanel";

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelView>(null);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setMobileOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-6">
            <Outlet />
          </main>
          <RightPanel
            activeView={activePanel}
            onClose={() => setActivePanel(null)}
          />
        </div>
      </div>

      {/* Floating action buttons */}
      {activePanel === null && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
          <button
            onClick={() => setActivePanel("ai")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-all hover:bg-primary-600 hover:shadow-xl hover:scale-110"
            title="AI Assistant"
          >
            <Bot className="h-5 w-5" />
          </button>
          <button
            onClick={() => setActivePanel("guide")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-500 text-white shadow-lg transition-all hover:bg-accent-600 hover:shadow-xl hover:scale-110"
            title="User Guide"
          >
            <BookOpen className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
