import React from 'react';
import { Download, Trash2, Upload, FileType, Settings, Layout, Edit3, Eye } from 'lucide-react';
import { ViewMode, StyleMode } from '../types';

interface ToolbarProps {
  onExport: () => void;
  onClear: () => void;
  onFileUpload: (file: File) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  styleMode: StyleMode;
  setStyleMode: (mode: StyleMode) => void;
  isExporting: boolean;
  onOpenSettings: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onExport, 
  onClear, 
  onFileUpload, 
  viewMode, 
  setViewMode,
  styleMode,
  setStyleMode,
  isExporting,
  onOpenSettings
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const ViewIcon = {
    [ViewMode.Edit]: Edit3,
    [ViewMode.Split]: Layout,
    [ViewMode.Preview]: Eye
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20 transition-all duration-300">
      {/* Brand Area */}
      <div className="flex items-center gap-3 select-none">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
          <span className="text-white font-bold text-lg font-serif">M</span>
        </div>
        <div className="hidden sm:block">
          <h1 className="text-base font-bold text-gray-800 tracking-tight">Markdown<span className="text-indigo-600">Pro</span></h1>
        </div>
      </div>

      {/* Center Controls - View Mode */}
      <div className="hidden md:flex bg-gray-100/50 p-1 rounded-xl border border-gray-200/50">
        {[ViewMode.Edit, ViewMode.Split, ViewMode.Preview].map((mode) => {
          const Icon = ViewIcon[mode];
          const isActive = viewMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`
                px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}
              `}
            >
              <Icon className="w-3.5 h-3.5" />
              {mode === ViewMode.Edit && '编辑'}
              {mode === ViewMode.Split && '分栏'}
              {mode === ViewMode.Preview && '预览'}
            </button>
          )
        })}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Style Selector */}
        <div className="group relative flex items-center">
          <div className="flex items-center bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg px-2 py-1.5 border border-transparent hover:border-gray-200 cursor-pointer">
            <FileType className="w-4 h-4 text-gray-500 mr-2" />
            <select 
              value={styleMode} 
              onChange={(e) => setStyleMode(e.target.value as StyleMode)}
              className="bg-transparent text-xs sm:text-sm text-gray-700 font-medium focus:ring-0 border-none pr-6 cursor-pointer outline-none appearance-none w-24 sm:w-auto"
            >
              <option value={StyleMode.Standard}>标准文档</option>
              <option value={StyleMode.Official}>公文排版</option>
            </select>
            {styleMode === StyleMode.Official && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenSettings();
                }}
                className="ml-1 p-1 text-indigo-500 hover:bg-indigo-100 rounded-md transition-all"
                title="公文设置"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

        <input type="file" ref={fileInputRef} accept=".md,.txt" className="hidden" onChange={handleFileChange} />
        
        <button onClick={() => fileInputRef.current?.click()} className="icon-btn text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-colors" title="导入">
          <Upload className="w-4.5 h-4.5" />
        </button>

        <button onClick={onClear} className="icon-btn text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="清空">
          <Trash2 className="w-4.5 h-4.5" />
        </button>

        <button 
          onClick={onExport}
          disabled={isExporting}
          className={`
            ml-1 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5
            ${isExporting ? 'bg-indigo-400 cursor-wait' : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-indigo-300'}
          `}
        >
          {isExporting ? (
             <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">导出</span>
        </button>
      </div>
    </header>
  );
};

export default Toolbar;