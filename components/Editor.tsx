import React from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  return (
    <div className="h-full flex flex-col relative group">
       {/* Paper Container */}
       <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden relative flex flex-col">
          {/* Minimal Status Indicator - Inside the paper, top right */}
          <div className="absolute top-4 right-6 z-10 pointer-events-none opacity-50 hover:opacity-100 transition-opacity">
            <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded-full">
               {value.length} chars
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
             {/* 
                We use a container to constrain width if needed, 
                but generally we want the typing experience to fill the 'paper'.
             */}
            <textarea
              className="w-full h-full p-8 sm:p-10 lg:p-12 resize-none border-none outline-none focus:ring-0 focus:outline-none bg-transparent font-mono text-sm sm:text-base leading-8 text-gray-700 placeholder-gray-300 selection:bg-indigo-50 selection:text-indigo-900"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="# 开始撰写..."
              spellCheck={false}
              style={{
                fontFamily: '"JetBrains Mono", "Menlo", "Consolas", monospace',
              }}
            />
          </div>
       </div>
    </div>
  );
};

export default Editor;