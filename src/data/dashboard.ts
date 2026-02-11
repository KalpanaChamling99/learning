import type { DashboardStat, ChartDataPoint } from "../types";

export const dashboardStats: DashboardStat[] = [
  { title: "Total Students", value: 1247, change: 5.2, icon: "GraduationCap" },
  { title: "Total Teachers", value: 84, change: 2.1, icon: "Users" },
  { title: "Total Classes", value: 42, change: 0, icon: "BookOpen" },
  { title: "Revenue", value: "₹52,450", change: 12.5, icon: "IndianRupee" },
];

export const attendanceTrend: ChartDataPoint[] = [
  { name: "Mon", present: 92, absent: 8 },
  { name: "Tue", present: 88, absent: 12 },
  { name: "Wed", present: 95, absent: 5 },
  { name: "Thu", present: 90, absent: 10 },
  { name: "Fri", present: 85, absent: 15 },
];

export const enrollmentByGrade: ChartDataPoint[] = [
  { name: "Grade 8", value: 180 },
  { name: "Grade 9", value: 220 },
  { name: "Grade 10", value: 280 },
  { name: "Grade 11", value: 310 },
  { name: "Grade 12", value: 257 },
];

export const feeCollection: ChartDataPoint[] = [
  { name: "Paid", value: 68 },
  { name: "Pending", value: 22 },
  { name: "Overdue", value: 10 },
];

export const recentActivity = [
  { action: "Fee Payment", detail: "Aarav Adhikari paid ₹25,000 tuition fee", time: "2 hours ago" },
  { action: "New Enrollment", detail: "Rahul Dahal enrolled in Grade 8-A", time: "5 hours ago" },
  { action: "Attendance Alert", detail: "Rohan Gurung absent for 3 consecutive days", time: "1 day ago" },
  { action: "Exam Results", detail: "Grade 10 mid-term results published", time: "2 days ago" },
  { action: "Event Created", detail: "Annual Science Fair scheduled for Feb 20", time: "3 days ago" },
];
