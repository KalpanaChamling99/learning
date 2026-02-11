import { useState, useMemo } from "react";
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import { events } from "../data/events";

const eventTypeColors: Record<string, string> = {
  academic: "border-l-blue-500 bg-blue-50",
  sports: "border-l-emerald-500 bg-emerald-50",
  cultural: "border-l-purple-500 bg-purple-50",
  holiday: "border-l-red-500 bg-red-50",
  meeting: "border-l-amber-500 bg-amber-50",
};

const eventBadgeColors: Record<string, string> = {
  academic: "bg-blue-100 text-blue-700",
  sports: "bg-emerald-100 text-emerald-700",
  cultural: "bg-purple-100 text-purple-700",
  holiday: "bg-red-100 text-red-700",
  meeting: "bg-amber-100 text-amber-700",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function MiniCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { year, month, days, eventDates } = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const allDays: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) allDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) allDays.push(i);

    const eDates = new Set(
      events
        .filter((e) => {
          const d = new Date(e.date);
          return d.getFullYear() === y && d.getMonth() === m;
        })
        .map((e) => new Date(e.date).getDate())
    );

    return { year: y, month: m, days: allDays, eventDates: eDates };
  }, [currentDate]);

  const prevMonth = () =>
    setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(year, month + 1, 1));

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          {currentDate.toLocaleDateString("en", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextMonth}
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {DAYS.map((d) => (
          <div key={d} className="py-1 font-semibold text-gray-500">
            {d}
          </div>
        ))}
        {days.map((day, i) => (
          <div
            key={i}
            className={`relative rounded-md py-1.5 text-sm ${
              day === null
                ? ""
                : isCurrentMonth && day === today.getDate()
                  ? "bg-primary-600 font-semibold text-white"
                  : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {day}
            {day !== null && eventDates.has(day) && (
              <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Events() {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="School events and calendar"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {sortedEvents.map((event) => (
            <div
              key={event.id}
              className={`rounded-xl border-l-4 border border-gray-100 p-5 transition-shadow hover:shadow-md ${
                eventTypeColors[event.type] ?? "border-l-gray-400 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-900">
                      {event.title}
                    </h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        eventBadgeColors[event.type] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {event.type}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {event.description}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.date).toLocaleDateString("en", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {event.time !== "00:00" ? event.time : "All Day"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div>
          <MiniCalendar />
        </div>
      </div>
    </div>
  );
}
