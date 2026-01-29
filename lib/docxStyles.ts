
import { GongwenConfig } from '../types';

// Helper to construct font CSS properties based on environment
const formatFont = (chineseFontStack: string, isExport: boolean) => {
  if (isExport) {
    // Word Export: 
    // Use mso-ascii-font-family etc. to strictly control mixed language fonts
    return `
      font-family: ${chineseFontStack};
      mso-ascii-font-family: 'Times New Roman';
      mso-hansi-font-family: 'Times New Roman';
    `;
  } else {
    // Browser Preview:
    return `font-family: ${chineseFontStack}, 'Times New Roman', serif;`;
  }
};

export const getStandardStyles = (scope?: string, isExport: boolean = false) => {
  const s = scope ? `${scope} ` : '';
  const root = scope || 'body';
  
  // Standard document styling
  return `
  ${root} {
    font-family: 'Calibri', 'Microsoft YaHei', sans-serif;
    font-size: 12pt; /* Slightly larger for standard reading */
    line-height: 28pt; /* Fixed 28pt line height */
    color: #333333;
  }
  
  /* Standard Title: Centered and Bold */
  ${s}h1 {
    font-family: 'Cambria', 'Microsoft YaHei UI', serif;
    font-size: 22pt;
    font-weight: bold;
    color: #000000;
    margin: 0;
    mso-para-margin-top: 0;
    mso-para-margin-bottom: 0;
    text-align: center; /* Fix: Center alignment for standard docs */
    line-height: 1.5; /* Keep titles tighter than body text */
  }

  ${s}h2 { 
    font-size: 16pt; 
    margin: 0;
    mso-para-margin-top: 0;
    mso-para-margin-bottom: 0;
    font-weight: bold; 
    line-height: 1.5; 
  }

  ${s}h3 { 
    font-size: 14pt; 
    margin: 0;
    mso-para-margin-top: 0;
    mso-para-margin-bottom: 0; 
    font-weight: bold; 
    line-height: 1.5; 
  }
  
  ${s}p {
    margin: 0;
    mso-para-margin-top: 0;
    mso-para-margin-bottom: 0;
    text-align: justify;
    text-indent: 2em; /* First line indent 2em for browser */
    mso-char-indent-count: 2.0; /* Force Word to indent exactly 2 characters */
    line-height: 28pt; /* Fixed 28pt */
  }

  /* List Styling for Standard Mode */
  ${s}ul, ${s}ol {
    margin: 0;
    padding: 0; /* Remove default list padding */
    mso-para-margin-top: 0;
    mso-para-margin-bottom: 0;
    list-style-position: inside; /* Make number/bullet part of text flow */
  }

  ${s}li {
    margin: 0;
    mso-para-margin-top: 0;
    mso-para-margin-bottom: 0;
    text-align: justify;
    text-indent: 2em;
    mso-char-indent-count: 2.0;
    line-height: 28pt;
  }

  ${s}a { color: #0563C1; text-decoration: underline; }

  ${s}table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 12pt;
    border: 1px solid #d1d5db;
    mso-char-indent-count: 0;
  }
  ${s}th { background-color: #f3f4f6; font-weight: bold; border: 1px solid #9ca3af; padding: 8px; text-align: left; }
  ${s}td { border: 1px solid #d1d5db; padding: 8px; }

  ${s}blockquote {
    border-left: 4px solid #d1d5db;
    margin-left: 0;
    padding-left: 12pt;
    color: #4b5563;
    font-style: italic;
  }

  /* Signature Right Alignment Helper */
  ${s}.signature-box {
    text-align: right;
    margin-top: 20pt;
    margin-right: 2em;
    padding-right: 10pt;
  }
`;
};

