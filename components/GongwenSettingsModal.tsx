
import React from 'react';
import { X, Save } from 'lucide-react';
import { GongwenConfig, GONGWEN_PRESETS, GongwenPreset } from '../types';

interface GongwenSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GongwenConfig;
  onSave: (config: GongwenConfig) => void;
}

const GongwenSettingsModal: React.FC<GongwenSettingsModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [localConfig, setLocalConfig] = React.useState<GongwenConfig>(config);

  // Sync prop changes to local state
  React.useEffect(() => {
    setLocalConfig(config);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handlePresetChange = (preset: GongwenPreset) => {
    if (preset === 'custom') {
      setLocalConfig({ ...localConfig, preset: 'custom' });
    } else {
      setLocalConfig({ ...GONGWEN_PRESETS[preset] });
    }
  };

  const handleChange = (field: keyof GongwenConfig, value: string | number) => {
    setLocalConfig({ ...localConfig, preset: 'custom', [field]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0">
          <h2 className="text-lg font-bold text-gray-800">公文格式设置</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">预设模版</label>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => handlePresetChange('default')}
                className={`py-2 px-3 text-sm rounded border ${localConfig.preset === 'default' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-gray-300 text-gray-700'}`}
              >
                标准公文
              </button>
              <button 
                onClick={() => handlePresetChange('red_header')}
                className={`py-2 px-3 text-sm rounded border ${localConfig.preset === 'red_header' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-gray-300 text-gray-700'}`}
              >
                红头文件
              </button>
              <button 
                onClick={() => handlePresetChange('minutes')}
                className={`py-2 px-3 text-sm rounded border ${localConfig.preset === 'minutes' ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-gray-300 text-gray-700'}`}
              >
                会议纪要
              </button>
            </div>
          </div>
          
          {/* Red Header Text Input - Show if red_header or custom */}
          {(localConfig.preset === 'red_header' || localConfig.preset === 'custom') && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-2">
                <label className="block text-xs font-bold text-red-700 mb-1">红头文字内容 (留空则不显示)</label>
                <input 
                  type="text" 
                  value={localConfig.redHeaderText || ''}
                  onChange={(e) => handleChange('redHeaderText', e.target.value)}
                  placeholder="请输入红头机构名称"
                  className="w-full text-sm rounded-md border-red-200 shadow-sm focus:border-red-500 focus:ring-red-500 text-red-800 placeholder-red-300"
                />
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 border-b pb-1">字体与字号</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">大标题字体 (H1)</label>
                <select 
                  value={localConfig.headingFont}
                  onChange={(e) => handleChange('headingFont', e.target.value)}
                  className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="方正小标宋简体">方正小标宋简体</option>
                  <option value="黑体">黑体</option>
                  <option value="宋体">宋体</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">正文字体</label>
                <select 
                  value={localConfig.bodyFont}
                  onChange={(e) => handleChange('bodyFont', e.target.value)}
                  className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="仿宋_GB2312">仿宋_GB2312</option>
                  <option value="FangSong">普通仿宋</option>
                  <option value="楷体_GB2312">楷体_GB2312</option>
                  <option value="SimSun">宋体</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">大标题字号</label>
                <select 
                  value={localConfig.headingSize}
                  onChange={(e) => handleChange('headingSize', e.target.value)}
                  className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="24pt">小一 (24pt)</option>
                  <option value="22pt">二号 (22pt)</option>
                  <option value="18pt">小二 (18pt)</option>
                  <option value="16pt">三号 (16pt)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">正文字号</label>
                <select 
                  value={localConfig.bodySize}
                  onChange={(e) => handleChange('bodySize', e.target.value)}
                  className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="16pt">三号 (16pt)</option>
                  <option value="15pt">小三 (15pt)</option>
                  <option value="14pt">四号 (14pt)</option>
                  <option value="12pt">小四 (12pt)</option>
                </select>
              </div>
            </div>

            <h3 className="text-sm font-bold text-gray-800 border-b pb-1 mt-6">版面设置 (行距与边距)</h3>
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">行高 (如 28pt)</label>
                <input 
                  type="text" 
                  value={localConfig.lineHeight}
                  onChange={(e) => handleChange('lineHeight', e.target.value)}
                  placeholder="28pt"
                  className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">首行缩进 (如 2em)</label>
                <input 
                  type="text" 
                  value={localConfig.indent}
                  onChange={(e) => handleChange('indent', e.target.value)}
                  placeholder="2em"
                  className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">上边距 (Twips)</label>
                <input 
                  type="number" 
                  value={localConfig.marginTop}
                  onChange={(e) => handleChange('marginTop', parseInt(e.target.value))}
                  className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-gray-400">1cm ≈ 567 Twips (约2098)</span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">下边距 (Twips)</label>
                <input 
                  type="number" 
                  value={localConfig.marginBottom}
                  onChange={(e) => handleChange('marginBottom', parseInt(e.target.value))}
                  className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-gray-400">约1985</span>
              </div>
               <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">左边距 (Twips)</label>
                <input 
                  type="number" 
                  value={localConfig.marginLeft}
                  onChange={(e) => handleChange('marginLeft', parseInt(e.target.value))}
                  className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-gray-400">约1588</span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">右边距 (Twips)</label>
                <input 
                  type="number" 
                  value={localConfig.marginRight}
                  onChange={(e) => handleChange('marginRight', parseInt(e.target.value))}
                  className="w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <span className="text-[10px] text-gray-400">约1474</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            取消
          </button>
          <button 
            onClick={() => onSave(localConfig)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg"
          >
            <Save className="w-4 h-4" />
            应用配置
          </button>
        </div>
      </div>
    </div>
  );
};

export default GongwenSettingsModal;
