export type UserRole = "ADMIN" | "EXPERT" | "USER" | "LIBRARIAN";

export interface ThemeConfig {
  primaryColor: string;
  borderRadius: "none" | "md" | "2xl" | "3xl" | "full";
  showPoints: boolean;
  compactMode: boolean;
  siteName: string;
  activeRole: UserRole;
  layoutDensity: "relaxed" | "dense";
  isEditMode: boolean;
  selectedLLMId?: string;
}

export enum AppSection {
  KnowledgeMap = "knowledge_map",
  Community = "community",
  AIAssistant = "ai_assistant",
  KnowledgeAdmin = "knowledge_management", // 知识管理 (Knowledge + Categories)
  IssueAdmin = "issue_management", // 问题管理 (Topics + Questions)
  QAAdmin = "qa_management", // 问答管理
  LLMAdmin = "llm_management", // 大模型管理
}

// 基础分类三维度
export type KnowledgeDomain =
  | "勘探"
  | "开发"
  | "研究"
  | "工程"
  | "测井"
  | "油藏"
  | "其他";
export type KnowledgeCategory =
  | "问答"
  | "交流"
  | "帮助资料"
  | "培训课件"
  | "软件工具";

export interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  source: "AI" | "COMMUNITY" | "UPLOAD";
  software: string;
  domain: KnowledgeDomain;
  category: KnowledgeCategory;
  customCategoryIds: string[]; // 自定义分类 ID
  businessTheme: string; // 业务主题（来自主题交流或 AI 主题）
  author: string;
  createTime: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  syllabus?: string; // 教学大纲 (AI 一键生成)
  format?: "text" | "document" | "link"; // 内容格式
  url?: string; // 外部链接或文档地址
}

export interface CustomCategory {
  id: string;
  name: string;
  parentId: string | null;
}

export interface CommunityTopic {
  id: string;
  title: string;
  description: string;
  creator: string;
  createTime: string;
  status: "OPEN" | "CLOSED" | "PENDING_APPROVAL";
}

export interface CommunityQuestion {
  id: string;
  topicId: string;
  category?: string; // 问题分类
  title: string;
  content: string;
  author: string;
  createTime: string;
  status: "PENDING_APPROVAL" | "OPEN" | "CLOSED";
  rating?: number; // 点评评分
  replies: CommunityReply[];
  isSolved?: boolean;
  bestReplyId?: string;
  closingComment?: string;
  archiveReason?: string;
  type: 'OPEN' | 'PRIVATE';
  recipientId?: string;
  recipientName?: string;
}

export interface CommunityReply {
  id: string;
  questionId: string;
  author: string;
  content: string;
  createTime: string;
  isAccepted?: boolean;
  rating?: number; // 用户评分 (1-10)
  parentId?: string; // 父级回复 ID (用于追加回答/追问)
}

export interface AIQATheme {
  id: string;
  title: string;
  createTime: string;
  status: "OPEN" | "CLOSED";
  prompts: string[]; // 提示词维护
}

export interface AIQAMessage {
  id: string;
  themeId: string;
  role: "user" | "assistant";
  content: string;
  createTime: string;
  isStarred?: boolean;
  tags?: string[];
  category?: string;
  isRecommended?: boolean;
}

export interface Software {
  id: string;
  name: string;
  category: string;
  description: string;
  version: string;
  rating: number;
  users: number;
  tags: string[];
  imageUrl: string;
}

export interface ProjectRepo {
  id: string;
  name: string;
  author: string;
  authorRole: UserRole;
  description: string;
  stars: number;
  forks: number;
  points: number;
  lastUpdate: string;
  language: string;
  type: string;
}

export interface CollabTask {
  id: string;
  title: string;
  initiator: string;
  status: string;
  neededSkills: string[];
  software: string[];
  participants: number;
  maxParticipants: number;
  rewardPoints: number;
  difficulty: string;
  description: string;
}

export type ProblemMode = "TOPIC" | "AI" | "INSTANT";

export interface ProblemItem {
  id: string;
  title: string;
  software: string;
  category: string;
  businessDomain: string;
  problemType: string;
  status: "open" | "resolved";
  author: string;
  time: string;
  replies: number;
  aiScore: number;
  tags: string[];
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  company: string;
  status: "online" | "busy" | "offline";
  specialty: string[];
  solvedCount: number;
  rating: number;
  avatar: string;
}

export interface Message {
  role: "user" | "model";
  text: string;
  senderName?: string;
  avatar?: string;
}

export interface LLMConfig {
  id: string;
  name: string;
  provider: string;
  apiUrl: string;
  apiKey: string;
  accountType: "PERSONAL" | "ADMIN";
  modelName: string;
  status: "ACTIVE" | "INACTIVE";
}
