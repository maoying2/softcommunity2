import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
// Fix: Added Trophy to the lucide-react imports
import {
  TrendingUp,
  Users,
  FileText,
  ArrowRight,
  Lightbulb,
  Map,
  Trophy,
} from "lucide-react";

const data = [
  { name: "Petrel", usage: 4500 },
  { name: "Eclipse", usage: 3200 },
  { name: "Landmark", usage: 2800 },
  { name: "Paradigm", usage: 2100 },
  { name: "Kingdom", usage: 1800 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">知识广场概览</h1>
          <p className="text-slate-500 text-sm">
            欢迎回来，今天有 3 个新项目符合您的专业兴趣。
          </p>
        </div>
        <div className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
          2023年10月24日
        </div>
      </div>

      {/* 新友引导 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-2xl text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              新手入场指南
            </h2>
            <p className="text-orange-50 opacity-90 text-sm mb-4 max-w-sm">
              如果您是石油软件新手，我们准备了 5
              个核心软件的快速上手路径及全套基础模板。
            </p>
            <button className="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-orange-50 transition-colors shadow-md">
              开启学习之旅
            </button>
          </div>
          <Map className="absolute -right-10 -bottom-10 w-48 h-48 text-white/10 rotate-12" />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800">本周技术积分排行</h2>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <div className="space-y-3">
            {[
              { name: "李工程师", score: 1240, rank: 1 },
              { name: "Sarah J.", score: 1150, rank: 2 },
              { name: "陈博士", score: 980, rank: 3 },
            ].map((user, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i === 0 ? "bg-yellow-400 text-yellow-900" : "bg-slate-100 text-slate-500"}`}
                  >
                    {user.rank}
                  </span>
                  <span className="font-medium text-slate-700">
                    {user.name}
                  </span>
                </div>
                <span className="text-slate-500 font-bold">
                  {user.score} pts
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 软件人气排行 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-6 text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            热门软件协同指数
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="usage"
                  fill="#f97316"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 广场动态 */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              最新成果分享
            </h2>
            <button className="text-orange-600 text-sm font-medium hover:underline">
              查看全部
            </button>
          </div>
          <div className="space-y-4 flex-1">
            {[
              {
                tag: "教程",
                title: "Petrel 复杂断裂建模：从入门到精通系列视频",
                author: "陆工",
                time: "10分钟前",
              },
              {
                tag: "工具",
                title: "开源！基于 Python 的井斜自动计算脚本",
                author: "王研究员",
                time: "1小时前",
              },
              {
                tag: "讨论",
                title: "关于 OSDU 平台在生产环境下的性能瓶颈探讨",
                author: "李博士",
                time: "3小时前",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer border border-transparent hover:border-slate-100"
              >
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.tag === "教程"
                      ? "bg-blue-100 text-blue-600"
                      : item.tag === "工具"
                        ? "bg-green-100 text-green-600"
                        : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {item.tag}
                </span>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-700">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.author}
                    </span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] text-slate-400">
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
