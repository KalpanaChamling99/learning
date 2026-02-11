import {
  GraduationCap,
  Users,
  BookOpen,
  IndianRupee,
  Clock,
  Calendar,
  MapPin,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import StatsCard from "../components/shared/StatsCard";
import {
  dashboardStats,
  attendanceTrend,
  enrollmentByGrade,
  feeCollection,
  recentActivity,
} from "../data/dashboard";
import { events } from "../data/events";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  GraduationCap,
  Users,
  BookOpen,
  IndianRupee,
};

const PIE_COLORS = ["#10b981", "#f59e0b", "#ef4444"];

const eventTypeColors: Record<string, string> = {
  academic: "bg-blue-100 text-blue-700",
  sports: "bg-emerald-100 text-emerald-700",
  cultural: "bg-purple-100 text-purple-700",
  holiday: "bg-red-100 text-red-700",
  meeting: "bg-amber-100 text-amber-700",
};

export default function Dashboard() {
  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening at your school.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={iconMap[stat.icon] ?? BookOpen}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Attendance Trend */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Attendance Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="present"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="absent"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Enrollment by Grade */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Enrollment by Grade
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={enrollmentByGrade}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fee Collection */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Fee Collection
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={feeCollection}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {feeCollection.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-3 border-b border-gray-50 pb-4 last:border-0 last:pb-0"
              >
                <div className="mt-0.5 rounded-full bg-primary-100 p-2 text-primary-600">
                  <Clock className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500">{activity.detail}</p>
                  <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Upcoming Events
          </h3>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-4 rounded-lg border border-gray-100 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex flex-col items-center rounded-lg bg-primary-50 px-3 py-2 text-center">
                  <span className="text-xs font-medium text-primary-600">
                    {new Date(event.date).toLocaleDateString("en", {
                      month: "short",
                    })}
                  </span>
                  <span className="text-xl font-bold text-primary-700">
                    {new Date(event.date).getDate()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {event.title}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        eventTypeColors[event.type] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {event.type}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {event.time !== "00:00" ? event.time : "All Day"}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
