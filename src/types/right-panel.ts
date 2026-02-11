export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface GuideSection {
  id: string;
  title: string;
  content: string;
}
