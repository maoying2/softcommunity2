import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  FolderTree,
  Filter,
  Clock,
  MoreVertical,
  MessageCircle,
  Library,
  BookOpen,
  AlertCircle,
  Plus,
  Trash2,
  Edit3,
  Settings2,
  Share2,
  Layers,
  HelpCircle,
  Eye,
  Calendar,
  User,
  Hash,
  ChevronRight,
  LayoutTemplate,
  Star,
  Cpu,
  Cloud,
  Key,
  Server,
  Globe,
  Activity,
} from "lucide-react";
import { AppSection } from "../types";
import AddKnowledgeModal from "./AddKnowledgeModal";

interface AdminDashboardProps {
  activeSection: AppSection;
}

interface LLMConfig {
  id: string;
  name: string;
  provider: string;
  apiUrl: string;
  apiKey: string;
  accountType: "ADMIN" | "PERSONAL";
  modelName: string;
  status: "ACTIVE" | "INACTIVE";
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeSection }) => {
  // Sub-tabs for Knowledge Management
  const [knowledgeSubTab, setKnowledgeSubTab] = useState<
    "items" | "categories"
  >("items");

  // Sub-tabs for Issues Management
  const [issueSubTab, setIssueSubTab] = useState<"governance" | "search">(
    "governance",
  );

  // Sub-tabs for QA Management
  const [qaSubTab, setQaSubTab] = useState<
    "all" | "unreviewed" | "recommended"
  >("all");

  // Add Knowledge Modal State
  const [showAddKnowledge, setShowAddKnowledge] = useState(false);

  // Knowledge Management State
  const [searchKnowledge, setSearchKnowledge] = useState("");

  // Questions Advanced Filter State
  const [questionFilters, setQuestionFilters] = useState({
    topic: "全部",
    status: "全部",
    creator: "",
    keyword: "",
    dateRange: "全部",
  });

  const [topics, setTopics] = useState([
    {
      id: "1",
      title: "Petrel 自动化脚本开发",
      creator: "李工程师",
      date: "2024-04-30",
      status: "PENDING",
      questionsCount: 5,
    },
    {
      id: "2",
      title: "OSDU 平台对接标准",
      creator: "王专家",
      date: "2024-04-29",
      status: "APPROVED",
      questionsCount: 12,
    },
    {
      id: "3",
      title: "全域油藏模拟专题",
      creator: "陈主任",
      date: "2024-04-28",
      status: "APPROVED",
      questionsCount: 45,
    },
  ]);

  const [categories, setCategories] = useState([
    {
      id: "1",
      name: "软件技术栈",
      children: [
        { id: "1-1", name: "Python插件" },
        { id: "1-2", name: "C++内核" },
      ],
    },
    {
      id: "2",
      name: "地质学科",
      children: [
        { id: "2-1", name: "构造建模" },
        { id: "2-2", name: "沉积相分析" },
      ],
    },
  ]);

  // LLM Management State
  const [llms, setLlms] = useState<LLMConfig[]>([
    {
      id: "1",
      name: "石化内部 Gemini Pro",
      provider: "Google",
      apiUrl: "https://generativelanguage.googleapis.com",
      apiKey: "AIza...",
      accountType: "ADMIN",
      modelName: "gemini-1.5-pro",
      status: "ACTIVE",
    },
    {
      id: "2",
      name: "外部合作 GPT-4o",
      provider: "OpenAI",
      apiUrl: "https://api.openai.com/v1",
      apiKey: "sk-...",
      accountType: "ADMIN",
      modelName: "gpt-4o",
      status: "ACTIVE",
    },
    {
      id: "3",
      name: "个人验证 Claude 3.5",
      provider: "Anthropic",
      apiUrl: "https://api.anthropic.com",
      apiKey: "ant-...",
      accountType: "PERSONAL",
      modelName: "claude-3-5-sonnet",
      status: "INACTIVE",
    },
  ]);
  const [showAddLLM, setShowAddLLM] = useState(false);
  const [editingLLM, setEditingLLM] = useState<LLMConfig | null>(null);

  const handleUpdateTopicStatus = (id: string, status: string) => {
    setTopics(topics.map((t) => (t.id === id ? { ...t, status } : t)));
  };

  const handleDeleteTopic = (id: string) => {
    setTopics(topics.filter((t) => t.id !== id));
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-700 pb-20">
      {/* Header Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            <div
              className={`p-4 rounded-2xl shadow-lg ${
                activeSection === AppSection.KnowledgeAdmin
                  ? "bg-emerald-600 shadow-emerald-600/20"
                  : activeSection === AppSection.IssueAdmin
                    ? "bg-blue-600 shadow-blue-600/20"
                    : activeSection === AppSection.LLMAdmin
                      ? "bg-purple-600 shadow-purple-600/20"
                      : "bg-indigo-600 shadow-indigo-600/20"
              }`}
            >
              {activeSection === AppSection.KnowledgeAdmin ? (
                <BookOpen className="w-8 h-8 text-white" />
              ) : activeSection === AppSection.LLMAdmin ? (
                <Cpu className="w-8 h-8 text-white" />
              ) : (
                <Layers className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                {activeSection === AppSection.KnowledgeAdmin
                  ? "知识云端管理后台"
                  : activeSection === AppSection.IssueAdmin
                    ? "问题与交流治理后台"
                    : activeSection === AppSection.LLMAdmin
                      ? "大模型服务调度系统"
                      : "智能问答对话审计后台"}
              </h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 italic">
                {activeSection === AppSection.KnowledgeAdmin
                  ? "Integrate Knowledge & Categories"
                  : activeSection === AppSection.IssueAdmin
                    ? "Refined Forum Topic Management"
                    : activeSection === AppSection.LLMAdmin
                      ? "Multi-LLM Infrastructure Management"
                      : "AI Conversation Management & Quality Control"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
              {activeSection === AppSection.KnowledgeAdmin ? (
                <>
                  <button
                    onClick={() => setKnowledgeSubTab("items")}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${knowledgeSubTab === "items" ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    知识库项
                  </button>
                  <button
                    onClick={() => setKnowledgeSubTab("categories")}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${knowledgeSubTab === "categories" ? "bg-white shadow-sm text-emerald-600" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    分类架构
                  </button>
                </>
              ) : activeSection === AppSection.IssueAdmin ? (
                <>
                  <button
                    onClick={() => setIssueSubTab("governance")}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${issueSubTab === "governance" ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    治理概览
                  </button>
                  <button
                    onClick={() => setIssueSubTab("search")}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${issueSubTab === "search" ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    高级检索
                  </button>
                </>
              ) : activeSection === AppSection.LLMAdmin ? (
                <>
                  <button className="px-6 py-2 rounded-xl text-[10px] font-black uppercase bg-white shadow-sm text-purple-600">
                    大模型配置
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setQaSubTab("all")}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${qaSubTab === "all" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    全部问答
                  </button>
                  <button
                    onClick={() => setQaSubTab("unreviewed")}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${qaSubTab === "unreviewed" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    待审归档
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {activeSection === AppSection.KnowledgeAdmin ? (
        knowledgeSubTab === "categories" ? (
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden p-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-black text-slate-800">
                  全域分类架构维护
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                  Hierarchical Category Management
                </p>
              </div>
              <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20">
                添加顶级分类
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-emerald-200 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-emerald-600">
                        <FolderTree className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-black text-slate-800">
                        {cat.name}
                      </h4>
                    </div>
                    <Settings2 className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 cursor-pointer" />
                  </div>
                  <div className="space-y-2">
                    {cat.children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-transparent hover:border-emerald-100 transition-all group/item"
                      >
                        <span className="text-[11px] font-bold text-slate-600">
                          {child.name}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <Edit3 className="w-3.5 h-3.5 text-slate-300 hover:text-emerald-600 cursor-pointer" />
                          <Trash2 className="w-3.5 h-3.5 text-slate-300 hover:text-red-500 cursor-pointer" />
                        </div>
                      </div>
                    ))}
                    <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white hover:border-emerald-200 hover:text-emerald-600 transition-all flex items-center justify-center gap-2 mt-2">
                      <Plus className="w-3.5 h-3.5" /> 增加子类
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left: Simple Tree Category Navigation */}
            <div className="w-full lg:w-72 shrink-0 bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-emerald-600" />{" "}
                  分类导航维护
                </h3>
                <Plus className="w-4 h-4 text-slate-300 hover:text-emerald-600 cursor-pointer" />
              </div>
              <div className="p-4 space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex items-center justify-between p-2.5 hover:bg-slate-50 rounded-xl group cursor-pointer transition-colors">
                      <span className="text-[11px] font-bold text-slate-600">
                        {cat.name}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-600" />
                    </div>
                    <div className="pl-6 space-y-1">
                      {cat.children.map((child) => (
                        <div
                          key={child.id}
                          className="p-2 text-[10px] font-medium text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer transition-all"
                        >
                          {child.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Knowledge Items List */}
            <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input
                    type="text"
                    placeholder="搜索知识项标题、软件、内容..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 text-xs font-bold rounded-2xl outline-none border border-transparent focus:border-emerald-200 focus:bg-white transition-all shadow-inner shadow-slate-200/50"
                  />
                </div>
                <button
                  onClick={() => setShowAddKnowledge(true)}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> 录入新知识
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-slate-800">
                            勘探业务流程标准化文档 V1.{i}.0
                          </h4>
                          {i % 3 === 0 && (
                            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-600 text-[8px] font-black rounded uppercase">
                              待审核
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                          领域: 勘探核心 · 软件: Petrel · 创建人: 张工{" "}
                          {i % 3 === 0 ? "(用户上传)" : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {i % 3 === 0 ? (
                        <>
                          <button className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/10">
                            <CheckCircle2 className="w-3.5 h-3.5" /> 审核通过
                          </button>
                          <button className="flex items-center gap-1.5 px-4 py-2 bg-white border border-red-100 text-red-500 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-50 transition-all">
                            <XCircle className="w-3.5 h-3.5" /> 驳回
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="p-3 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      ) : activeSection === AppSection.IssueAdmin ? (
        <div className="space-y-6">
          {issueSubTab === "governance" ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />{" "}
                  主题审核与全生命周期
                </h3>
                <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
                  新建业务主题
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-8 flex flex-col md:flex-row items-center justify-between hover:bg-slate-50/50 transition-all group"
                  >
                    <div className="flex items-center gap-6 flex-1">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${topic.status === "PENDING" ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-600"}`}
                      >
                        <Hash className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-800">
                          {topic.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            发起人: {topic.creator}
                          </span>
                          <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            包含问题: {topic.questionsCount}
                          </span>
                          <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${topic.status === "PENDING" ? "bg-orange-100 text-orange-600" : "bg-emerald-100 text-emerald-600"}`}
                          >
                            {topic.status === "PENDING" ? "待审核" : "已发布"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4 md:mt-0">
                      {topic.status === "PENDING" ? (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateTopicStatus(topic.id, "APPROVED")
                            }
                            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-tight shadow-lg shadow-emerald-600/20"
                          >
                            <CheckCircle2 className="w-4 h-4" /> 审核通过
                          </button>
                          <button
                            onClick={() => handleDeleteTopic(topic.id)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-red-500 rounded-xl text-[10px] font-black uppercase tracking-tight border border-red-100 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4" /> 拒绝驳回
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateTopicStatus(topic.id, "CLOSED")
                            }
                            className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase hover:bg-slate-200 transition-all"
                          >
                            关闭主题
                          </button>
                          <button
                            onClick={() => handleDeleteTopic(topic.id)}
                            className="p-3 bg-slate-50 text-red-500 rounded-xl hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Questions Advanced Filtering Admin Interface */
            <div className="space-y-6">
              {/* Advanced Filter Bar */}
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    所属业务主题
                  </label>
                  <select
                    value={questionFilters.topic}
                    onChange={(e) =>
                      setQuestionFilters({
                        ...questionFilters,
                        topic: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border-none rounded-xl text-[10px] font-bold p-2.5 outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
                  >
                    <option>全部</option>
                    {topics.map((t) => (
                      <option key={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    当前状态
                  </label>
                  <select
                    value={questionFilters.status}
                    onChange={(e) =>
                      setQuestionFilters({
                        ...questionFilters,
                        status: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border-none rounded-xl text-[10px] font-bold p-2.5 outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
                  >
                    <option>全部</option>
                    <option>待审核</option>
                    <option>开放中</option>
                    <option>已结题</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    创建人
                  </label>
                  <input
                    type="text"
                    placeholder="工号或姓名"
                    value={questionFilters.creator}
                    onChange={(e) =>
                      setQuestionFilters({
                        ...questionFilters,
                        creator: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border-none rounded-xl text-[10px] font-bold p-2.5 outline-none focus:ring-2 focus:ring-blue-500/10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    时间维度
                  </label>
                  <select
                    value={questionFilters.dateRange}
                    onChange={(e) =>
                      setQuestionFilters({
                        ...questionFilters,
                        dateRange: e.target.value,
                      })
                    }
                    className="w-full bg-slate-50 border-none rounded-xl text-[10px] font-bold p-2.5 outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
                  >
                    <option>全部</option>
                    <option>最近三天</option>
                    <option>本周</option>
                    <option>本月</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    关键词搜索
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                    <input
                      type="text"
                      placeholder="问题摘要检索"
                      value={questionFilters.keyword}
                      onChange={(e) =>
                        setQuestionFilters({
                          ...questionFilters,
                          keyword: e.target.value,
                        })
                      }
                      className="w-full pl-9 bg-slate-50 border-none rounded-xl text-[10px] font-bold p-2.5 outline-none focus:ring-2 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              </div>

              {/* Questions Table-like List */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-50">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="p-6 flex flex-col sm:flex-row items-center justify-between hover:bg-slate-50/30 transition-all"
                    >
                      <div className="flex items-center gap-5 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex flex-col items-center justify-center shrink-0">
                          <span className="text-[8px] font-black text-slate-400 uppercase">
                            回复
                          </span>
                          <span className="text-sm font-black text-slate-700">
                            {i * 2}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-black text-slate-800 truncate mb-1">
                            关于 Petrel 模型导出至 Eclipse
                            时坐标系偏移的参数校准讨论
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                              <LayoutTemplate className="w-3 h-3 text-blue-500" />{" "}
                              {topics[i % 3]?.title}
                            </span>
                            <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                              <User className="w-3 h-3 text-slate-300" />{" "}
                              User_00{i}
                            </span>
                            <span className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
                              <Calendar className="w-3 h-3 text-slate-300" />{" "}
                              2024-04-30
                            </span>
                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded uppercase border border-emerald-100">
                              开放中
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4 sm:mt-0">
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase hover:bg-blue-600 transition-all font-sans">
                          <Eye className="w-3.5 h-3.5" /> 查阅详情
                        </button>
                        <button
                          className="p-2.5 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all"
                          title="置顶或高亮"
                        >
                          <Settings2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="删除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    显示 1-10 共 156 个问题
                  </span>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 disabled:opacity-50"
                      disabled
                    >
                      上一页
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600">
                      下一页
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : activeSection === AppSection.LLMAdmin ? (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
           <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                 <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                   <Cpu className="w-5 h-5 text-purple-600" /> 多模型集群治理
                 </h3>
                 <button 
                   onClick={() => { setEditingLLM(null); setShowAddLLM(true); }}
                   className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 transition-all shadow-lg shadow-purple-600/20 flex items-center gap-2"
                 >
                   <Plus className="w-4 h-4" /> 注册大模型服务
                 </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 gap-6">
                 {llms.map(llm => (
                    <div key={llm.id} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4">
                          <div className={`w-2 h-2 rounded-full ${llm.status === 'ACTIVE' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                       </div>
                       
                       <div className="flex items-center gap-4 mb-6">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${llm.provider === 'Google' ? 'bg-blue-50 text-blue-600' : 'bg-white shadow-sm text-slate-600'}`}>
                             {llm.provider === 'Google' ? <Globe className="w-6 h-6" /> : <Server className="w-6 h-6" />}
                          </div>
                          <div>
                             <h4 className="text-sm font-black text-slate-800">{llm.name}</h4>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{llm.provider} · {llm.modelName}</span>
                          </div>
                       </div>

                       <div className="space-y-3 mb-6">
                          <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100">
                             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                <Key className="w-3 h-3" /> API Key
                             </div>
                             <span className="text-[10px] font-mono text-slate-400">••••••••••••••••</span>
                          </div>
                          <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100">
                             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                <Globe className="w-3 h-3" /> Endpoint
                             </div>
                             <span className="text-[9px] font-bold text-slate-400 truncate max-w-[120px]">{llm.apiUrl.replace('https://', '')}</span>
                          </div>
                          <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-100">
                             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                <User className="w-3 h-3" /> Type
                             </div>
                             <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${llm.accountType === 'ADMIN' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                                {llm.accountType === 'ADMIN' ? '管理账号' : '个人账号'}
                             </span>
                          </div>
                       </div>

                       <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setEditingLLM(llm); setShowAddLLM(true); }}
                            className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-purple-200 hover:text-purple-600 transition-all"
                          >
                             编辑配置
                          </button>
                          <button 
                            onClick={() => setLlms(llms.filter(l => l.id !== llm.id))}
                            className="p-2.5 bg-white border border-slate-200 text-red-400 rounded-xl hover:border-red-100 hover:bg-red-50 hover:text-red-500 transition-all"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
           
           <div className="bg-purple-600 rounded-[2.5rem] p-8 text-white flex items-center justify-between relative overflow-hidden">
              <div className="relative z-10">
                 <h4 className="text-xl font-black uppercase tracking-tight">智能调度中心状态</h4>
                 <p className="text-sm font-bold text-purple-100 mt-1 opacity-80 italic">当前共有 2 个活跃节点，平均相应速度 1.2s，负载 24%</p>
              </div>
              <Activity className="w-16 h-16 text-white/20 absolute right-12 top-1/2 -translate-y-1/2" />
           </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
              <input
                type="text"
                placeholder="对话关键词检索"
                className="w-full pl-9 bg-slate-50 border-none rounded-xl text-[10px] font-bold p-2.5 outline-none focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select className="bg-transparent border-none text-[10px] font-black outline-none cursor-pointer text-slate-700">
                <option>全域分类</option>
                <option>勘探</option>
                <option>开发</option>
                <option>研究</option>
              </select>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <Star className="w-3.5 h-3.5 text-orange-400" />
              <select className="bg-transparent border-none text-[10px] font-black outline-none cursor-pointer text-slate-700">
                <option>全部星级</option>
                <option>已标星</option>
                <option>未标星</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-50">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="p-8 flex flex-col lg:flex-row gap-8 hover:bg-slate-50/30 transition-all group"
              >
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[8px] font-black rounded uppercase border border-indigo-100">
                        问答 ID: QA-2024-{i}
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Clock className="w-3 h-3 inline mr-1" /> 2024-04-30
                        14:30
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${star <= (i % 3) + 1 ? "text-orange-400 fill-orange-400" : "text-slate-200"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 bg-slate-50 p-3 rounded-2xl rounded-tl-none border border-slate-100">
                        Petrel 2023.2 版本中，如何导出层位数据并保留自定义属性？
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 text-xs font-medium text-slate-600 leading-relaxed bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                        在 Export 界面选择 ZGY 格式或 ASCII 格式，点击 "General"
                        选项卡，勾选 "Include user attributes"...
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded flex items-center gap-1 border border-slate-200 uppercase">
                      # Petrel
                    </span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[9px] font-black rounded flex items-center gap-1 border border-slate-200 uppercase">
                      # 数据导出
                    </span>
                    <button className="text-[9px] font-black text-blue-600 uppercase hover:underline ml-2">
                      + 打标签/分类
                    </button>
                  </div>
                </div>
                <div className="w-full lg:w-48 flex flex-col gap-2 shrink-0 justify-center">
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all">
                    <CheckCircle2 className="w-4 h-4" /> 提交知识库
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all">
                    <Star className="w-4 h-4" /> 标为推荐
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase hover:bg-red-50 transition-all">
                    <Trash2 className="w-4 h-4" /> 彻底删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Knowledge Modal */}
      <AddKnowledgeModal
        isOpen={showAddKnowledge}
        onClose={() => setShowAddKnowledge(false)}
        onSubmit={(data) => {
          console.log("Submission:", data);
          // Handle submission logic here
        }}
      />

      <LLMConfigModal 
        isOpen={showAddLLM}
        onClose={() => setShowAddLLM(false)}
        editingLLM={editingLLM}
        onSubmit={(data: any) => {
          if (editingLLM) {
            setLlms(llms.map(l => l.id === editingLLM.id ? { ...data, id: l.id } : l));
          } else {
            setLlms([...llms, { ...data, id: Date.now().toString() }]);
          }
          setShowAddLLM(false);
          setEditingLLM(null);
        }}
      />

      {/* Global Admin Tip Section */}
      <div
        className={`p-8 rounded-[3rem] text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-8 ${activeSection === AppSection.KnowledgeAdmin ? "bg-emerald-600" : "bg-blue-600"}`}
      >
        <div className="relative z-10 p-5 bg-white/20 rounded-[2rem] backdrop-blur-md">
          <AlertCircle className="w-10 h-10" />
        </div>
        <div className="relative z-10 flex-1 text-center md:text-left">
          <h4 className="text-lg font-black tracking-tight uppercase">
            管理引擎提示
          </h4>
          <p className="text-sm font-bold text-blue-100 mt-1">
            {activeSection === AppSection.KnowledgeAdmin
              ? "目前分类层级“软件技术栈”下的冗余知识项较多，建议开启目录精简模式。"
              : "检测到 3 个开放中的问题已超过 72 小时未回复，建议手动指派专家介入或推送至相关群组。"}
          </p>
        </div>
        <button className="relative z-10 px-8 py-4 bg-white text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl">
          立即处理
        </button>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
      </div>
    </div>
  );
};

const LLMConfigModal = ({ isOpen, onClose, onSubmit, editingLLM }: any) => {
  const [formData, setFormData] = useState({
     name: '',
     provider: 'Google',
     apiUrl: '',
     apiKey: '',
     accountType: 'ADMIN',
     modelName: '',
     status: 'ACTIVE'
  });

  useEffect(() => {
    if (editingLLM) {
      setFormData(editingLLM);
    } else {
      setFormData({
        name: '',
        provider: 'Google',
        apiUrl: '',
        apiKey: '',
        accountType: 'ADMIN',
        modelName: '',
        status: 'ACTIVE'
      });
    }
  }, [editingLLM, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
       <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl overflow-hidden relative border border-white/20 animate-in zoom-in-95 duration-300">
          <h2 className="text-xl font-black text-slate-800 mb-8">{editingLLM ? '编辑大模型配置' : '新增大模型服务'}</h2>
          
          <div className="space-y-5">
             <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">服务名称</label>
                   <input 
                     value={formData.name}
                     onChange={e => setFormData({...formData, name: e.target.value})}
                     className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold outline-none ring-2 ring-transparent focus:ring-purple-500/10 transition-all shadow-inner" 
                     placeholder="例如: 内部测试-Gemini"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">厂商/Provider</label>
                   <select 
                     value={formData.provider}
                     onChange={e => setFormData({...formData, provider: e.target.value})}
                     className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold outline-none shadow-inner"
                   >
                      <option>Google</option>
                      <option>OpenAI</option>
                      <option>Anthropic</option>
                      <option>Azure</option>
                      <option>Other</option>
                   </select>
                </div>
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">API 端点地址 (Base URL)</label>
                <input 
                  value={formData.apiUrl}
                  onChange={e => setFormData({...formData, apiUrl: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold outline-none shadow-inner" 
                  placeholder="https://generativelanguage.googleapis.com"
                />
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">API Key / Token</label>
                <div className="relative">
                   <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                   <input 
                     type="password"
                     value={formData.apiKey}
                     onChange={e => setFormData({...formData, apiKey: e.target.value})}
                     className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-4 text-xs font-bold outline-none shadow-inner" 
                     placeholder="输入认证密钥..."
                   />
                </div>
             </div>

             <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">账号权限类型</label>
                   <select 
                     value={formData.accountType}
                     onChange={e => setFormData({...formData, accountType: e.target.value as any})}
                     className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold outline-none shadow-inner"
                   >
                      <option value="ADMIN">管理账号 (全域共享)</option>
                      <option value="PERSONAL">个人账号 (限额访问)</option>
                   </select>
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">模型标识 (Model Identifier)</label>
                   <input 
                     value={formData.modelName}
                     onChange={e => setFormData({...formData, modelName: e.target.value})}
                     className="w-full bg-slate-50 border-none rounded-2xl p-4 text-xs font-bold outline-none shadow-inner" 
                     placeholder="gemini-1.5-pro"
                   />
                </div>
             </div>
          </div>

          <div className="flex justify-end gap-3 mt-10">
             <button onClick={onClose} className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">取消</button>
             <button 
               onClick={() => onSubmit(formData)}
               className="px-10 py-4 bg-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-purple-600/20 hover:bg-purple-500 transition-all active:scale-95"
             >
               保存配置信息
             </button>
          </div>
       </div>
    </div>
  );
};

export default AdminDashboard;
