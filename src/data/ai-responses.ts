const responses: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["hello", "hi", "hey"],
    reply: "Hello! I'm EduManage AI. I can help you navigate the dashboard, understand student data, or answer questions about school management. What would you like to know?",
  },
  {
    keywords: ["student", "enroll"],
    reply: "You can manage students from the Students page. It shows enrollment status, grades, and contact info. Use the filters to narrow your search. Would you like to know more?",
  },
  {
    keywords: ["attendance"],
    reply: "The Attendance module tracks daily records for all students. You can filter by date, grade, or status. Check the Dashboard for attendance trend charts showing patterns over time.",
  },
  {
    keywords: ["fee", "payment", "money"],
    reply: "Head to the Fees section to see all payment records. You can filter by status (paid, pending, overdue) and type (tuition, transport, etc.). The Dashboard pie chart shows collection progress at a glance.",
  },
  {
    keywords: ["teacher", "staff"],
    reply: "The Teachers section lists all staff with their department, subject, qualifications, and contact details. You can filter by department or status to find specific teachers.",
  },
  {
    keywords: ["class", "section", "schedule"],
    reply: "Visit the Classes page to view all class sections, their assigned teachers, student counts, rooms, and schedules.",
  },
  {
    keywords: ["event", "calendar"],
    reply: "The Events page shows all school events categorized by type (academic, sports, cultural, holiday, meeting). The Dashboard also highlights upcoming events.",
  },
  {
    keywords: ["help", "guide", "how"],
    reply: "Check out the User Guide below this chat for detailed help on each section. You can also ask me specific questions about any module!",
  },
];

const fallbackReply =
  "I'm not sure about that specific topic. Try asking about students, attendance, fees, teachers, classes, or events. You can also check the User Guide below for detailed information.";

export function getMockResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  const match = responses.find((r) =>
    r.keywords.some((kw) => lower.includes(kw))
  );
  return match?.reply ?? fallbackReply;
}
