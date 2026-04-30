import React, { useState, useContext } from "react";
import {
  Star,
  GitBranch,
  Plus,
  Filter,
  Award,
  ArrowRight,
  FolderGit2,
  Users,
  LayoutGrid,
  Clock,
  FlaskConical,
  Target,
  X,
  ShieldAlert,
  Calendar,
} from "lucide-react";
import { ProjectRepo, CollabTask } from "../types";
import { ThemeContext } from "../App";

// Added missing authorRole property to repos array items to match ProjectRepo interface
const repos: ProjectRepo[] = [
  {
    id: "r1",
    name: "Tarim-S-Seismic-Workflow",
    author: "Petro_Team_A",
    authorRole: "EXPERT",
    description: "塔里木盆地三叠系地震属性解释及断层自动追踪工作流。",
    stars: 456,
    forks: 124,
    points: 50,
    lastUpdate: "2小时前",
    language: "Petrel Workflow",
    type: "工作流",
  },
  {
    id: "r2",
    name: "Auto-Log-Corrector-V3",
    author: "OpenLab",
    authorRole: "USER",
    description: "基于神经网络的测井曲线自动校正工具，支持 LAS 和 DLIS。",
    stars: 212,
    forks: 56,
    points: 30,
    lastUpdate: "昨天",
    language: "Python",
    type: "插件脚本",
  },
];

const tasks: CollabTask[] = [
  {
    id: "t1",
    title: "复杂断块区三维地质建模标准流共建",
    initiator: "地质张博士",
    status: "组队中",
    neededSkills: ["构造建模", "沉积相分析"],
    software: ["Petrel", "RMS"],
    participants: 2,
    maxParticipants: 5,
    rewardPoints: 500,
    difficulty: "专家级",
    description:
      "针对准噶尔盆地某复杂区块，协同建立一套可复用的断块区建模标准，需要物探专业配合进行地震驱动建模。",
  },
  {
    id: "t2",
    title: "CO2驱数值模拟自动历史拟合脚本开发",
    initiator: "油藏工程师-小李",
    status: "进行中",
    neededSkills: ["Python驱动", "数值模拟"],
    software: ["Eclipse", "Python"],
    participants: 3,
    maxParticipants: 3,
    rewardPoints: 300,
    difficulty: "进阶",
    description:
      "目前已完成基础模型，需协作优化 GA 算法的收敛速度，提高拟合效率。",
  },
];

const CollaborationSpace: React.FC = () => {
  const { config } = useContext(ThemeContext);
  const [viewMode, setViewMode] = useState<"gallery" | "tasks">("gallery");
  const [selectedTask, setSelectedTask] = useState<CollabTask | null>(null);

  const cardClass = `bg-white border border-slate-200 transition-all shadow-sm group cursor-pointer relative flex flex-col justify-between hover:shadow-xl rounded-${config.borderRadius}`;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 模态框：任务详情 */}
      {selectedTask && (
        <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            className={`bg-white shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative rounded-${config.borderRadius}`}
          >
            <button
              onClick={() => setSelectedTask(null)}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
            <div className={`p-8 border-b border-slate-100 bg-slate-50`}>
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {selectedTask.title}
              </h2>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {selectedTask.description}
              </p>
              <button
                className="w-full py-4 text-white font-black text-sm rounded-2xl shadow-xl transition-all"
                style={{ backgroundColor: config.primaryColor }}
              >
                提交加入申请
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            协同工作空间
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            成果分享驱动交流，协同任务串联专业。
          </p>
        </div>

        <div className="bg-slate-200/50 p-1.5 rounded-2xl flex gap-1 self-start shadow-inner">
          <button
            onClick={() => setViewMode("gallery")}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black transition-all ${viewMode === "gallery" ? "bg-white shadow-sm" : "text-slate-500"}`}
            style={viewMode === "gallery" ? { color: config.primaryColor } : {}}
          >
            <LayoutGrid className="w-4 h-4" />
            成果分享
          </button>
          <button
            onClick={() => setViewMode("tasks")}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black transition-all ${viewMode === "tasks" ? "bg-white shadow-sm" : "text-slate-500"}`}
            style={viewMode === "tasks" ? { color: config.primaryColor } : {}}
          >
            <FlaskConical className="w-4 h-4" />
            协同实验室
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <div
            className={`bg-white p-6 border border-slate-200 shadow-sm rounded-${config.borderRadius}`}
          >
            <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2 text-sm">
              <Target
                className="w-4 h-4"
                style={{ color: config.primaryColor }}
              />
              我的协作状态
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-wider">
                  协作信用分
                </span>
                <span className="text-blue-600">845 / 1000</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[85%]"></div>
              </div>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {viewMode === "gallery" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {repos.map((repo) => (
                <div key={repo.id} className={cardClass}>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <FolderGit2 className="w-5 h-5 text-slate-400" />
                        <h3 className="text-md font-black text-slate-800 truncate max-w-[140px] tracking-tight">
                          {repo.name}
                        </h3>
                      </div>
                      {config.showPoints && (
                        <div
                          className="px-3 py-1 rounded-full text-[10px] font-black border"
                          style={{
                            color: config.primaryColor,
                            backgroundColor: `${config.primaryColor}10`,
                            borderColor: `${config.primaryColor}30`,
                          }}
                        >
                          {repo.points} PTS
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-6 leading-relaxed font-medium line-clamp-2">
                      {repo.description}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 pt-4 border-t border-slate-50">
                      <span className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <GitBranch className="w-3.5 h-3.5" />
                        {repo.forks}
                      </span>
                      <span className="ml-auto text-slate-300 font-bold uppercase tracking-widest">
                        {repo.lastUpdate}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div
                className={`border-2 border-dashed border-slate-200 rounded-${config.borderRadius} flex flex-col items-center justify-center p-8 hover:bg-white hover:border-orange-300 transition-all group cursor-pointer min-h-[180px]`}
              >
                <Plus className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm font-black text-slate-800 tracking-tight">
                  上传技术成果
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div
                className={`p-8 text-white flex items-center justify-between shadow-2xl relative overflow-hidden rounded-${config.borderRadius}`}
                style={{ backgroundColor: "#0f172a" }}
              >
                <div className="relative z-10">
                  <h3 className="text-xl font-black tracking-tight">
                    发起协同，攻克难题
                  </h3>
                  <button
                    className="mt-6 px-8 py-3 rounded-2xl font-black text-xs shadow-lg transition-all active:scale-95"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    创建协作实验室计划
                  </button>
                </div>
                <FlaskConical className="w-32 h-32 text-white/5 absolute -right-4 -bottom-4 rotate-12" />
              </div>

              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={cardClass}
                >
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`text-[10px] font-black px-2 py-1 rounded-lg border uppercase ${task.difficulty === "专家级" ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-50 text-slate-500 border-slate-100"}`}
                      >
                        {task.difficulty}
                      </span>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-orange-600 transition-colors">
                        {task.title}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-8 font-medium line-clamp-2">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                          {task.participants} / {task.maxParticipants} 成员
                        </span>
                      </div>
                      <button
                        className="flex items-center gap-2 font-black text-xs group-hover:translate-x-1 transition-all"
                        style={{ color: config.primaryColor }}
                      >
                        查看详情 <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborationSpace;
