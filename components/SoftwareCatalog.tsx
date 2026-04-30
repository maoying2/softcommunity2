import React, { useState } from "react";
import { Star, Download, ExternalLink, Filter } from "lucide-react";
import { Software } from "../types";

const mockSoftware: Software[] = [
  {
    id: "1",
    name: "Petrel",
    category: "地学建模",
    description: "勘探开发集成平台，提供端到端的工作流解决方案。",
    version: "2023.2",
    rating: 4.8,
    users: 15000,
    tags: ["地震解释", "地质建模"],
    imageUrl: "https://picsum.photos/seed/petrel/400/250",
  },
  {
    id: "2",
    name: "Eclipse",
    category: "油气开发",
    description: "行业标准的油藏数值模拟器，支持复杂的油气藏模型。",
    version: "2022.1",
    rating: 4.9,
    users: 12000,
    tags: ["数值模拟", "油藏工程"],
    imageUrl: "https://picsum.photos/seed/eclipse/400/250",
  },
  {
    id: "3",
    name: "Landmark DecisionSpace",
    category: "物探勘探",
    description: "全生命周期的勘探开发协同软件。",
    version: "10.5",
    rating: 4.5,
    users: 8000,
    tags: ["井位规划", "成图"],
    imageUrl: "https://picsum.photos/seed/landmark/400/250",
  },
  {
    id: "4",
    name: "HYSYS",
    category: "炼油化工",
    description: "流程模拟与优化软件，广泛用于下游工程设计。",
    version: "V12.1",
    rating: 4.6,
    users: 9500,
    tags: ["化工流程", "模拟"],
    imageUrl: "https://picsum.photos/seed/hysys/400/250",
  },
];

const SoftwareCatalog: React.FC = () => {
  const [filter, setFilter] = useState<string>("全部");
  const categories = [
    "全部",
    "物探勘探",
    "钻完井",
    "油气开发",
    "炼油化工",
    "地学建模",
  ];

  const filteredSoftware =
    filter === "全部"
      ? mockSoftware
      : mockSoftware.filter((s) => s.category === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">软件目录</h1>
          <p className="text-slate-500 text-sm">
            浏览石油行业主流专业软件，获取手册及协作脚本。
          </p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 mr-2" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === cat
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSoftware.map((software) => (
          <div
            key={software.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all group hover:-translate-y-1"
          >
            <div className="relative h-44 overflow-hidden">
              <img
                src={software.imageUrl}
                alt={software.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-4 text-white font-bold text-lg">
                {software.name}
              </div>
              <div className="absolute top-3 right-3 bg-orange-500 px-2 py-1 rounded text-[10px] font-bold text-white uppercase shadow-lg">
                V{software.version}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  {software.category}
                </span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-bold text-slate-700">
                    {software.rating}
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-600 line-clamp-2 mb-6 h-10 leading-relaxed">
                {software.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {software.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] bg-slate-50 text-slate-500 px-2 py-1 rounded border border-slate-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-sm">
                  <ExternalLink className="w-4 h-4" />
                  查看手册
                </button>
                <button className="p-2.5 bg-orange-50 text-orange-600 rounded-xl hover:bg-orange-100 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoftwareCatalog;