// Dynamic Official Document (Gongwen) Style generator
export const getOfficialStyles = (config: GongwenConfig, scope?: string, isExport: boolean = false) => {
  const s = scope ? `${scope} ` : '';
  const root = scope || 'body';

  // Base Chinese Font Stacks
  const fangSong = isExport ? `'仿宋_GB2312'` : `'仿宋_GB2312', 'FangSong', serif`;
  const kaiTi = isExport ? `'楷体_GB2312'` : `'楷体_GB2312', 'KaiTi', serif`;
  const heiTi = isExport ? `'黑体'` : `'黑体', 'SimHei', sans-serif`;
  const xiaoBiaoSong = isExport ? `'方正小标宋简体'` : `'方正小标宋简体', 'SimSun', serif`;
  
  const titleFont = config.headingFont.includes('小标宋') ? xiaoBiaoSong : heiTi;
  const bodyFont = config.bodyFont.includes('仿宋') ? fangSong : kaiTi;

  // IMPORTANT: Word CSS for Page Layout
  // @page definitions only work in export mode effectively
  const pageRules = scope ? '' : `
  @page Section1 {
    size: A4;
    margin: ${Math.round(config.marginTop / 567)}cm ${Math.round(config.marginRight / 567)}cm ${Math.round(config.marginBottom / 567)}cm ${Math.round(config.marginLeft / 567)}cm;
    mso-header-margin: 1.5cm;
    mso-footer-margin: 1.75cm;
    /* Removed mso-title-page: yes; to disable "Different First Page" */
    mso-footer: f1; /* Odd page footer */
    mso-even-footer: f2; /* Even page footer */
  }
  
  div.Section1 {
    page: Section1;
  }
  `;

  return `
  ${pageRules}

  ${root} {
    ${formatFont(bodyFont, isExport)}
    font-size: ${config.bodySize}; 
    line-height: ${config.lineHeight}; 
    color: #000000;
  }
  
  /* Red Header Styles - Merged Border for Stability */
  ${s}.red-header {
    ${formatFont(xiaoBiaoSong, isExport)}
    color: #FF0000;
    font-size: 58pt;
    text-align: center;
    line-height: 1.2; 
    font-weight: 500;
    margin: 0;
    text-indent: 0; /* Important for P tags */
    mso-char-indent-count: 0;
    letter-spacing: 0; 
    
    /* The Red Line: Applied as a bottom border to the text container */
    border-bottom: 3px solid #FF0000;
    padding-bottom: 10pt; /* Space between text and line */
    margin-bottom: 30pt;  /* Space between line and title */
  }
  
  /* H1: Document Title */
  ${s}h1 {
    ${formatFont(titleFont, isExport)}
    font-size: ${config.headingSize}; 
    text-align: center;
    font-weight: normal; 
    margin: 0;
    mso-para-margin-top: 0;
    mso-para-margin-bottom: 0;
    color: #000000;
    line-height: 35pt; /* Fixed: 35pt line height for official documents */
  }

  /* H2: Level 1 Heading (HeiTi) */
  ${s}h2 {
    ${formatFont(heiTi, isExport)}
    font-size: ${config.bodySize};
    font-weight: normal; 
    margin: 0;
    mso-para-margin-top: 0;
    mso-para-margin-bottom: 0;
    text-indent: ${config.indent};
    mso-char-indent-count: 2.0; /* Force Word 2 char indent */
    line-height: ${config.lineHeight};
  }

  /* H3: Level 2 Heading (KaiTi) */
  ${s}h3 {
    ${formatFont(kaiTi, isExport)}
    font-size: ${config.bodySize};
    font-weight: normal;
    margin: 0;
    mso-para-margin-top: 0;
    mso-para-margin-bottom: 0;
    text-indent: ${config.indent};
    mso-char-indent-count: 2.0; /* Force Word 2 char indent */
    line-height: ${config.lineHeight};
  }
  
  /* Body Text */
  ${s}p {
    margin: 0;
    mso-para-margin-top: 0;
    mso-para-margin-bottom: 0;
    text-indent: ${config.indent};
    mso-char-indent-count: 2.0; /* Force Word 2 char indent */
    text-align: justify;
    text-justify: inter-ideograph;
    line-height: ${config.lineHeight};
  }

  /* List Styling - mimic paragraph style */
  ${s}ul, ${s}ol {
    margin: 0;
    padding: 0; /* Important: remove browser/word default padding */
    mso-para-margin-top: 0;
    mso-para-margin-bottom: 0;
    list-style-position: inside; /* Number sits inside text block */
  }

  ${s}li {
    margin: 0;
    mso-para-margin-top: 0;
    mso-para-margin-bottom: 0;
    text-indent: ${config.indent}; /* Indent number same as paragraph */
    mso-char-indent-count: 2.0;
    line-height: ${config.lineHeight};
    text-align: justify;
    text-justify: inter-ideograph;
  }

  /* Tables */
  ${s}table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
    border: 1px solid #000;
    text-indent: 0;
    mso-char-indent-count: 0;
  }
  ${s}th, ${s}td {
    border: 1px solid #000;
    padding: 8px;
    text-align: center;
    font-size: 14pt;
    line-height: 1.5;
  }

  /* Images */
  ${s}img {
    display: block;
    margin: 10pt auto;
    max-width: 90%;
  }

  /* Signature Box (For alignment) */
  ${s}.signature-box {
    text-align: right;
    margin-top: 30pt;
    margin-right: 2em; /* Ensure padding from right edge */
    text-indent: 0;    /* Remove indentation for signature */
    mso-char-indent-count: 0;
    line-height: 1.5;
  }
  
  /* In Preview mode, try to target the last paragraph if it looks like a signature */
  ${!isExport ? `
    ${s}p:last-of-type {
       /* CSS heuristic: if it's the very last P, align right. 
          Note: This is visual only for preview. Export uses explicit classes. */
       text-align: right;
       text-indent: 0;
       margin-right: 2em;
    }
  ` : ''}
`;
};
