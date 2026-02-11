import type { GuideSection } from "../types/right-panel";

export const guideSections: GuideSection[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    content:
      "Welcome to EduManage! This dashboard provides a complete overview of your school's operations. Start by exploring the sidebar navigation to access different modules like Students, Teachers, Classes, Attendance, Fees, and Events.",
  },
  {
    id: "managing-students",
    title: "Managing Students",
    content:
      "Navigate to the Students section to view, search, and filter student records. You can see each student's enrollment status, grade, section, and contact details. Use the search bar and filters at the top to quickly find specific students.",
  },
  {
    id: "tracking-attendance",
    title: "Tracking Attendance",
    content:
      "The Attendance module lets you view daily attendance records. Filter by date, grade, or status (present, absent, late, excused) to get detailed insights. The dashboard also shows attendance trends over time via the trend chart.",
  },
  {
    id: "fee-management",
    title: "Fee Management",
    content:
      "Access the Fees section to track all fee records including tuition, transport, library, lab, and exam fees. You can filter by payment status (paid, pending, overdue) and fee type. The dashboard pie chart gives a quick overview of collection status.",
  },
  {
    id: "navigation-tips",
    title: "Navigation Tips",
    content:
      "Use the sidebar to navigate between sections. On desktop, collapse the sidebar with the arrow button at the bottom for more screen space. On mobile, tap the menu icon in the header to open the sidebar. Use the search bar in the header to quickly find what you need.",
  },
];
