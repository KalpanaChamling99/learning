import { useNavigate } from "react-router-dom";
import { Users, MapPin, Clock, User, Plus, Pencil } from "lucide-react";
import PageHeader from "../components/shared/PageHeader";
import { useData } from "../context/DataContext";

const gradeColors: Record<string, string> = {
  "8": "border-l-blue-500",
  "9": "border-l-emerald-500",
  "10": "border-l-purple-500",
  "11": "border-l-amber-500",
  "12": "border-l-rose-500",
};

export default function Classes() {
  const navigate = useNavigate();
  const { classes } = useData();

  return (
    <div>
      <PageHeader
        title="Classes"
        subtitle="View all classes and sections"
        action={
          <button
            onClick={() => navigate("/classes/create")}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Add Class
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className={`rounded-xl border border-gray-100 border-l-4 bg-white p-5 shadow-card transition-shadow hover:shadow-md ${
              gradeColors[cls.grade] ?? "border-l-gray-400"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {cls.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  {cls.id}
                </span>
                <button
                  onClick={() => navigate(`/classes/edit/${cls.id}`)}
                  className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-primary-600"
                  title="Edit class"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2.5 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>{cls.teacherName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span>{cls.studentCount} Students</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{cls.room}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>{cls.schedule}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
