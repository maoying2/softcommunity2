import React, { useState } from "react";
import { Trash2, Library, CheckCircle2, BookOpen } from "lucide-react";

interface AddKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const AddKnowledgeModal: React.FC<AddKnowledgeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-emerald-600 text-white">
          <div>
            <h2 className="text-xl font-black">录入新知识</h2>
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1">
              Create New Knowledge Article
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          {/* 基础分类 */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                专业领域
              </label>
              <select className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold p-3 outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option>物探</option>
                <option>地质</option>
                <option>工程</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                关联软件
              </label>
              <select className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold p-3 outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option>Petrel</option>
                <option>Eclipse</option>
                <option>Techlog</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                知识规格
              </label>
              <select className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold p-3 outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option>操作手册</option>
                <option>排错指南</option>
                <option>专家心法</option>
              </select>
            </div>
          </div>

          {/* 业务主题 & 自定义分类 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                关联业务主题
              </label>
              <select className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold p-3 outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option>无关联</option>
                <option>Petrel 自动化脚本开发</option>
                <option>OSDU 平台对接标准</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                自定义分类
              </label>
              <input
                type="text"
                placeholder="输入或选择分类"
                className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold p-3 outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* 知识名称 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              知识项名称
            </label>
            <input
              type="text"
              placeholder="输入清晰的标题，例如：关于Petrel断层建模的参数优化方案"
              className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold p-3 outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* 标签 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              标签索引 (逗号分隔)
            </label>
            <input
              type="text"
              placeholder="断层, 建模, 自动化"
              className="w-full bg-slate-50 border-none rounded-xl text-xs font-bold p-3 outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* 内容 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
              核心内容 (Markdown 或 文本)
            </label>
            <textarea
              rows={6}
              className="w-full bg-slate-50 border-none rounded-2xl text-xs font-bold p-4 outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
              placeholder="在此录入知识正文..."
            ></textarea>
          </div>

          {/* 附件上传模拟 */}
          <div className="p-6 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:bg-slate-50 transition-all cursor-pointer">
            <Library className="w-8 h-8" />
            <p className="text-[10px] font-black uppercase">
              上传相关附件或技术大纲 (Max 50MB)
            </p>
          </div>
        </div>
        <div className="p-8 border-t border-slate-50 flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-3 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 transition-all"
          >
            取消录入
          </button>
          <button
            onClick={() => {
              onSubmit({});
              onClose();
            }}
            className="px-10 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20"
          >
            提交通知发布
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddKnowledgeModal;
