import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<{ className?: string }>;
}

export default function StatsCard({ title, value, change, icon: Icon }: StatsCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-primary-100 p-3 text-primary-600">
          <Icon className="h-6 w-6" />
        </div>
        {change !== 0 && (
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              isPositive ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
}
