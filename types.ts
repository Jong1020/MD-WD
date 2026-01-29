
export interface ExportOptions {
  fileName: string;
  includeStyles: boolean;
}

export enum ViewMode {
  Split = 'SPLIT',
  Edit = 'EDIT',
  Preview = 'PREVIEW'
}

export enum StyleMode {
  Standard = 'STANDARD',
  Official = 'OFFICIAL'
}

export type GongwenPreset = 'default' | 'red_header' | 'minutes' | 'custom';

export interface GongwenConfig {
  preset: GongwenPreset;
  redHeaderText?: string; // New: Text for the Red Header (e.g., XX局)
  headingFont: string; // Title font (e.g. XiaoBiaoSong)
  bodyFont: string;    // Main body font (e.g. FangSong)
  headingSize: string; // Title size (e.g. 22pt)
  bodySize: string;    // Body size (e.g. 16pt / 3号)
  lineHeight: string;  // Changed to string to support fixed points (e.g., "29pt") or unitless
  indent: string;      // Paragraph indentation (e.g., "2em")
  marginTop: number;   // Twips
  marginBottom: number; // Twips
  marginLeft: number;   // Twips (New)
  marginRight: number;  // Twips (New)
}

// 1 cm = 567 Twips
export const GONGWEN_PRESETS: Record<string, GongwenConfig> = {
  default: {
    preset: 'default',
    redHeaderText: '',
    headingFont: '方正小标宋简体', // Updated to Chinese name for reliability
    bodyFont: '仿宋_GB2312',        // Updated to Chinese name for reliability
    headingSize: '22pt', // 2号
    bodySize: '16pt',    // 3号
    lineHeight: '28pt',  // Rule 9: Fixed 28pt
    indent: '2em',
    marginTop: 2098,     // 3.7cm
    marginBottom: 1985,  // 3.5cm
    marginLeft: 1588,    // 2.8cm
    marginRight: 1474    // 2.6cm
  },
  red_header: {
    preset: 'red_header',
    redHeaderText: '公文自动排版系统', // Default placeholder
    headingFont: '方正小标宋简体',
    bodyFont: '仿宋_GB2312',
    headingSize: '22pt',
    bodySize: '16pt',
    lineHeight: '28pt', // Rule 9: Fixed 28pt
    indent: '2em',
    marginTop: 2098,
    marginBottom: 1985,
    marginLeft: 1588,
    marginRight: 1474
  },
  minutes: {
    preset: 'minutes',
    redHeaderText: '',
    headingFont: '黑体',
    bodyFont: '楷体_GB2312',
    headingSize: '18pt',   // 2号
    bodySize: '14pt',      // 4号
    lineHeight: '1.5',
    indent: '2em',
    marginTop: 1440,
    marginBottom: 1440,
    marginLeft: 1100,
    marginRight: 1100
  }
};

export const DEFAULT_MARKDOWN = `# MarkdownPro 核心功能与排版规范说明

MarkdownPro 是一款专为行政办公与文档标准化设计的在线转换工具。它将 Markdown 的便捷写作与 Word 的专业排版完美融合，实现“所写即所得”的高效办公体验。

## 一、 核心功能亮点

### （一） 标准化公文输出
系统内置严格遵循《党政机关公文格式》（GB/T 9704—2012）的排版算法。
1. **自动版式**：一键切换“标准公文”、“红头文件”或“会议纪要”模式。
2. **精准控制**：支持设置页边距、行间距（如固定 29 磅）、首行缩进等参数。
3. **字体适配**：自动映射方正小标宋、仿宋_GB2312、楷体_GB2312 等标准中文字体。

### （二） 实时预览与所见即所得
左侧编辑 Markdown，右侧实时渲染最终的 Word 打印效果。
* 支持分栏对比模式，便于校对。
* 预览界面真实模拟 A4 纸张尺寸与边距。

## 二、 格式支持演示

### （一） 层级标题演示
本系统自动识别 Markdown 标题语法并转换为对应的公文标题样式：
* **一级标题**：自动应用方正小标宋（或黑体），居中或居左，字号可配。
* **二级标题**：自动应用楷体_GB2312，字号适配主体。
* **三级标题**：自动应用仿宋加粗效果。

### （二） 表格与数据
支持标准的 Markdown 表格语法，并自动添加公文表格样式（单倍行距、边框闭合）。

| 功能模块 | 说明 | 适用场景 |
| :--- | :--- | :--- |
| 基础编辑 | 纯文本写作，无干扰 | 日常草稿、备忘录 |
| 公文模式 | 严格的行距与字体 | 正式发文、通知 |
| 红头模式 | 自动生成红头与分割线 | 部门下发文件 |

### （三） 列表排版
* **有序列表**：自动调整缩进，保持与正文对齐。
* **无序列表**：适用于非正式的要点罗列。

## 三、 结语

MarkdownPro 致力于解决“内容创作”与“格式调整”割裂的痛点。用户只需专注于文字内容，繁琐的排版工作交由系统自动完成，导出即为标准的 .docx 文件，无需二次调整。

Jong
2026年1月23日
`;
