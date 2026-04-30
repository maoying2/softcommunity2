import React, { useContext } from "react";
import {
  PlayCircle,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Star,
  Trophy,
  ArrowRight,
  User,
} from "lucide-react";
import { ThemeContext } from "../App";

const LearningCenter: React.FC = () => {
  const { config } = useContext(ThemeContext);

  const paths = [
    {
      id: "p1",
      software: "Petrel",
      title: "零基础：从导入地震到首个地质模型",
      level: "入门",
      duration: "45 小时",
      enrolled: 1245,
      rating: 4.9,
      instructor: "陈工程师",
      modules: [
        { name: "工程项目初始化与数据索引", status: "completed" },
        { name: "地震数据导入与层位初判", status: "current" },
        { name: "断层识别与面模型构建", status: "pending" },
        { name: "构造网格划分(Pillar Gridding)", status: "pending" },
        { name: "属性模型填充与结果展示", status: "pending" },
      ],
    },
    {
      id: "p2",
      software: "Eclipse",
      title: "油藏数值模拟基础：单井拟合全流程",
      level: "进阶",
      duration: "30 小时",
      enrolled: 850,
      rating: 4.7,
      instructor: "Dr. Wang",
      modules: [
        { name: "相行为(PVT)参数设定", status: "pending" },
        { name: "SCAL 特征曲线导入", status: "pending" },
        { name: "历史拟合自动调参技巧", status: "pending" },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            新手加油站
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-2 uppercase tracking-widest">
            学习路径大纲 • 结构化成长
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">
                已获得证书
              </p>
              <p className="text-sm font-black text-slate-700">3 份</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {paths.map((path) => (
          <div
            key={path.id}
            className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col lg:flex-row"
          >
            <div className="lg:w-1/3 bg-slate-50 p-10 flex flex-col justify-between border-r border-slate-100">
              <div>
                <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
                  {path.software}
                </span>
                <h3 className="text-2xl font-black text-slate-900 leading-tight mb-4">
                  {path.title}
                </h3>
                <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-8">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {path.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    {path.enrolled} 人在学
                  </span>
                  <span className="flex items-center gap-1.5 text-orange-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {path.rating}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={`https://picsum.photos/seed/${path.instructor}/60/60`}
                  className="w-10 h-10 rounded-full grayscale"
                />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold">
                    路径设计专家
                  </p>
                  <p className="text-sm font-black text-slate-700">
                    {path.instructor}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3 p-10 flex flex-col justify-between">
              <div className="space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
                  学习进度索引
                </p>
                {path.modules.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${m.status === "current" ? "bg-blue-50 border border-blue-100" : "bg-slate-50/50"}`}
                  >
                    {m.status === "completed" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : m.status === "current" ? (
                      <PlayCircle className="w-5 h-5 text-blue-600 animate-pulse" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                    <span
                      className={`text-sm font-bold flex-1 ${m.status === "pending" ? "text-slate-400" : "text-slate-700"}`}
                    >
                      {m.name}
                    </span>
                    <button
                      className={`text-[10px] font-black uppercase ${m.status === "pending" ? "hidden" : "text-blue-600"}`}
                    >
                      {m.status === "completed" ? "回顾" : "继续"}
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="mt-10 w-full py-4 text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                style={{ backgroundColor: config.primaryColor }}
              >
                立即开始今日练习
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningCenter;
