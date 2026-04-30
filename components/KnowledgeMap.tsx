import React, { useState, useContext, useMemo } from "react";
import {
  Library,
  GraduationCap,
  Search,
  Filter,
  ThumbsUp,
  Tag,
  FolderTree,
  FileText,
  Video,
  ChevronRight,
  Plus,
  Settings2,
  Info,
  BookOpen,
  Share2,
  Sparkles,
  Download,
  MoreVertical,
  Clock,
  MessagesSquare,
  Terminal,
  Layout,
  Loader2,
  Grid,
  List,
  Eye,
  ExternalLink,
  ChevronLeft,
  X,
  MoveRight,
} from "lucide-react";
import { ThemeContext } from "../App";
import {
  KnowledgeItem,
  KnowledgeDomain,
  KnowledgeCategory,
  CustomCategory,
  AppSection,
} from "../types";
import { getGeminiResponse } from "../services/gemini";
import AddKnowledgeModal from "./AddKnowledgeModal";

interface KnowledgeMapProps {
  setActiveSection: (section: AppSection) => void;
}

const KnowledgeMap: React.FC<KnowledgeMapProps> = ({ setActiveSection }) => {
  const { config } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 综合过滤状态
  const [selectedDomain, setSelectedDomain] = useState<
    KnowledgeDomain | "全部"
  >("全部");
  const [selectedCategory, setSelectedCategory] = useState<
    KnowledgeCategory | "全部"
  >("全部");
  const [selectedSoftware, setSelectedSoftware] = useState<string | "全部">(
    "全部",
  );
  const [selectedCustomCat, setSelectedCustomCat] = useState<string | null>(
    null,
  );
  const [selectedTheme, setSelectedTheme] = useState<string | "全部">("全部");

  const [generatingSyllabusId, setGeneratingSyllabusId] = useState<
    string | null
  >(null);
  const [showAddKnowledge, setShowAddKnowledge] = useState(false);

  // 模拟数据
  const softwares = ["Petrel", "Eclipse", "Landmark", "HYSYS", "Epos"];
  const themes = [
    "构造建模",
    "稠油开发",
    "自动化脚本",
    "油藏动态",
    "三维解释",
    "测井评价",
    "油藏模拟",
    "产能预测",
  ];
  const customCategories: CustomCategory[] = [
    { id: "cc1", name: "基础软件操作", parentId: null },
    { id: "cc2", name: "地质综合研究", parentId: null },
    { id: "cc3", name: "油藏工程理论", parentId: null },
    { id: "cc1-1", name: "界面导引", parentId: "cc1" },
    { id: "cc1-2", name: "数据导入", parentId: "cc1" },
    { id: "cc2-1", name: "构造解释", parentId: "cc2" },
    { id: "cc2-2", name: "属性建模", parentId: "cc2" },
  ];

  const [items, setItems] = useState<KnowledgeItem[]>([
    {
      id: "1",
      title: "Petrel 2024 断裂识别最佳实践",
      content:
        "详细介绍 Petrel 2024 中的断裂识别工作流，包括自动断层提取、Pillar Gridding 技巧以及常见的断层交叉处理方案。适用于复杂构造建模。",
      source: "UPLOAD",
      software: "Petrel",
      domain: "勘探",
      category: "帮助资料",
      customCategoryIds: ["cc1", "cc1-2", "cc2", "cc2-1"],
      businessTheme: "构造建模",
      author: "张三",
      createTime: "2024-04-20",
      status: "APPROVED",
      format: "document",
      url: "#",
    },
    {
      id: "2",
      title: "AI 问答：Eclipse 稠油热采配置",
      content:
        "针对稠油开发中的热采模拟，Eclipse 需要特定的关键字配置（如 KEYWORD: STEAM）。本篇汇总了 AI 助手针对不同油品粘度给出的推荐配置。",
      source: "AI",
      software: "Eclipse",
      domain: "开发",
      category: "问答",
      customCategoryIds: ["cc3"],
      businessTheme: "稠油开发",
      author: "AI 助手",
      createTime: "2024-04-22",
      status: "APPROVED",
      format: "text",
    },
    {
      id: "3",
      title: "三维建模脚本自动化(Landmark版)",
      content:
        "这是一套基于 Python 的自动化脚本，能够批量处理 Landmark 系统中的井位数据并自动生成初始网格模型。内置了错误日志分析功能。",
      source: "COMMUNITY",
      software: "Landmark",
      domain: "研究",
      category: "软件工具",
      customCategoryIds: ["cc2", "cc2-2"],
      businessTheme: "自动化脚本",
      author: "李四",
      createTime: "2024-04-25",
      status: "APPROVED",
      format: "link",
      url: "https://forum.petrosoft.com/topic/123",
    },
    {
      id: "4",
      title: "多相流模拟常见报错排查",
      content:
        "总结了在进行高含水期多相流模拟时，软件经常弹出的收敛性错误。提供了调整松弛因子的具体步骤。",
      source: "OFFICIAL" as any,
      software: "HYSYS",
      domain: "工程",
      category: "帮助资料",
      customCategoryIds: ["cc1-1"],
      businessTheme: "三维解释",
      author: "官方",
      createTime: "2024-04-28",
      status: "APPROVED",
      format: "text",
    },
  ]);

  const [activeItem, setActiveItem] = useState<KnowledgeItem | null>(null);

  // 组合过滤逻辑
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDomain =
        selectedDomain === "全部" || item.domain === selectedDomain;
      const matchesCategory =
        selectedCategory === "全部" || item.category === selectedCategory;
      const matchesSoftware =
        selectedSoftware === "全部" || item.software === selectedSoftware;
      const matchesCustom =
        !selectedCustomCat ||
        item.customCategoryIds.includes(selectedCustomCat);
      const matchesTheme =
        selectedTheme === "全部" || item.businessTheme === selectedTheme;

      return (
        matchesSearch &&
        matchesDomain &&
        matchesCategory &&
        matchesSoftware &&
        matchesCustom &&
        matchesTheme &&
        item.status === "APPROVED"
      );
    });
  }, [
    items,
    searchQuery,
    selectedDomain,
    selectedCategory,
    selectedSoftware,
    selectedCustomCat,
    selectedTheme,
  ]);

  const resetFilters = () => {
    setSelectedDomain("全部");
    setSelectedCategory("全部");
    setSelectedSoftware("全部");
    setSelectedCustomCat(null);
    setSelectedTheme("全部");
    setSearchQuery("");
  };

  const handleGenerateSyllabus = async (item: KnowledgeItem) => {
    setGeneratingSyllabusId(item.id);
    const prompt = `根据以下软件知识内容，生成一个专业的教学大纲（Syllabus），包括学习目标、课程章节和练习建议：\n\n标题：${item.title}\n内容概览：${item.content}`;
    const result = await getGeminiResponse(prompt);
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, syllabus: result } : i)),
    );
    setGeneratingSyllabusId(null);
    if (activeItem?.id === item.id) {
      setActiveItem({ ...activeItem, syllabus: result });
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto space-y-4 pb-20 animate-in fade-in duration-700">
      {/* 1. Header: Compact Unified Control Bar */}
      <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-lg shadow-slate-200/40 sticky top-4 z-40 transition-all">
        <div className="p-3 flex items-center gap-4">
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`p-2.5 rounded-xl transition-all ${isSidebarOpen ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-400 hover:text-slate-600"}`}
            title={isSidebarOpen ? "收起导航" : "展开导航"}
          >
            <Filter
              className={`w-5 h-5 transition-transform ${isSidebarOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div className="h-6 w-px bg-slate-100 hidden sm:block"></div>

          {/* Search Integrated Directly in Header */}
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-all pointer-events-none" />
            <input
              type="text"
              placeholder="搜索全域知识库..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs focus:ring-4 focus:ring-blue-500/5 outline-none font-bold transition-all transition-colors"
            />
          </div>

          <div className="h-6 w-px bg-slate-100"></div>

          {/* Compact View Switcher */}
          <div className="flex bg-slate-50 p-1 rounded-xl">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-slate-400 hover:text-slate-600"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={resetFilters}
            className="p-2.5 text-slate-400 hover:text-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="h-6 w-px bg-slate-100"></div>

          <button
            onClick={() => setShowAddKnowledge(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
          >
            <Plus className="w-4 h-4" /> 录入新知识
          </button>
        </div>

        {/* Condensed Sub-Filters Bar */}
        <div className="px-5 pb-3 border-t border-slate-50 pt-2 flex flex-wrap items-center gap-x-8 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter shrink-0 italic">
              领域
            </span>
            <div className="flex gap-1.5">
              {["全部", "勘探", "开发", "研究", "油藏"].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDomain(d as any)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${selectedDomain === d ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 border-l border-slate-100 pl-8">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter shrink-0 italic">
              核心平台
            </span>
            <div className="flex gap-1.5">
              {["全部", ...softwares.slice(0, 4)].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSoftware(s)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${selectedSoftware === s ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 border-l border-slate-100 pl-8">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter shrink-0 italic">
              维度
            </span>
            <div className="flex gap-1.5">
              {["全部", "问答", "资料", "工具"].map((c) => (
                <button
                  key={c}
                  onClick={() =>
                    c === "资料"
                      ? setSelectedCategory("帮助资料")
                      : c === "工具"
                        ? setSelectedCategory("软件工具")
                        : setSelectedCategory(c as any)
                  }
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${selectedCategory === (c === "资料" ? "帮助资料" : c === "工具" ? "软件工具" : c) ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex items-start gap-4 transition-all duration-500">
        {/* Left: Responsive Sidebar */}
        <div
          className={`shrink-0 transition-all duration-300 origin-left ease-in-out ${isSidebarOpen ? "w-64 opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-full pointer-events-none"}`}
        >
          <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col max-h-[calc(100vh-160px)] overflow-hidden sticky top-36">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100">
              <h3 className="text-[10px] font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                <FolderTree className="w-3.5 h-3.5 text-blue-600" />
                层级导航库
              </h3>
            </div>
            <div className="p-3 py-5 space-y-6 overflow-y-auto no-scrollbar">
              <section className="space-y-3">
                <button
                  onClick={() => setSelectedCustomCat(null)}
                  className={`w-full text-left p-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!selectedCustomCat ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}`}
                >
                  显示全部节点
                </button>
                <div className="space-y-1">
                  {customCategories
                    .filter((c) => !c.parentId)
                    .map((parent) => (
                      <div key={parent.id} className="space-y-1">
                        <button
                          onClick={() =>
                            setSelectedCustomCat(
                              selectedCustomCat === parent.id
                                ? null
                                : parent.id,
                            )
                          }
                          className={`w-full text-left p-2.5 rounded-xl text-[10px] font-bold flex items-center justify-between transition-all group ${selectedCustomCat?.startsWith(parent.id) ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50"}`}
                        >
                          <span className="flex items-center gap-2 truncate whitespace-nowrap">
                            <Info className="w-3.5 h-3.5 opacity-50 shrink-0" />
                            {parent.name}
                          </span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform shrink-0 ${selectedCustomCat?.startsWith(parent.id) ? "rotate-90" : "opacity-0"}`}
                          />
                        </button>
                        {selectedCustomCat?.startsWith(parent.id) &&
                          customCategories
                            .filter((c) => c.parentId === parent.id)
                            .map((child) => (
                              <button
                                key={child.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCustomCat(child.id);
                                }}
                                className={`w-full text-left pl-10 pr-3 py-1.5 rounded-lg text-[9px] font-bold transition-all ${selectedCustomCat === child.id ? "text-blue-700 bg-blue-100/50" : "text-slate-400 hover:text-slate-700 hover:bg-slate-50/50"}`}
                              >
                                {child.name}
                              </button>
                            ))}
                      </div>
                    ))}
                </div>
              </section>

              <div className="h-px bg-slate-100 mx-2"></div>

              <section className="space-y-3">
                <h4 className="px-2 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">
                  业务主题旗帜
                </h4>
                <div className="space-y-1">
                  {["全部", ...themes].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setSelectedTheme(theme)}
                      className={`flex items-center gap-3 w-full p-2.5 rounded-xl text-[10px] font-bold transition-all ${selectedTheme === theme ? "bg-purple-50 text-purple-700 font-black" : "text-slate-500 hover:bg-slate-50"}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${selectedTheme === theme ? "bg-purple-500" : "bg-slate-300"}`}
                      ></span>
                      <span className="truncate">{theme}</span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Right: Results Content */}
        <div className="flex-1 min-w-0">
          {activeItem ? (
            /* Reader Mode */
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 relative min-h-[600px] flex flex-col">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-20 backdrop-blur-md bg-white/90">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveItem(null)}
                    className="p-2.5 bg-slate-50 hover:bg-blue-50 text-blue-600 rounded-xl transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="min-w-0">
                    <h2 className="text-lg font-black text-slate-800 tracking-tight line-clamp-1">
                      {activeItem.title}
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {activeItem.domain} · {activeItem.software} 平台
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleGenerateSyllabus(activeItem)}
                    disabled={generatingSyllabusId === activeItem.id}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 disabled:opacity-50"
                  >
                    {generatingSyllabusId === activeItem.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    AI 提炼
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-10 max-w-4xl mx-auto w-full">
                <div className="prose prose-slate max-w-none">
                  <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-200 flex items-start gap-5 not-prose mb-10">
                    <div className="p-5 bg-blue-100 text-blue-600 rounded-[1.5rem] shrink-0">
                      {activeItem.category === "问答" ? (
                        <MessagesSquare className="w-8 h-8" />
                      ) : (
                        <FileText className="w-8 h-8" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-800 mb-2 tracking-tight">
                        知识背景
                      </h4>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        该条目隶属于 {activeItem.businessTheme}{" "}
                        专项库。版本提交于 {activeItem.createTime}，贡献者：
                        {activeItem.author}。
                      </p>
                    </div>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed text-slate-600 font-medium text-lg">
                    {activeItem.content}
                  </p>

                  {activeItem.syllabus && (
                    <div className="not-prose mt-12 p-8 bg-blue-50/20 rounded-[2rem] border-2 border-dashed border-blue-100">
                      <h3 className="text-base font-black text-slate-800 flex items-center gap-3 mb-6 uppercase tracking-widest italic">
                        <BookOpen className="w-5 h-5 text-blue-600" /> AI
                        提炼大纲
                      </h3>
                      <div className="bg-white p-8 rounded-2xl text-[13px] text-slate-600 leading-loose whitespace-pre-wrap font-sans shadow-lg shadow-blue-600/5">
                        {activeItem.syllabus}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* List/Grid Browsing */
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex flex-wrap items-center gap-2 min-h-[28px]">
                  {selectedDomain !== "全部" ||
                  selectedSoftware !== "全部" ||
                  selectedCategory !== "全部" ||
                  selectedCustomCat ||
                  selectedTheme !== "全部" ||
                  searchQuery ? (
                    <div className="flex flex-wrap gap-1.5 transition-all">
                      {selectedDomain !== "全部" && (
                        <TagPill
                          label={`领域:${selectedDomain}`}
                          onClear={() => setSelectedDomain("全部")}
                          color="blue"
                        />
                      )}
                      {selectedSoftware !== "全部" && (
                        <TagPill
                          label={`平台:${selectedSoftware}`}
                          onClear={() => setSelectedSoftware("全部")}
                          color="slate"
                        />
                      )}
                      {selectedCategory !== "全部" && (
                        <TagPill
                          label={`类别:${selectedCategory}`}
                          onClear={() => setSelectedCategory("全部")}
                          color="emerald"
                        />
                      )}
                      {selectedTheme !== "全部" && (
                        <TagPill
                          label={`主题:${selectedTheme}`}
                          onClear={() => setSelectedTheme("全部")}
                          color="purple"
                        />
                      )}
                      {selectedCustomCat && (
                        <TagPill
                          label={`目录:${customCategories.find((c) => c.id === selectedCustomCat)?.name}`}
                          onClear={() => setSelectedCustomCat(null)}
                          color="amber"
                        />
                      )}
                      {searchQuery && (
                        <TagPill
                          label={`搜索:"${searchQuery}"`}
                          onClear={() => setSearchQuery("")}
                          color="slate"
                        />
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-300 italic">
                      全域浏览 (无过滤)
                    </span>
                  )}
                </div>
                <div className="text-[10px] font-black text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm shrink-0 uppercase tracking-tighter">
                  找到 {filteredItems.length} 个知识点
                </div>
              </div>

              <div
                className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
              >
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveItem(item)}
                    className={`group bg-white rounded-[2rem] border border-slate-200 transition-all hover:border-blue-400 hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex ${viewMode === "grid" ? "flex-col p-6 min-h-[260px]" : "flex-row items-center p-5 gap-6"}`}
                  >
                    <div
                      className={`rounded-2xl transition-transform group-hover:scale-110 flex items-center justify-center shrink-0 ${viewMode === "grid" ? "w-12 h-12 mb-6" : "w-16 h-16"} ${item.category === "软件工具" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}
                    >
                      {item.category === "问答" ? (
                        <MessagesSquare className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 ${viewMode === "grid" ? "text-sm mb-3" : "text-base mb-2"}`}
                      >
                        {item.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                          {item.software}
                        </span>
                        <span className="text-[9px] font-black text-purple-600 uppercase tracking-tighter bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                          {item.businessTheme}
                        </span>
                        {viewMode === "list" && (
                          <span className="text-[10px] font-bold text-slate-400 ml-2">
                            By {item.author} · {item.createTime}
                          </span>
                        )}
                      </div>
                    </div>
                    {viewMode === "grid" && (
                      <div className="pt-5 mt-auto border-t border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={`https://picsum.photos/seed/${item.author}/40/40`}
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                          />
                          <span className="text-[10px] font-bold text-slate-500">
                            {item.author}
                          </span>
                        </div>
                        <MoveRight className="w-4 h-4 text-slate-200 group-hover:text-blue-600 transition-all group-hover:translate-x-1" />
                      </div>
                    )}
                    {viewMode === "list" && (
                      <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shrink-0">
                        阅览内容
                      </button>
                    )}
                  </div>
                ))}

                {filteredItems.length === 0 && (
                  <div className="col-span-full py-40 flex flex-col items-center justify-center text-slate-300 bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-100">
                    <Filter className="w-12 h-12 mb-6 opacity-20" />
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">
                      坐标未命中
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-8 px-10 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20"
                    >
                      重置全部过滤器
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <AddKnowledgeModal
        isOpen={showAddKnowledge}
        onClose={() => setShowAddKnowledge(false)}
        onSubmit={(data) => {
          const newItem: KnowledgeItem = {
            id: Date.now().toString(),
            title: data.name,
            content: data.content,
            source: "UPLOAD",
            software: data.software,
            domain: data.domain,
            category: data.category,
            customCategoryIds: data.customCategories || [],
            businessTheme: data.theme,
            author: "Current User",
            createTime: new Date().toISOString().split("T")[0],
            status: "PENDING",
            format: data.attachments?.length ? "document" : "text",
          };
          setItems((prev) => [...prev, newItem]);
          setShowAddKnowledge(false);
          alert("知识已录入，请等待管理员审核入库");
        }}
      />
    </div>
  );
};

// Internal Helper for Breadcrumbs
const TagPill = ({
  label,
  onClear,
  color,
}: {
  label: string;
  onClear: () => void;
  color: string;
}) => {
  const colorMap: any = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    slate: "bg-slate-900 text-white border-slate-800",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
  };

  return (
    <span
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border transition-all duration-300 animate-in zoom-in ${colorMap[color]}`}
    >
      {label}
      <button
        onClick={onClear}
        className="hover:scale-125 transition-transform"
      >
        <X className="w-3 h-3" />
      </button>
    </span>
  );
};

export default KnowledgeMap;
