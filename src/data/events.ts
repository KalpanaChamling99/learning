import type { SchoolEvent } from "../types";

export const events: SchoolEvent[] = [
  { id: "EVT001", title: "Annual Science Fair", description: "Students showcase their science projects and innovations", date: "2026-02-20", time: "09:00", type: "academic", location: "Main Auditorium" },
  { id: "EVT002", title: "Inter-School Cricket Tournament", description: "Cricket matches between regional schools", date: "2026-02-25", time: "08:00", type: "sports", location: "Sports Ground" },
  { id: "EVT003", title: "Parent-Teacher Meeting", description: "Quarterly review of student progress with parents", date: "2026-03-01", time: "10:00", type: "meeting", location: "Conference Hall" },
  { id: "EVT004", title: "Cultural Festival - Rang Utsav", description: "Music, dance, and drama performances by students", date: "2026-03-10", time: "14:00", type: "cultural", location: "Main Auditorium" },
  { id: "EVT005", title: "Holi Holiday", description: "School closed for Holi celebration", date: "2026-03-14", time: "00:00", type: "holiday", location: "N/A" },
  { id: "EVT006", title: "Math Olympiad Preparation", description: "Special coaching sessions for Math Olympiad participants", date: "2026-03-18", time: "15:00", type: "academic", location: "Room 301" },
  { id: "EVT007", title: "Annual Sports Day", description: "Track and field events, team sports, and awards ceremony", date: "2026-03-25", time: "07:30", type: "sports", location: "Sports Ground" },
  { id: "EVT008", title: "Staff Development Workshop", description: "Professional development training for teaching staff", date: "2026-02-15", time: "09:00", type: "meeting", location: "Conference Hall" },
  { id: "EVT009", title: "Art Exhibition", description: "Display of student artwork and creative projects", date: "2026-04-05", time: "10:00", type: "cultural", location: "Art Gallery" },
  { id: "EVT010", title: "Final Exam Begins", description: "Annual final examinations for all grades", date: "2026-04-15", time: "09:00", type: "academic", location: "All Classrooms" },
];
