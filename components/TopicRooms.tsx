import React, { useState } from "react";
import {
  Search,
  Filter,
  MessageSquare,
  User,
  ChevronRight,
  ArrowLeft,
  Send,
  Heart,
  MessagesSquare,
  Info,
  Users,
} from "lucide-react";

const TopicRooms: React.FC = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const rooms = [
    {
      id: "r1",
      software: "Petrel",
      version: "2024.1",
      module: "地质建模",
      title: "复杂断块区三维建模实操",
      active: 45,
      host: "张专家",
    },
    {
      id: "r2",
      software: "Eclipse",
      version: "2022",
      module: "数值模拟",
      title: "海上平台稠油热采拟合",
      active: 32,
      host: "陈工",
    },
    {
      id: "r3",
      software: "Landmark",
      version: "V10",
      module: "地震解释",
      title: "DecisionSpace 自动层位追踪",
      active: 18,
      host: "Sarah",
    },
  ];

  if (selectedRoom) {
    const room = rooms.find((r) => r.id === selectedRoom);
    return (
      <div className="max-w-5xl mx-auto animate-in slide-in-from-right-4 duration-500">
        <button
          onClick={() => setSelectedRoom(null)}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-800 font-bold mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> 返回主题大厅
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">
                  {room?.software} {room?.version}
                </span>
                <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-3 py-1 rounded-full uppercase tracking-widest">
                  {room?.module}
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 mb-6">
                {room?.title}
              </h1>
              <div className="flex items-center gap-4 text-xs text-slate-500 font-bold pb-8 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <img
                    src={`https://picsum.photos/seed/${room?.host}/40/40`}
                    className="w-8 h-8 rounded-full"
                  />
                  <span>主讲专家：{room?.host}</span>
                </div>
                <span>•</span>
                <span>{room?.active} 人正在研讨</span>
              </div>

              {/* 帖子/讨论内容 */}
              <div className="pt-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src="https://picsum.photos/seed/user1/40/40"
                      className="w-10 h-10 rounded-xl"
                    />
                    <div className="flex-1 bg-slate-50 p-6 rounded-2xl rounded-tl-none border border-slate-100">
                      <p className="text-sm font-bold text-slate-800 mb-2 italic text-blue-600">
                        @李工 提问：
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        请问在 Petrel 2024
                        中，对于大落差断层的多点统计学建模，如何保证相带在断线两侧的连续性？
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 pl-12">
                    <img
                      src={`https://picsum.photos/seed/${room?.host}/40/40`}
                      className="w-10 h-10 rounded-xl"
                    />
                    <div className="flex-1 bg-white p-6 rounded-2xl rounded-tl-none border border-blue-200 shadow-sm">
                      <p className="text-sm font-black text-slate-800 mb-2">
                        专家 {room?.host} 回复：
                      </p>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        建议开启断层“非连接对齐”选项，并在训练图中明确定义垂直断层的转移概率矩阵...
                      </p>
                      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-6">
                        <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-red-500">
                          <Heart className="w-3.5 h-3.5" /> 12 赞同
                        </button>
                        <button className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-blue-600">
                          <MessagesSquare className="w-3.5 h-3.5" /> 回复
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 输入框 */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-200 flex gap-4 items-center">
              <input
                type="text"
                placeholder="发表你的看法 or 向专家提问..."
                className="flex-1 bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button className="p-3 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" /> 房间公告
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                本讨论区专注 Petrel 2024 建模避坑。禁止发布 Crack
                资源，所有结论将自动归档至企业智库。
              </p>
            </div>
            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
              <User className="w-4 h-4" /> 开启专家私聊
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            主题研讨厅
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            按软件版本和业务模块精准切入，解决具体问题。
          </p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜软件、模块或专家..."
              className="bg-white border-slate-200 border pl-12 pr-4 py-3 rounded-2xl text-sm w-64 shadow-sm"
            />
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20">
            发起新主题
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => setSelectedRoom(room.id)}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-blue-500 hover:shadow-2xl transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-black bg-slate-900 text-white px-3 py-1 rounded-full uppercase tracking-widest">
                {room.software}
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {room.module}
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-6 group-hover:text-blue-600 transition-colors leading-tight">
              {room.title}
            </h3>
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <img
                  src={`https://picsum.photos/seed/${room.host}/40/40`}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  {room.host}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-600 text-[10px] font-black uppercase">
                <Users className="w-3.5 h-3.5" /> {room.active} 人在线
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicRooms;
