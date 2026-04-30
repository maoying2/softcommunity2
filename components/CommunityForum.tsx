import React, { useState, useContext, useMemo } from "react";
import {
  MessagesSquare,
  MessageCircle,
  Search,
  PlusCircle,
  ChevronRight,
  Filter,
  Star,
  CheckCircle2,
  XCircle,
  MoreVertical,
  ThumbsUp,
  User,
  Clock,
  AlertCircle,
  Sparkles,
  Calendar,
  Layers,
  Tag as TagIcon,
  X,
  Mail,
  Send,
} from "lucide-react";
import { ThemeContext } from "../App";
import { CommunityTopic, CommunityQuestion, UserRole } from "../types";

const CommunityForum: React.FC = () => {
  const { config } = useContext(ThemeContext);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAskModal, setShowAskModal] = useState(false);
  const [newQuestionTitle, setNewQuestionTitle] = useState("");
  const [newQuestionContent, setNewQuestionContent] = useState("");
  const [newQuestionType, setNewQuestionType] = useState<'OPEN' | 'PRIVATE'>('OPEN');
  const [selectedRecipientId, setSelectedRecipientId] = useState("");

  // Detail & Action States
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(
    null,
  );
  const [replyInput, setReplyInput] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [isSolved, setIsSolved] = useState(true);
  const [selectedBestReplyId, setSelectedBestReplyId] = useState<string>("");
  const [closingComment, setClosingComment] = useState("");
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveReason, setArchiveReason] = useState("");

  // Advanced Filter State
  const [filterCreator, setFilterCreator] = useState("");
  const [filterCategory, setFilterCategory] = useState("全部");
  const [filterDateRange, setFilterDateRange] = useState("全部");
  const [onlyMyQuestions, setOnlyMyQuestions] = useState(false);
  const [onlyMyPrivateMessages, setOnlyMyPrivateMessages] = useState(false);

  // 模拟数据
  const colleaguesArray = [
    { id: 'u1', name: '张首席', department: '勘探部' },
    { id: 'u2', name: '李工', department: '工程部' },
    { id: 'u3', name: '王博', department: '研究院' },
  ];

  // 模拟数据
  const [topics, setTopics] = useState<CommunityTopic[]>([
    {
      id: "t1",
      title: "Petrel 建模技巧",
      description: "关于 Petrel 建模的各种奇淫巧技...",
      creator: "Admin",
      createTime: "2024-04-01",
      status: "OPEN",
    },
    {
      id: "t2",
      title: "Eclipse 模拟求助",
      description: "数模过程中的报错与优化讨论",
      creator: "张首席",
      createTime: "2024-04-05",
      status: "OPEN",
    },
  ]);

  const [questions, setQuestions] = useState<CommunityQuestion[]>([
    {
      id: "q1",
      topicId: "t1",
      category: "几何建模",
      title: "Pillar Gridding 几何报错怎么办？",
      content: "我在进行 Pillar Gridding 时报错...",
      author: "小白",
      createTime: "2024-04-20",
      status: "OPEN",
      replies: [],
      type: 'OPEN'
    },
    {
      id: "q2",
      topicId: "t1",
      category: "断层建模",
      title: "断层建模中如何处理交叉断层？",
      content: "遇到复杂交叉断层处理不了...",
      author: "李工",
      createTime: "2024-04-22",
      status: "OPEN",
      replies: [],
      type: 'OPEN'
    },
    {
      id: "q3",
      topicId: "t2",
      category: "数值模拟",
      title: "Eclipse 并行计算效率太低如何优化？",
      content: "目前使用 32 核并行，但效率没有显著提升...",
      author: "王博",
      createTime: "2024-04-25",
      status: "OPEN",
      replies: [],
      type: 'OPEN'
    },
    {
      id: "mq1",
      topicId: "t1",
      category: "物性插值",
      title: "如何优化克里金插值的变异函数参数？",
      content: "在进行物性建模时，克里金插值的效果不理想，请问如何选择合适的变异函数模型？",
      author: "当前用户",
      createTime: "2024-04-28",
      status: "OPEN",
      replies: [
        {
          id: 'r1',
          questionId: 'mq1',
          author: '张首席',
          content: '建议先进行数据的正态性分析，然后根据实验变异曲线选择最契合的模型。',
          createTime: '2024-04-29T10:00:00Z',
          rating: 9
        }
      ],
      type: 'OPEN'
    },
    {
      id: "mq2",
      topicId: "t2",
      category: "数值模拟",
      title: "关于聚合物驱的数模参数设置建议",
      content: "最近在做一个聚合物驱的模拟，对吸附参数的设定比较模糊。",
      author: "当前用户",
      createTime: "2024-04-29",
      status: "OPEN",
      replies: [],
      type: 'OPEN'
    },
    {
      id: "pm1",
      topicId: "t1",
      category: "交流",
      title: "私信：关于XX油田项目的底层逻辑请教",
      content: "张总，在XX项目中，关于构造带的演化逻辑我有些疑问...",
      author: "当前用户",
      createTime: "2024-04-30",
      status: "OPEN",
      replies: [],
      type: 'PRIVATE',
      recipientId: 'u1',
      recipientName: '张首席'
    },
    {
      id: "pm2",
      topicId: "t2",
      category: "交流",
      title: "关于 Eclipse 报错的私下反馈",
      content: "王博，刚才会议上提到的那个报错，我这里有份日志...",
      author: "李工",
      createTime: "2024-04-29",
      status: "OPEN",
      replies: [],
      type: 'PRIVATE',
      recipientId: 'current_user_id', // Assuming current user is recipient
      recipientName: '当前用户'
    }
  ]);

  const filteredQuestions = useMemo(() => {
    let qs = activeTopicId
      ? questions.filter((q) => q.topicId === activeTopicId)
      : questions;

    if (searchQuery) {
      qs = qs.filter(
        (q) =>
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.content.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (filterCreator) {
      qs = qs.filter((q) =>
        q.author.toLowerCase().includes(filterCreator.toLowerCase()),
      );
    }

    if (filterCategory !== "全部") {
      qs = qs.filter((q) => q.category === filterCategory);
    }

    // Simple date range mock logic
    if (filterDateRange === "最近三天") {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      qs = qs.filter((q) => new Date(q.createTime) >= threeDaysAgo);
    } else if (filterDateRange === "最近一周") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      qs = qs.filter((q) => new Date(q.createTime) >= weekAgo);
    }

    if (onlyMyQuestions) {
      qs = qs.filter((q) => q.author === "当前用户" && q.type === 'OPEN');
    }

    if (onlyMyPrivateMessages) {
      qs = qs.filter((q) => 
        q.type === 'PRIVATE' && (q.author === "当前用户" || q.recipientName === "当前用户")
      );
    }

    if (!onlyMyPrivateMessages) {
      qs = qs.filter(q => q.type === 'OPEN' || q.author === "当前用户" || q.recipientName === "当前用户");
    }

    return qs.filter(
      (q) => q.status !== "PENDING_APPROVAL" || config.activeRole === "ADMIN",
    );
  }, [
    questions,
    activeTopicId,
    searchQuery,
    filterCreator,
    filterCategory,
    filterDateRange,
    onlyMyQuestions,
    onlyMyPrivateMessages,
    config.activeRole,
  ]);

  // Categories for filtering
  const categories = [
    "全部",
    "几何建模",
    "断层建模",
    "数值模拟",
    "物性插值",
    "其他",
  ];

  const clearFilters = () => {
    setActiveTopicId(null);
    setSearchQuery("");
    setFilterCreator("");
    setFilterCategory("全部");
    setFilterDateRange("全部");
    setOnlyMyQuestions(false);
    setOnlyMyPrivateMessages(false);
  };

  const selectedQuestion = useMemo(
    () => questions.find((q) => q.id === selectedQuestionId),
    [questions, selectedQuestionId],
  );

  const handleRateReply = (qId: string, rId: string, rating: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === qId) {
          return {
            ...q,
            replies: q.replies.map((r) =>
              r.id === rId ? { ...r, rating } : r,
            ),
          };
        }
        return q;
      }),
    );
  };

  const handlePostReply = () => {
    if (!replyInput || !selectedQuestionId) return;
    const newReply = {
      id: Date.now().toString(),
      questionId: selectedQuestionId,
      author: "当前用户",
      content: replyInput,
      createTime: new Date().toISOString(),
      parentId: replyToId || undefined,
    };
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === selectedQuestionId
          ? { ...q, replies: [...q.replies, newReply] }
          : q,
      ),
    );
    setReplyInput("");
    setReplyToId(null);
  };

  const handleCloseQuestion = () => {
    if (!selectedQuestionId) return;
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === selectedQuestionId
          ? {
              ...q,
              status: "CLOSED",
              isSolved,
              bestReplyId: isSolved ? selectedBestReplyId : undefined,
              closingComment,
            }
          : q,
      ),
    );
    setShowCloseModal(false);
    setClosingComment("");
    setSelectedBestReplyId("");
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm("确定要删除这个问题吗？")) {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      if (selectedQuestionId === id) setSelectedQuestionId(null);
    }
  };

  const handleArchive = () => {
    if (!selectedQuestionId || !archiveReason) return;
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === selectedQuestionId ? { ...q, archiveReason } : q,
      ),
    );
    setShowArchiveModal(false);
    setArchiveReason("");
    alert("已提交至知识库审核，理由：" + archiveReason);
  };

  const hasActiveFilters =
    activeTopicId ||
    searchQuery ||
    filterCreator ||
    filterCategory !== "全部" ||
    filterDateRange !== "全部" ||
    onlyMyQuestions;

  // 模拟自动推荐
  const recommendations = useMemo(() => {
    if (newQuestionTitle.length < 3) return [];
    return questions
      .filter((q) => q.title.includes(newQuestionTitle))
      .slice(0, 3);
  }, [newQuestionTitle, questions]);

  const handleAsk = () => {
    const newQ: CommunityQuestion = {
      id: Date.now().toString(),
      topicId: activeTopicId || "t1",
      category: newQuestionType === 'PRIVATE' ? "交流" : "其他",
      title: newQuestionTitle,
      content: newQuestionContent || "请详细描述您的问题...",
      author: "当前用户",
      createTime: new Date().toISOString(),
      status: newQuestionType === 'PRIVATE' ? "OPEN" : "PENDING_APPROVAL",
      replies: [],
      type: newQuestionType,
      recipientId: selectedRecipientId,
      recipientName: colleaguesArray.find(c => c.id === selectedRecipientId)?.name
    };
    if (newQuestionType === 'PRIVATE' && !selectedRecipientId) {
      alert("请选择接收私信的专家/同事");
      return;
    }
    setQuestions([newQ, ...questions]);
    setNewQuestionTitle("");
    setNewQuestionContent("");
    setNewQuestionType('OPEN');
    setSelectedRecipientId("");
    setShowAskModal(false);
    if (newQuestionType === 'OPEN') {
      alert("已提交提问，请等待管理员审批");
    } else {
      alert("私信已发送");
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-4 animate-in fade-in duration-500 pb-20">
        {/* Search and Advanced Filter Area - Compact Optimized */}
        <div className="bg-white rounded-[1.5rem] border border-slate-200 shadow-sm overflow-hidden p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="搜索全域交流讨论..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all shadow-inner"
              />
            </div>
            <button
              onClick={() => setShowAskModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all active:scale-95 whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              我要提问
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              <input
                type="text"
                placeholder="提问人"
                value={filterCreator}
                onChange={(e) => setFilterCreator(e.target.value)}
                className="bg-transparent border-none outline-none w-24 text-slate-700"
              />
            </div>
            <div className="h-4 w-px bg-slate-100"></div>
            <div className="flex items-center gap-2">
              <TagIcon className="w-3.5 h-3.5" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer text-slate-700"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="h-4 w-px bg-slate-100"></div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <select
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value)}
                className="bg-transparent border-none outline-none cursor-pointer text-slate-700"
              >
                <option value="全部">全部时间段</option>
                <option value="最近三天">最近三天</option>
                <option value="最近一周">最近一周</option>
              </select>
            </div>
            <div className="h-4 w-px bg-slate-100"></div>
            <button
              onClick={() => {
                setOnlyMyPrivateMessages(false);
                setOnlyMyQuestions(!onlyMyQuestions);
              }}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${onlyMyQuestions ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20" : "hover:bg-slate-50 text-slate-400"}`}
            >
              <Star
                className={`w-3.5 h-3.5 ${onlyMyQuestions ? "fill-white" : ""}`}
              />
              <span>我的提问</span>
            </button>
            <div className="h-4 w-px bg-slate-100"></div>
            <button
              onClick={() => {
                setOnlyMyQuestions(false);
                setOnlyMyPrivateMessages(!onlyMyPrivateMessages);
              }}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${onlyMyPrivateMessages ? "bg-purple-600 text-white shadow-sm shadow-purple-500/20" : "hover:bg-slate-50 text-slate-400"}`}
            >
              <Mail
                className={`w-3.5 h-3.5 ${onlyMyPrivateMessages ? "fill-white" : ""}`}
              />
              <span>我的私信</span>
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-auto text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg"
              >
                重置
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        {selectedQuestion ? (
          /* Question Detail View */
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <button
              onClick={() => setSelectedQuestionId(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-widest transition-colors mb-4"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> 返回全域讨论
            </button>

            <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase border border-blue-100">
                      {
                        topics.find((t) => t.id === selectedQuestion.topicId)
                          ?.title
                      }
                    </span>
                    {selectedQuestion.type === 'PRIVATE' && (
                      <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black rounded-lg uppercase border border-purple-100 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> 私信交流
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase border ${selectedQuestion.status === "CLOSED" ? "bg-slate-100 text-slate-500 border-slate-200" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}
                    >
                      {selectedQuestion.status === "CLOSED"
                        ? selectedQuestion.isSolved
                          ? "已解决"
                          : "未解决关闭"
                        : "进行中"}
                    </span>
                  </div>
                  <h1 className="text-3xl font-black text-slate-800 leading-tight">
                    {selectedQuestion.title}
                  </h1>
                </div>
                <div className="flex gap-2">
                  {selectedQuestion.author === "当前用户" &&
                    selectedQuestion.status !== "CLOSED" && (
                      <>
                        <button
                          onClick={() => setShowCloseModal(true)}
                          className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
                        >
                          关闭提问
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteQuestion(selectedQuestion.id)
                          }
                          className="px-6 py-3 bg-white border border-red-100 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all"
                        >
                          删除提问
                        </button>
                      </>
                    )}
                  {config.activeRole === "LIBRARIAN" && (
                    <button
                      onClick={() => setShowArchiveModal(true)}
                      className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center gap-2"
                    >
                      <Layers className="w-4 h-4" /> 收纳知识库
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 py-6 border-y border-slate-50">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200">
                  <User className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-700">
                    {selectedQuestion.author}
                    {selectedQuestion.recipientName && (
                      <span className="text-slate-400 font-bold ml-2">
                        发送给 {selectedQuestion.recipientName}
                      </span>
                    )}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    发布于{" "}
                    {new Date(selectedQuestion.createTime).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                {selectedQuestion.content}
              </div>

              {selectedQuestion.closingComment && (
                <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100">
                  <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" /> 提问结贴点评
                  </h4>
                  <p className="text-sm font-bold text-slate-700 italic">
                    "{selectedQuestion.closingComment}"
                  </p>
                </div>
              )}
            </div>

            {/* Replies Area */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-4">
                专家与用户讨论 ({selectedQuestion.replies.length})
              </h3>

              <div className="space-y-4">
                {selectedQuestion.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`bg-white p-8 rounded-[2.5rem] border transition-all ${selectedQuestion.bestReplyId === reply.id ? "border-emerald-500 shadow-xl shadow-emerald-500/10" : "border-slate-100"}`}
                  >
                    <div className="flex justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-800">
                            {reply.author}
                          </span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                            {new Date(reply.createTime).toLocaleString()}
                          </span>
                        </div>
                        {selectedQuestion.bestReplyId === reply.id && (
                          <span className="ml-2 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded uppercase tracking-tighter flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> 最佳答案
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                          <select
                            value={reply.rating || 0}
                            onChange={(e) =>
                              handleRateReply(
                                selectedQuestion.id,
                                reply.id,
                                parseInt(e.target.value),
                              )
                            }
                            className="text-[10px] font-black bg-slate-50 rounded-lg px-2 py-1 outline-none border-none cursor-pointer"
                          >
                            <option value="0">评级</option>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                              <option key={v} value={v}>
                                {v}分
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => {
                            setReplyToId(reply.id);
                            setReplyInput(`@${reply.author} `);
                          }}
                          className="text-[10px] font-black text-blue-600 uppercase hover:underline"
                        >
                          追加/追问
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed pl-11">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>

              {selectedQuestion.status !== "CLOSED" && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-blue-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 mb-2 px-1">
                    {replyToId ? (
                      <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                        <span className="text-[10px] font-black text-blue-600 uppercase">
                          回复追加中...
                        </span>
                        <button
                          onClick={() => setReplyToId(null)}
                          className="text-blue-400 hover:text-blue-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        发表你的见解或方案
                      </span>
                    )}
                  </div>
                  <textarea
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    placeholder="请提供专业、详实的建议或解决方案..."
                    className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all min-h-[120px]"
                  />
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handlePostReply}
                      className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all active:scale-95"
                    >
                      发布方案
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Topic Sidebar */}
            <div className="w-full md:w-64 space-y-4 shrink-0">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  业务主题导航
                </h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                        setActiveTopicId(null);
                        setOnlyMyQuestions(false);
                        setOnlyMyPrivateMessages(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all border-l-4 ${!activeTopicId && !onlyMyQuestions && !onlyMyPrivateMessages ? "bg-blue-50 text-blue-600 border-blue-600 shadow-sm" : "text-slate-500 border-transparent hover:bg-slate-50"}`}
                  >
                    全域讨论 (全部问题)
                  </button>
                  <button
                    onClick={() => {
                      setActiveTopicId(null);
                      setOnlyMyQuestions(true);
                      setOnlyMyPrivateMessages(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all border-l-4 ${onlyMyQuestions ? "bg-blue-50 text-blue-600 border-blue-600 shadow-sm" : "text-slate-500 border-transparent hover:bg-slate-50"}`}
                  >
                    🚀 我的专属提问
                  </button>
                  <button
                    onClick={() => {
                      setActiveTopicId(null);
                      setOnlyMyQuestions(false);
                      setOnlyMyPrivateMessages(true);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all border-l-4 ${onlyMyPrivateMessages ? "bg-purple-50 text-purple-600 border-purple-600 shadow-sm" : "text-slate-500 border-transparent hover:bg-slate-50"}`}
                  >
                    ✉️ 我的私信交流
                  </button>
                  <div className="py-2 opacity-10">
                    <div className="h-px bg-slate-900 w-full"></div>
                  </div>
                  {topics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => setActiveTopicId(topic.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black transition-all border-l-4 ${activeTopicId === topic.id ? "bg-blue-50 text-blue-600 border-blue-600 shadow-sm" : "text-slate-500 border-transparent hover:bg-slate-50"}`}
                    >
                      {topic.title}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-[2rem] text-white relative overflow-hidden bg-slate-900 shadow-xl shadow-slate-900/20">
                <div className="relative z-10">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">
                    GROW COMMUNITY
                  </p>
                  <h4 className="text-sm font-black mb-4 leading-relaxed">
                    申请专家入驻主题
                    <br />
                    或发起新治理议案？
                  </h4>
                  <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    立即发起申请
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
              </div>
            </div>

            {/* Question List */}
            <div className="flex-1 space-y-4">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="bg-white p-7 rounded-[2.5rem] border border-slate-200 hover:border-blue-200 transition-all group hover:shadow-xl hover:shadow-blue-500/5"
                  >
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded-lg border border-blue-100 uppercase">
                          {topics.find((t) => t.id === q.topicId)?.title}
                        </span>
                        {q.category && (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg border border-emerald-100 uppercase">
                            {q.category}
                          </span>
                        )}
                        {q.status === "PENDING_APPROVAL" && (
                          <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-[9px] font-black rounded-lg border border-orange-100 flex items-center gap-1 uppercase">
                            <AlertCircle className="w-3 h-3" /> 待审批入库
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center gap-1 px-3 py-1 bg-slate-50 rounded-xl">
                          <span className="text-sm font-black text-slate-700">
                            {q.replies.length}
                          </span>
                          <span className="text-[8px] font-black text-slate-400 uppercase italic">
                            讨论
                          </span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-3 group-hover:text-blue-600 cursor-pointer transition-colors leading-tight">
                      {q.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed">
                      {q.content}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-700 leading-none mb-1">
                            {q.author}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {new Date(q.createTime).toLocaleDateString()} ·{" "}
                            <Clock className="inline w-3 h-3 mr-0.5" /> 14:30
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        {config.activeRole === "ADMIN" &&
                          q.status === "PENDING_APPROVAL" && (
                            <>
                              <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-tight shadow-lg shadow-emerald-600/20">
                                <CheckCircle2 className="w-4 h-4" /> 通过
                              </button>
                              <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-red-500 rounded-xl text-[10px] font-black uppercase tracking-tight border border-red-100 hover:bg-red-50">
                                <XCircle className="w-4 h-4" /> 驳回
                              </button>
                            </>
                          )}
                        <button
                          onClick={() => setSelectedQuestionId(q.id)}
                          className="px-6 py-3 bg-slate-900 text-white rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
                        >
                          查看详情 <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white py-32 rounded-[3rem] border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-300">
                  <Search className="w-16 h-16 mb-4 opacity-10" />
                  <p className="text-xs font-black uppercase tracking-[0.3em]">
                    未匹配到相关提问
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-[10px] font-black text-blue-600 uppercase border-b-2 border-blue-600"
                  >
                    重置搜索条件
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Close Question Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl relative border border-white/20">
            <h2 className="text-xl font-black text-slate-800 mb-6">关闭提问</h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">
                  问题是否已解决？
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsSolved(true)}
                    className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase transition-all ${isSolved ? "bg-emerald-600 text-white" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
                  >
                    已解决
                  </button>
                  <button
                    onClick={() => setIsSolved(false)}
                    className={`flex-1 py-4 rounded-2xl font-black text-xs uppercase transition-all ${!isSolved ? "bg-orange-600 text-white" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
                  >
                    未解决关闭
                  </button>
                </div>
              </div>

              {isSolved && (
                <div className="space-y-4 animate-in slide-in-from-top duration-300">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">
                      选择最佳答案 (按评分排序)
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                      {selectedQuestion?.replies
                        .slice()
                        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                        .map((reply) => (
                          <button
                            key={reply.id}
                            onClick={() => setSelectedBestReplyId(reply.id)}
                            className={`w-full text-left p-4 rounded-xl text-xs font-bold transition-all border ${selectedBestReplyId === reply.id ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100"}`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[9px] font-black uppercase text-slate-400">
                                {reply.author}
                              </span>
                              <span className="text-[9px] font-black text-orange-500">
                                {reply.rating || 0} 分
                              </span>
                            </div>
                            <p className="line-clamp-1 opacity-70 italic">
                              "{reply.content}"
                            </p>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">
                  结贴点评/理由
                </label>
                <textarea
                  value={closingComment}
                  onChange={(e) => setClosingComment(e.target.value)}
                  placeholder={
                    isSolved
                      ? "请对最佳答案进行点评..."
                      : "为什么要关闭该问题？"
                  }
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold min-h-[100px] outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  onClick={() => setShowCloseModal(false)}
                  className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleCloseQuestion}
                  disabled={
                    (isSolved && !selectedBestReplyId) || !closingComment
                  }
                  className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/30 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
                >
                  确认关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Archive Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl relative border border-white/20">
            <h2 className="text-xl font-black text-slate-800 mb-6">
              审核通过：一键收纳知识库
            </h2>
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-8">
              <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                收纳后，该问答将作为正式文档存入“石工知识广场”，供全域检索学习。
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">
                  知识收纳理由/推荐词
                </label>
                <textarea
                  value={archiveReason}
                  onChange={(e) => setArchiveReason(e.target.value)}
                  placeholder="请给出收纳理由，如：该方案解决了跨断层建模中常见的Pillar对齐问题，具有高度通用性。"
                  className="w-full bg-slate-50 border-none rounded-2xl p-6 text-sm font-bold min-h-[150px] outline-none shadow-inner"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowArchiveModal(false)}
                  className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
                >
                  暂不收纳
                </button>
                <button
                  onClick={handleArchive}
                  disabled={!archiveReason}
                  className="px-10 py-4 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-emerald-500/30 hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50"
                >
                  确认并收纳
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ask Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl relative border border-white/20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">
                  发起业务提问
                </h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Initiating Discussion
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block px-1">
                  问题核心标题
                </label>
                <input
                  type="text"
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  placeholder="例如：Petrel 2023 中如何实现跨断层物性插值？"
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>

              {recommendations.length > 0 && (
                <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 animate-in slide-in-from-top duration-300">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />{" "}
                    知识库智能匹配：类似问题已存在
                  </h4>
                  <div className="space-y-3">
                    {recommendations.map((r) => (
                      <div
                        key={r.id}
                        className="text-xs font-bold text-slate-700 hover:text-blue-600 cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-blue-300" />{" "}
                          {r.title}
                        </div>
                        <span className="text-[9px] font-black text-blue-400 group-hover:underline uppercase tracking-tighter">
                          查阅已有回复
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-10">
                <button
                  onClick={() => setShowAskModal(false)}
                  className="px-8 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
                >
                  取消返回
                </button>
                <button
                  onClick={handleAsk}
                  disabled={!newQuestionTitle}
                  className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50"
                >
                  提交审核入库
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl relative border border-white/20">
            <button
              onClick={() => setShowAskModal(false)}
              className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-blue-600" /> 发起新讨论 / 私信
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4 p-1 bg-slate-50 rounded-2xl">
                <button
                  onClick={() => setNewQuestionType('OPEN')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newQuestionType === 'OPEN' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  🌐 开放性问题
                </button>
                <button
                  onClick={() => setNewQuestionType('PRIVATE')}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newQuestionType === 'PRIVATE' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  🔒 私信特定专家
                </button>
              </div>

              {newQuestionType === 'PRIVATE' && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">选择接收人</label>
                  <div className="grid grid-cols-3 gap-3">
                    {colleaguesArray.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setSelectedRecipientId(c.id)}
                        className={`p-3 rounded-2xl border text-left transition-all ${selectedRecipientId === c.id ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500/10' : 'border-slate-100 bg-slate-50 hover:bg-slate-100'}`}
                      >
                        <p className="text-xs font-black text-slate-700">{c.name}</p>
                        <p className="text-[9px] font-bold text-slate-400">{c.department}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">主题 / 标题</label>
                <input
                  type="text"
                  placeholder="一句话描述您的疑问..."
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-none ring-4 ring-transparent focus:ring-blue-500/5 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">详细描述</label>
                <textarea
                  placeholder="详情背景信息、报错截图描述等..."
                  value={newQuestionContent}
                  onChange={(e) => setNewQuestionContent(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium outline-none h-32 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowAskModal(false)}
                  className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl"
                >
                  取消
                </button>
                <button
                  onClick={handleAsk}
                  className={`px-12 py-4 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${newQuestionType === 'PRIVATE' ? 'bg-purple-600 shadow-purple-600/20 hover:bg-purple-500' : 'bg-blue-600 shadow-blue-600/20 hover:bg-blue-500'}`}
                >
                  {newQuestionType === 'PRIVATE' ? '发送私信' : '提交提问'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommunityForum;
