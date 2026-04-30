import React, { useState, useContext, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  User,
  ArrowLeft,
  Send,
  Heart,
  MessagesSquare,
  Info,
  Users,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  MoreVertical,
  Plus,
  Bot,
  Zap,
  MessageSquareText,
  Headphones,
  X,
  ShieldCheck,
  ChevronRight,
  BookMarked,
  Share2,
  ClipboardCheck,
  LayoutGrid,
  Map,
  Waves,
  Hammer,
  Repeat,
  ThumbsUp,
  Tags,
  Layers,
  Monitor,
  HardDrive,
  Cpu,
  Settings,
} from "lucide-react";
import { ThemeContext } from "../App";
import { getGeminiResponse } from "../services/gemini";
import { ProblemItem, ProblemMode, Expert, Message } from "../types";

const ProblemSpace: React.FC = () => {
  const { config } = useContext(ThemeContext);
  const [mode, setMode] = useState<ProblemMode>("TOPIC");

  // 复合筛选状态
  const [selectedDomain, setSelectedDomain] = useState<string>("全部");
  const [selectedSoftware, setSelectedSoftware] = useState<string>("全部");
  const [selectedType, setSelectedType] = useState<string>("全部");

  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 扩展后的问题列表
  const [problems, setProblems] = useState<ProblemItem[]>([
    {
      id: "p1",
      title: "Petrel 2024 断块区 Pillar Gridding 报错 0x89",
      software: "Petrel",
      category: "地学建模",
      businessDomain: "勘探",
      problemType: "技术",
      status: "resolved",
      author: "李工",
      time: "10分钟前",
      replies: 4,
      aiScore: 95,
      tags: ["Pillar", "报错"],
    },
    {
      id: "p2",
      title: "Eclipse 如何在数值模拟中准确描述复杂断块的传导率？",
      software: "Eclipse",
      category: "数值模拟",
      businessDomain: "开发",
      problemType: "业务",
      status: "open",
      author: "王研究员",
      time: "1小时前",
      replies: 0,
      aiScore: 82,
      tags: ["传导率", "断块"],
    },
    {
      id: "p3",
      title: "【求教】DecisionSpace 导入地震数据时基准面不对齐",
      software: "Landmark",
      category: "地震解释",
      businessDomain: "勘探",
      problemType: "操作",
      status: "open",
      author: "Sarah",
      time: "5小时前",
      replies: 12,
      aiScore: 78,
      tags: ["导入", "基准面"],
    },
    {
      id: "p4",
      title: "OSDU 数据平台接口认证失败 403 错误",
      software: "OSDU",
      category: "数据管理",
      businessDomain: "数字化",
      problemType: "系统",
      status: "open",
      author: "运维小周",
      time: "2小时前",
      replies: 3,
      aiScore: 90,
      tags: ["API", "权限"],
    },
    {
      id: "p5",
      title: "HYSYS 动态模拟课件下载及实验参数对照",
      software: "HYSYS",
      category: "流程模拟",
      businessDomain: "炼化",
      problemType: "课件",
      status: "resolved",
      author: "张教授",
      time: "昨天",
      replies: 45,
      aiScore: 88,
      tags: ["课件", "教学"],
    },
  ]);

  // 维度定义
  const businessDomains = [
    { name: "全部", icon: LayoutGrid },
    { name: "勘探", icon: Map },
    { name: "开发", icon: Zap },
    { name: "钻完井", icon: Hammer },
    { name: "集输", icon: Repeat },
    { name: "炼化", icon: Cpu },
    { name: "数字化", icon: Monitor },
  ];

  const softwares = [
    "全部",
    "Petrel",
    "Eclipse",
    "Landmark",
    "HYSYS",
    "OSDU",
    "其他",
  ];
  const problemTypes = [
    "全部",
    "技术",
    "业务",
    "操作",
    "数据",
    "系统",
    "课件",
    "其他",
  ];

  // 复合过滤逻辑
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchDomain =
        selectedDomain === "全部" || p.businessDomain === selectedDomain;
      const matchSoftware =
        selectedSoftware === "全部" || p.software === selectedSoftware;
      const matchType =
        selectedType === "全部" || p.problemType === selectedType;
      return matchDomain && matchSoftware && matchType;
    });
  }, [problems, selectedDomain, selectedSoftware, selectedType]);

  // AI 模式状态
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState<Message[]>([
    {
      role: "model",
      text: "您好，我是 AI 专家助手。请描述您的技术问题，我将为您调取全球库中的相似案例。",
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // 即时问答模式状态
  const [selectedExperts, setSelectedExperts] = useState<string[]>([]);
  const [isGroupChatActive, setIsGroupChatActive] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role: "model",
      text: "系统：已为您邀请所选专家加入会诊群聊。专家可能需要 1-2 分钟查看您的提问素材。",
      senderName: "系统通知",
    },
  ]);

  const [isConverting, setIsConverting] = useState(false);

  const handleConvertToTopic = async (source: "AI" | "INSTANT") => {
    setIsConverting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let newTopic: ProblemItem;
    if (source === "AI") {
      const lastQuestion =
        aiMessages.filter((m) => m.role === "user").pop()?.text ||
        "AI 辅助解答课题";
      newTopic = {
        id: `p-ai-${Date.now()}`,
        title: `【AI案例】${lastQuestion.substring(0, 35)}...`,
        software: "AI 综合",
        category: "智能分析",
        businessDomain: selectedDomain === "全部" ? "数字化" : selectedDomain,
        problemType: "技术",
        status: "resolved",
        author: "我 (由AI转写)",
        time: "刚刚",
        replies: 1,
        aiScore: 100,
        tags: ["AI自动生成", "知识沉淀"],
      };
    } else {
      newTopic = {
        id: `p-ins-${Date.now()}`,
        title: `【专家会诊记录】关于${selectedDomain}领域现场问题的多方研讨`,
        software: "多软件协同",
        category: "综合诊断",
        businessDomain: selectedDomain,
        problemType: "业务",
        status: "resolved",
        author: "会诊秘书",
        time: "刚刚",
        replies: chatMessages.length,
        aiScore: 88,
        tags: ["会诊结论", "实战案例"],
      };
    }

    setProblems((prev) => [newTopic, ...prev]);
    setIsConverting(false);
    setMode("TOPIC");
    setSelectedId(newTopic.id);
  };

  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    const userMsg: Message = { role: "user", text: aiInput };
    setAiMessages((prev) => [...prev, userMsg]);
    setAiInput("");
    setIsAiLoading(true);
    const response = await getGeminiResponse(`【技术难题咨询】${aiInput}`);
    setAiMessages((prev) => [...prev, { role: "model", text: response }]);
    setIsAiLoading(false);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { role: "user", text: chatInput, senderName: "我" },
    ]);
    setChatInput("");
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-120px)] flex gap-6 animate-in fade-in duration-700 overflow-hidden relative">
      {isConverting && (
        <div className="absolute inset-0 z-[200] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <BookMarked className="w-8 h-8 text-blue-600 animate-bounce" />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-black text-slate-800">
                正在萃取核心知识点...
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
                AI 正在为您生成结构化主题报告
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 左侧：业务领域侧边栏 */}
      <aside className="w-64 bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm flex flex-col shrink-0 overflow-y-auto">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
          业务领域
        </h3>
        <div className="space-y-1 flex-1">
          {businessDomains.map((domain) => (
            <button
              key={domain.name}
              onClick={() => setSelectedDomain(domain.name)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${selectedDomain === domain.name ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <div className="flex items-center gap-3">
                <domain.icon
                  className={`w-4 h-4 ${selectedDomain === domain.name ? "text-white" : "text-slate-400"}`}
                />
                <span>{domain.name}</span>
              </div>
              <ChevronRight
                className={`w-3 h-3 ${selectedDomain === domain.name ? "opacity-100" : "opacity-0"}`}
              />
            </button>
          ))}
        </div>
        <div className="pt-6 border-t border-slate-100 mt-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                快捷订阅
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              您可以订阅关注的领域，及时获取最新问答动态。
            </p>
          </div>
        </div>
      </aside>

      {/* 右侧：主体区域 */}
      <div className="flex-1 flex flex-col bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* 顶部：模式切换 & 复合过滤 */}
        <div className="border-b border-slate-100">
          <div className="p-4 flex items-center justify-between">
            <div className="bg-slate-100/80 p-1.5 rounded-[1.5rem] flex gap-1">
              <button
                onClick={() => {
                  setMode("AI");
                  setSelectedId(null);
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${mode === "AI" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
              >
                <Sparkles className="w-4 h-4" /> AI 问答
              </button>
              <button
                onClick={() => {
                  setMode("TOPIC");
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${mode === "TOPIC" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
              >
                <MessageSquareText className="w-4 h-4" /> 主题问答
              </button>
              <button
                onClick={() => {
                  setMode("INSTANT");
                  setSelectedId(null);
                }}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${mode === "INSTANT" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"}`}
              >
                <Zap className="w-4 h-4" /> 即时群聊
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="检索关键词..."
                  className="bg-slate-50 border-none pl-9 pr-4 py-2 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10 w-48"
                />
              </div>
              <button className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 复合过滤器栏 */}
          {mode === "TOPIC" && (
            <div className="px-6 pb-4 flex flex-wrap items-center gap-6 border-t border-slate-50 pt-4">
              <div className="flex items-center gap-3">
                <Monitor className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  软件：
                </span>
                <div className="flex gap-2">
                  {softwares.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSoftware(s)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${selectedSoftware === s ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Tags className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  种类：
                </span>
                <div className="flex gap-2">
                  {problemTypes.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedType(t)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${selectedType === t ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-500 hover:bg-slate-100"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto relative">
          {mode === "AI" && (
            <div className="h-full flex flex-col bg-slate-50/30">
              <div className="bg-white/80 backdrop-blur-md px-8 py-3 border-b flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-slate-900" />
                  <span className="text-[10px] font-black text-slate-900 uppercase">
                    当前：AI 技术诊断会话
                  </span>
                </div>
                {aiMessages.length > 2 && (
                  <button
                    onClick={() => handleConvertToTopic("AI")}
                    className="flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black border border-amber-100 hover:bg-amber-100 transition-all"
                  >
                    <BookMarked className="w-3.5 h-3.5" /> 一键转为主题问答
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {aiMessages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-3 max-w-[80%] ${m.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-blue-600" : "bg-slate-900"}`}
                      >
                        {m.role === "user" ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div
                        className={`p-4 rounded-[1.5rem] text-xs font-medium shadow-sm ${m.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white border border-slate-100 rounded-tl-none text-slate-700"}`}
                      >
                        {m.text}
                      </div>
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center animate-pulse">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 animate-pulse italic uppercase tracking-widest">
                        正在联想历史库...
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 bg-white border-t border-slate-100">
                <div className="flex gap-4 items-center max-w-4xl mx-auto">
                  <textarea
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="描述您的技术问题..."
                    className="flex-1 bg-slate-50 border-none rounded-[1.5rem] px-6 py-3 text-xs outline-none focus:ring-2 focus:ring-blue-600/10 min-h-[50px] resize-none"
                  />
                  <button
                    onClick={handleAiSend}
                    className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === "TOPIC" && (
            <div className="p-8">
              {selectedId ? (
                <div className="animate-in slide-in-from-right-4 duration-500 space-y-8">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold mb-4 text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> 返回列表
                  </button>
                  <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <h2 className="text-2xl font-black text-slate-800 mb-6">
                      {problems.find((p) => p.id === selectedId)?.title}
                    </h2>
                    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
                        解决方案摘录
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        经过多方验证，建议采取以下工作流：检查数据源完整性，然后通过脚本进行基准面归一化，最后导出为标准
                        LAS 格式...
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                        {selectedDomain} 领域研讨结果
                      </h3>
                      <span className="bg-slate-100 text-[10px] font-black text-slate-400 px-2 py-0.5 rounded">
                        共 {filteredProblems.length} 条
                      </span>
                    </div>
                  </div>
                  {filteredProblems.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedId(p.id)}
                      className={`bg-white p-6 rounded-[2rem] border transition-all cursor-pointer group flex gap-6 items-center border-slate-200 hover:border-blue-500 hover:shadow-xl`}
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${p.status === "resolved" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}
                      >
                        {p.tags.includes("AI自动生成") ? (
                          <BookMarked className="w-6 h-6 text-blue-500" />
                        ) : (
                          <CheckCircle2 className="w-6 h-6" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate mb-1">
                          {p.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                          <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">
                            {p.software}
                          </span>
                          <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100">
                            {p.businessDomain}
                          </span>
                          <span className="bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-100">
                            {p.problemType}类
                          </span>
                          <span>• {p.author}</span>
                          <span>• {p.time}</span>
                        </div>
                      </div>
                      <div className="text-right px-4">
                        <p className="text-xs font-black text-slate-800">
                          {p.replies}
                        </p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                          回复
                        </p>
                      </div>
                    </div>
                  ))}
                  {filteredProblems.length === 0 && (
                    <div className="py-20 flex flex-col items-center justify-center text-slate-300 gap-4">
                      <Search className="w-12 h-12 opacity-10" />
                      <p className="text-sm font-bold italic tracking-widest uppercase">
                        该组合筛选下暂无相关问答
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {mode === "INSTANT" && (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-sm">
                <Headphones className="w-10 h-10 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                  即时多方会诊
                </h2>
                <p className="text-sm text-slate-500 font-medium max-w-sm">
                  选择您目前所在的{" "}
                  <span className="text-blue-600 font-black">
                    {selectedDomain}
                  </span>{" "}
                  业务环节，系统将为您匹配最合适的在线专家进行即时解答。
                </p>
              </div>
              <button
                onClick={() => setIsGroupChatActive(true)}
                className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all"
              >
                发起会诊请求
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemSpace;
