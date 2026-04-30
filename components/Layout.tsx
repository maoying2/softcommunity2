import React, { useState, useContext } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Search,
  Bell,
  Settings,
  Database,
  Trophy,
  X,
  Check,
  Eye,
  UserCircle,
  ShieldAlert,
  Layers,
  MousePointer2,
  GraduationCap,
  MessagesSquare,
  FolderDown,
  Headphones,
  HelpCircle,
  Library,
  FolderTree,
} from "lucide-react";
import { AppSection, UserRole } from "../types";
import { ThemeContext } from "../App";

interface LayoutProps {
  children: React.ReactNode;
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activeSection,
  setActiveSection,
}) => {
  const { config } = useContext(ThemeContext);

  const adminSubItems = [
    { id: AppSection.KnowledgeAdmin, label: "知识管理", icon: BookOpen },
    { id: AppSection.IssueAdmin, label: "问题管理", icon: ShieldAlert },
    { id: AppSection.QAAdmin, label: "问答管理", icon: Database },
    { id: AppSection.LLMAdmin, label: "大模型管理", icon: Settings },
  ];

  const navItems = [
    { id: AppSection.KnowledgeMap, label: "知识地图", icon: Library },
    { id: AppSection.Community, label: "主题交流", icon: MessagesSquare },
    { id: AppSection.AIAssistant, label: "智能问答", icon: Database },
    {
      id: AppSection.KnowledgeAdmin,
      label: "管理后台",
      icon: LayoutDashboard,
      subItems: adminSubItems,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-600">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter">PetroPro</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item: any) => (
            <div key={item.id} className="space-y-1">
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all ${
                  activeSection === item.id ||
                  item.subItems?.some((sub: any) => sub.id === activeSection)
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-bold text-sm">{item.label}</span>
              </button>

              {/* Secondary Menu */}
              {(activeSection === item.id ||
                item.subItems?.some((sub: any) => sub.id === activeSection)) &&
                item.subItems && (
                  <div className="pl-6 space-y-1 animate-in slide-in-from-top-2 duration-300">
                    {item.subItems.map((sub: any) => (
                      <button
                        key={sub.id}
                        onClick={() => setActiveSection(sub.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                          activeSection === sub.id
                            ? "bg-blue-500/20 text-blue-400 font-bold"
                            : "text-slate-500 hover:bg-slate-800 hover:text-slate-300"
                        }`}
                      >
                        <sub.icon className="w-4 h-4" />
                        <span className="text-xs">{sub.label}</span>
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </nav>

        <div className="p-6">
          <div className="bg-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <img
                src={`https://picsum.photos/seed/${config.activeRole}/80/80`}
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
              <div>
                <p className="text-xs font-bold">
                  {config.activeRole === "EXPERT" ? "张首席专家" : "李工程师"}
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-black">
                  LV.{config.activeRole === "EXPERT" ? "12" : "2"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="全站搜索：软件、问题、大纲、专家..."
                className="w-full bg-slate-100 border-none pl-12 pr-4 py-2 text-sm rounded-xl"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <button className="flex items-center gap-2 text-slate-700">
              <Headphones className="w-5 h-5" />
              <span className="text-sm font-bold">专家坐席</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
