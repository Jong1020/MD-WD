
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import { StyleMode, GongwenConfig } from '../types';
import { getOfficialStyles, getStandardStyles } from '../lib/docxStyles';

interface PreviewProps {
  content: string;
  styleMode: StyleMode;
  gongwenConfig: GongwenConfig;
}

const Preview: React.FC<PreviewProps> = ({ content, styleMode, gongwenConfig }) => {
  const isOfficial = styleMode === StyleMode.Official;
  
  // Generate Scoped CSS
  // Pass isExport = false for browser preview
  const officialCss = isOfficial ? getOfficialStyles(gongwenConfig, '.official-doc', false) : '';
  const standardCss = !isOfficial ? getStandardStyles('.standard-doc', false) : '';

  // Padding calculations for Official Mode
  const pxPerTwip = 0.0667;
  const paddingTop = isOfficial ? `${gongwenConfig.marginTop * pxPerTwip}px` : '48px'; 
  const paddingBottom = isOfficial ? `${gongwenConfig.marginBottom * pxPerTwip}px` : '48px';
  const paddingLeft = isOfficial ? `${gongwenConfig.marginLeft * pxPerTwip}px` : '48px';
  const paddingRight = isOfficial ? `${gongwenConfig.marginRight * pxPerTwip}px` : '48px';

  return (
    <div className="h-full flex flex-col relative">
      {/* Paper Container */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden relative flex flex-col">
         
         {/* Floating Badge for Mode */}
         <div className="absolute top-4 right-6 z-10 pointer-events-none opacity-80">
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${
               isOfficial 
               ? 'bg-red-50 text-red-600 border-red-100' 
               : 'bg-blue-50 text-blue-600 border-blue-100'
            }`}>
               {isOfficial ? '公文排版' : '标准预览'}
            </span>
         </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 sm:p-4">
          <div className="min-h-full flex flex-col items-center">
             {/* 
                The document wrapper
             */}
            <article 
              className={`
                transition-all duration-300 ease-in-out
                ${isOfficial ? 'official-doc shadow-lg my-4' : 'standard-doc w-full max-w-none shadow-sm my-4'}
              `}
              style={isOfficial ? {
                width: '210mm', 
                minHeight: '297mm',
                paddingTop,
                paddingBottom,
                paddingLeft,
                paddingRight,
                backgroundColor: 'white',
                flexShrink: 0, 
                transform: 'scale(0.9)', 
                transformOrigin: 'top center'
              } : {
                width: '100%',
                padding: '48px'
              }}
            >
              <style>{isOfficial ? officialCss : standardCss}</style>

              {/* Render Red Header Text (Organization Name) if in Official Mode */}
              {isOfficial && gongwenConfig.redHeaderText && (
                 <div>
                     <div className="red-header">{gongwenConfig.redHeaderText}</div>
                     {/* Red line is now handled by border-bottom of red-header class */}
                 </div>
              )}

              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  // Revert h1 to standard rendering
                  h1: ({node, ...props}) => <h1 {...props} />,
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto my-4 border-gray-300">
                      <table className="min-w-full divide-y divide-gray-300" {...props} />
                    </div>
                  ),
                  th: ({node, ...props}) => (
                    <th {...props} />
                  ),
                  td: ({node, ...props}) => (
                    <td {...props} />
                  ),
                  code: ({className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match && !String(children).includes('\n');
                    return isInline ? (
                      <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-sm" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {content || ""}
              </ReactMarkdown>
              
              {!content && (
                <div className="py-20 flex items-center justify-center text-gray-300 italic select-none">
                  预览区域
                </div>
              )}

              {/* Preview Footer for Official Mode (Visual Only) */}
              {isOfficial && (
                <div className="mt-12 text-center text-gray-400 select-none">
                   <span className="text-sm font-song">— 1 —</span>
                </div>
              )}
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
