import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  Terminal,
  Plus,
  History,
  Settings,
  Save,
  MoveRight,
  Edit3,
  Trash2,
  CheckCircle2,
  Star,
  MessageCircle,
  Database,
  Package,
  ChevronRight,
  Bookmark,
  Cpu,
} from "lucide-react";
import { getGeminiResponse } from "../services/gemini";
import { AIQATheme, AIQAMessage } from "../types";

const AIAssistant: React.FC = () => {
  const [sidebarTab, setSidebarTab] = useState<
    "conversations" | "history" | "favorites" | "recommendations"
  >("conversations");

  const [themes, setThemes] = useState<AIQATheme[]>([
    {
      id: "1",
      title: "Petrel 建模基础",
      createTime: "2024-04-30",
      status: "OPEN",
      prompts: ["你是一个 Petrel 专家，专注于三维地质建模。"],
    },
    {
      id: "2",
      title: "Python 地质自动脚本",
      createTime: "2024-04-29",
      status: "OPEN",
      prompts: ["你是一个资深地质程序员。"],
    },
  ]);

  const [activeThemeId, setActiveThemeId] = useState<string>("1");
  const [messages, setMessages] = useState<AIQAMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPromptEditing, setIsPromptEditing] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState("1");
  const [availableModels] = useState([
    { id: '1', name: 'Gemini 1.5 Pro (内部)', provider: 'Google' },
    { id: '2', name: 'GPT-4o (合作版)', provider: 'OpenAI' },
    { id: '3', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
    { id: '4', name: '本地 Llama 3 8B', provider: 'Local' },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // History & Favorites Mock data
  const [history, setHistory] = useState<AIQAMessage[]>([
    {
      id: "h1",
      themeId: "1",
      role: "assistant",
      content: "关于 Petrel 建模的参数设置，建议优先检查坐标系...",
      createTime: "2024-04-28",
    },
    {
      id: "h2",
      themeId: "2",
      role: "assistant",
      content: "Python 脚本可以通过 Ocean SDK 进行集成...",
      createTime: "2024-04-27",
    },
  ]);

  const [favorites, setFavorites] = useState<AIQAMessage[]>([
    {
      id: "f1",
      themeId: "1",
      role: "assistant",
      content: "专家建议：在进行物性建模前，必须先完成数据质控...",
      createTime: "2024-04-25",
      isStarred: true,
    },
  ]);

  const [recommendations, setRecommendations] = useState<AIQAMessage[]>([
    {
      id: "r1",
      themeId: "1",
      role: "assistant",
      content: "如何优选 Petrel 地震数据加载的分辨率？",
      createTime: "2024-04-30",
      isRecommended: true,
    },
    {
      id: "r2",
      themeId: "1",
      role: "assistant",
      content: "复杂断层框架下的 Pillar 自动生成策略。",
      createTime: "2024-04-30",
      isRecommended: true,
    },
    {
      id: "r3",
      themeId: "2",
      role: "assistant",
      content: "地质数据清洗的 10 个核心脚本片段。",
      createTime: "2024-04-30",
      isRecommended: true,
    },
  ]);

  const [recommendationPage, setRecommendationPage] = useState(0);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(recommendations.length / itemsPerPage);

  const displayedRecommendations = recommendations.slice(
    recommendationPage * itemsPerPage,
    (recommendationPage + 1) * itemsPerPage,
  );

  const handleNextRecommendations = () => {
    setRecommendationPage((prev) => (prev + 1) % totalPages);
  };

  const activeTheme = themes.find((t) => t.id === activeThemeId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !activeThemeId) return;

    const userMsg: AIQAMessage = {
      id: Date.now().toString(),
      themeId: activeThemeId,
      role: "user",
      content: input,
      createTime: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const context = activeTheme?.prompts.join("\n") || "";
    const fullPrompt = `${context}\n\nUser Question: ${input}`;
    const response = await getGeminiResponse(fullPrompt);

    const modelMsg: AIQAMessage = {
      id: (Date.now() + 1).toString(),
      themeId: activeThemeId,
      role: "assistant",
      content: response,
      createTime: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, modelMsg]);
    setIsLoading(false);

    // Add to history automatically
    setHistory((prev) => [modelMsg, ...prev]);
  };

  const createNewTheme = () => {
    const newTheme: AIQATheme = {
      id: Date.now().toString(),
      title: "新问答主题",
      createTime: new Date().toISOString().split("T")[0],
      status: "OPEN",
      prompts: ["你是一个专业软件技术助理。"],
    };
    setThemes([newTheme, ...themes]);
    setActiveThemeId(newTheme.id);
    setMessages([]);
    setSidebarTab("conversations");
  };

  const toggleFavorite = (msg: AIQAMessage) => {
    if (favorites.some((f) => f.id === msg.id)) {
      setFavorites(favorites.filter((f) => f.id !== msg.id));
    } else {
      setFavorites([{ ...msg, isStarred: true }, ...favorites]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-16 border-r bg-slate-900 flex flex-col items-center py-6 gap-6 shrink-0">
        <button
          onClick={() => setSidebarTab("conversations")}
          className={`p-3 rounded-xl transition-all ${sidebarTab === "conversations" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white"}`}
          title="当前对话"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        <button
          onClick={() => setSidebarTab("history")}
          className={`p-3 rounded-xl transition-all ${sidebarTab === "history" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white"}`}
          title="历史问答"
        >
          <History className="w-6 h-6" />
        </button>
        <button
          onClick={() => setSidebarTab("favorites")}
          className={`p-3 rounded-xl transition-all ${sidebarTab === "favorites" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white"}`}
          title="收藏问答"
        >
          <Bookmark className="w-6 h-6" />
        </button>
        <button
          onClick={() => setSidebarTab("recommendations")}
          className={`p-3 rounded-xl transition-all ${sidebarTab === "recommendations" ? "bg-blue-600 text-white" : "text-slate-500 hover:text-white"}`}
          title="推荐问答"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar: Content */}
      <div className="w-64 border-r bg-slate-50 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {sidebarTab === "conversations"
              ? "主题列表"
              : sidebarTab === "history"
                ? "问答回访"
                : sidebarTab === "favorites"
                  ? "我的收藏"
                  : "智能推荐"}
          </h3>
          {sidebarTab === "conversations" && (
            <button
              onClick={createNewTheme}
              className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sidebarTab === "conversations" ? (
            themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setActiveThemeId(theme.id);
                  setMessages([]);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all group ${
                  activeThemeId === theme.id
                    ? "bg-white shadow-sm border border-slate-200"
                    : "hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${theme.status === "OPEN" ? "bg-green-500" : "bg-slate-300"}`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-black truncate ${activeThemeId === theme.id ? "text-blue-600" : "text-slate-700"}`}
                    >
                      {theme.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold">
                      {theme.createTime}
                    </p>
                  </div>
                </div>
              </button>
            ))
          ) : sidebarTab === "history" ? (
            history.map((h) => (
              <div
                key={h.id}
                className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 group"
              >
                <p className="text-xs font-bold text-slate-700 line-clamp-2 leading-relaxed">
                  {h.content}
                </p>
                <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-400">
                  <span>{h.createTime}</span>
                  <button
                    onClick={() =>
                      setHistory(history.filter((it) => it.id !== h.id))
                    }
                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          ) : sidebarTab === "favorites" ? (
            favorites.map((f) => (
              <div
                key={f.id}
                className="p-3 bg-white border border-blue-100 rounded-xl space-y-2 group shadow-sm"
              >
                <p className="text-xs font-bold text-slate-700 line-clamp-2 leading-relaxed">
                  {f.content}
                </p>
                <div className="flex items-center justify-between text-[9px] font-black uppercase text-slate-400">
                  <span className="text-blue-500">已收藏</span>
                  <button
                    onClick={() => toggleFavorite(f)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    取消收藏
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-2">
              {displayedRecommendations.map((r) => (
                <div
                  key={r.id}
                  className="p-3 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl space-y-2 group"
                >
                  <p className="text-xs font-black text-slate-800 leading-relaxed">
                    {r.content}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => toggleFavorite(r)}
                      className="p-1 px-2 bg-white text-blue-600 text-[9px] font-black rounded border border-blue-100 uppercase tracking-tighter"
                    >
                      <Star className="w-2.5 h-2.5 inline mr-1" /> 收藏此问项
                    </button>
                    <ChevronRight className="w-3.5 h-3.5 text-blue-300" />
                  </div>
                </div>
              ))}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleNextRecommendations}
                  className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                >
                  换一批推荐 Question ({recommendationPage + 1}/{totalPages}) ➜
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col relative bg-white">
        {/* Header/Prompt Maintenance */}
        <div className="px-6 py-4 bg-white border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-black text-slate-800">
              {activeTheme?.title || "新问答 Session"}
            </h2>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100 shadow-sm transition-all hover:bg-purple-100">
               <Cpu className="w-3.5 h-3.5" />
               <select 
                 value={selectedModelId}
                 onChange={(e) => setSelectedModelId(e.target.value)}
                 className="bg-transparent border-none text-[10px] font-black outline-none cursor-pointer pr-1"
               >
                 {availableModels.map(m => (
                   <option key={m.id} value={m.id}>{m.name}</option>
                 ))}
               </select>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>

            <button
              onClick={() => setIsPromptEditing(!isPromptEditing)}
              className="p-1.5 px-3 text-[10px] font-bold bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 flex items-center gap-1.5 uppercase transition-all"
            >
              <Edit3 className="w-3 h-3" />
              提示词维护
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-slate-900/10">
              <Package className="w-3.5 h-3.5" /> 一键收纳对话
            </button>
          </div>
        </div>

        {isPromptEditing && (
          <div className="px-6 py-4 bg-slate-50 border-b animate-in slide-in-from-top duration-300">
            <label className="text-xs font-black text-slate-400 mb-2 block">
              System Prompts / Base Context
            </label>
            <textarea
              value={activeTheme?.prompts.join("\n")}
              onChange={(e) => {
                const newThemes = themes.map((t) =>
                  t.id === activeThemeId
                    ? { ...t, prompts: [e.target.value] }
                    : t,
                );
                setThemes(newThemes);
              }}
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
            />
          </div>
        )}

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4">
              <Bot className="w-12 h-12" />
              <p className="text-sm font-bold uppercase tracking-widest">
                请开始提问，我将为您提供专业的软件技术支持
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                    msg.role === "user" ? "bg-blue-600" : "bg-slate-900"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="space-y-3">
                  <div
                    className={`p-5 rounded-[1.5rem] shadow-sm text-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-slate-100/50 font-medium"
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                      {msg.content}
                    </pre>
                  </div>
                  {msg.role === "assistant" && (
                    <div className="flex flex-wrap items-center gap-2 px-1">
                      <button
                        onClick={() => toggleFavorite(msg)}
                        className={`p-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all flex items-center gap-1.5 border ${
                          favorites.some((f) => f.id === msg.id)
                            ? "bg-blue-50 border-blue-200 text-blue-600"
                            : "bg-white border-slate-100 text-slate-400 hover:text-blue-500"
                        }`}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${favorites.some((f) => f.id === msg.id) ? "fill-blue-600" : ""}`}
                        />
                        {favorites.some((f) => f.id === msg.id)
                          ? "已收藏"
                          : "收藏"}
                      </button>
                      <button
                        onClick={() =>
                          alert("正在将问答沉淀至知识库待审核列表...")
                        }
                        className="p-1.5 px-3 bg-white border border-slate-100 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all flex items-center gap-1.5"
                      >
                        <Database className="w-3.5 h-3.5" />
                        提交知识库
                      </button>
                      <button
                        onClick={() => alert("正在初始化社区交流讨论议案...")}
                        className="p-1.5 px-3 bg-white border border-slate-100 hover:bg-purple-50 text-slate-400 hover:text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all flex items-center gap-1.5"
                      >
                        <MoveRight className="w-3.5 h-3.5" />
                        转为问题交流
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20">
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
                <div className="bg-white/50 backdrop-blur-sm px-5 py-3 rounded-2xl text-slate-400 text-xs font-bold border border-slate-100 italic">
                  AI 正在整合行业专家知识库...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t lg:p-8">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="描述或粘贴您的软件技术难题，例如：Petrel 断层建模报错..."
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-200 outline-none text-sm font-bold transition-all shadow-inner shadow-slate-200/20"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-blue-500 uppercase">
                  Live AI Assistant
                </span>
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={`p-4 rounded-2xl transition-all shadow-xl ${
                !input.trim() || isLoading
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20 active:scale-95"
              }`}
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
