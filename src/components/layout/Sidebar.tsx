import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  ClipboardCheck,
  IndianRupee,
  Calendar,
  ChevronLeft,
  ChevronRight,
  School,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Students", path: "/students", icon: GraduationCap },
  { label: "Teachers", path: "/teachers", icon: Users },
  { label: "Classes", path: "/classes", icon: BookOpen },
  { label: "Attendance", path: "/attendance", icon: ClipboardCheck },
  { label: "Fees", path: "/fees", icon: IndianRupee },
  { label: "Events", path: "/events", icon: Calendar },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, mobileOpen, onToggle, onMobileClose }: SidebarProps) {
  const [tooltip, setTooltip] = useState<{ label: string; top: number; left: number } | null>(null);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-20" : "lg:w-64"} w-64`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-600">
              <School className="h-6 w-6" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <h1 className="text-lg font-bold leading-tight">EduManage</h1>
                <p className="text-xs text-gray-400">School Management</p>
              </div>
            )}
          </div>
          <button
            onClick={onMobileClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-sidebar-hover hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 sidebar-scroll" onScroll={() => setTooltip(null)}>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li
                key={item.path}
                onMouseEnter={(e) => {
                  if (collapsed && !mobileOpen) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({ label: item.label, top: rect.top + rect.height / 2, left: rect.right });
                  }
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    `flex items-center rounded-lg text-sm font-medium transition-colors ${
                      collapsed && !mobileOpen
                        ? "justify-center p-2.5"
                        : "gap-3 px-3 py-2.5"
                    } ${
                      isActive
                        ? "bg-sidebar-active text-white"
                        : "text-gray-300 hover:bg-sidebar-hover hover:text-white"
                    }`
                  }
                >
                  <div className={`flex shrink-0 items-center justify-center ${collapsed && !mobileOpen ? "h-9 w-9" : ""}`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  {(!collapsed || mobileOpen) && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden border-t border-white/10 p-3 lg:block">
          <button
            onClick={onToggle}
            className="flex w-full items-center justify-center rounded-lg p-2 text-gray-400 transition-colors hover:bg-sidebar-hover hover:text-white"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
      </aside>

      {tooltip && collapsed && !mobileOpen && (
        <div
          className="pointer-events-none fixed z-[60] ml-2 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg"
          style={{ top: tooltip.top, left: tooltip.left, transform: 'translateY(-50%)' }}
        >
          {tooltip.label}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
        </div>
      )}
    </>
  );
}
