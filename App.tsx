import React, { useState, useEffect, useCallback } from 'react';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import GongwenSettingsModal from './components/GongwenSettingsModal';
import { ViewMode, StyleMode, DEFAULT_MARKDOWN, GongwenConfig, GONGWEN_PRESETS } from './types';
import { generateDocx } from './utils/exportService';

const App: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Split);
  const [styleMode, setStyleMode] = useState<StyleMode>(StyleMode.Standard);
  const [gongwenConfig, setGongwenConfig] = useState<GongwenConfig>(GONGWEN_PRESETS.default);
  const [isExporting, setIsExporting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && viewMode === ViewMode.Split) {
        setViewMode(ViewMode.Edit);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const getDocumentTitle = (content: string): string => {
    const match = content.match(/^#\s+(.+)$/m);
    if (match && match[1]) {
      return match[1].trim().replace(/[\\/:*?"<>|]/g, '');
    }
    return '公文文档';
  };

  const handleExport = async () => {
    if (!markdown.trim()) {
      alert('内容为空，无法导出。');
      return;
    }
    setIsExporting(true);
    try {
      const title = getDocumentTitle(markdown);
      const date = new Date().toISOString().slice(0, 10);
      const fileName = `${title}-${date}.docx`;
      await generateDocx(markdown, fileName, styleMode, gongwenConfig);
      setTimeout(() => setIsExporting(false), 500);
    } catch (error) {
      console.error(error);
      alert('导出失败，请重试。');
      setIsExporting(false);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) setMarkdown(content);
    };
    reader.readAsText(file);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        handleFileUpload(file);
      }
    }
  }, []);

  return (
    <div 
      className="flex flex-col h-screen bg-[#F3F4F6] text-gray-800 font-sans overflow-hidden"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <Toolbar 
        onExport={handleExport}
        onClear={() => setMarkdown('')}
        onFileUpload={handleFileUpload}
        viewMode={viewMode}
        setViewMode={setViewMode}
        styleMode={styleMode}
        setStyleMode={setStyleMode}
        isExporting={isExporting}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative p-4 sm:p-6 lg:p-8">
        {isDragging && (
          <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-3xl border-2 border-indigo-400 border-dashed m-4">
             <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl text-center">
                <p className="text-lg font-bold text-indigo-600">释放以导入文件</p>
             </div>
          </div>
        )}

        <div className={`h-full w-full flex gap-6 ${viewMode === ViewMode.Split ? '' : 'justify-center'}`}>
          {/* Editor Container */}
          {(viewMode === ViewMode.Edit || viewMode === ViewMode.Split) && (
            <div className={`h-full flex flex-col transition-all duration-300 ${viewMode === ViewMode.Split ? 'w-1/2' : 'w-full max-w-4xl'}`}>
              <Editor value={markdown} onChange={setMarkdown} />
            </div>
          )}

          {/* Preview Container */}
          {(viewMode === ViewMode.Preview || viewMode === ViewMode.Split) && (
            <div className={`h-full flex flex-col transition-all duration-300 ${viewMode === ViewMode.Split ? 'w-1/2' : 'w-full max-w-4xl'}`}>
               <Preview 
                  content={markdown} 
                  styleMode={styleMode} 
                  gongwenConfig={gongwenConfig}
                />
            </div>
          )}
        </div>
      </main>

      {/* Mobile Toggle Footer */}
      <div className="md:hidden bg-white/90 backdrop-blur border-t border-gray-200 p-3 flex justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-20">
         <button 
           onClick={() => setViewMode(ViewMode.Edit)}
           className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === ViewMode.Edit ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}
         >
           编辑
         </button>
         <button 
           onClick={() => setViewMode(ViewMode.Preview)}
           className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === ViewMode.Preview ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}
         >
           预览
         </button>
      </div>

      <GongwenSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={gongwenConfig}
        onSave={(newConfig) => {
          setGongwenConfig(newConfig);
          setIsSettingsOpen(false);
        }}
      />
    </div>
  );
};

export default App;