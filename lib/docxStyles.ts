
import { GongwenConfig } from '../types';

export const getStandardStyles = (scope?: string) => {
  const s = scope ? `${scope} ` : '';
  const root = scope || 'body';
  
  return `
  ${root} {
    font-family: 'Calibri', 'Microsoft YaHei', sans-serif;
    font-size: 11pt;
    line-height: 1.5;
    color: #333333;
  }
  
  ${s}h1, ${s}h2, ${s}h3, ${s}h4, ${s}h5, ${s}h6 {
    font-family: 'Cambria', 'Microsoft YaHei UI', serif;
    color: #000000;
    margin-top: 12pt;
    margin-bottom: 6pt;
    font-weight: bold;
  }

  ${s}h1 { font-size: 16pt; }
  ${s}h2 { font-size: 14pt; }
  ${s}h3 { font-size: 12pt; }
  
  ${s}p {
    margin-bottom: 8pt;
    text-align: justify;
  }

  ${s}a { color: #0563C1; text-decoration: underline; }

  ${s}table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 12pt;
    border: 1px solid #d1d5db;
  }
  ${s}th { background-color: #f3f4f6; font-weight: bold; border: 1px solid #9ca3af; padding: 8px; text-align: left; }
  ${s}td { border: 1px solid #d1d5db; padding: 8px; }

  ${s}pre {
    background-color: #f5f7ff;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    padding: 10px;
    font-family: 'Consolas', 'Courier New', monospace;
    font-size: 9.5pt;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
  
  ${s}code {
    font-family: 'Consolas', 'Courier New', monospace;
    background-color: #f3f4f6;
    padding: 2px 4px;
    border-radius: 3px;
    color: #c7254e;
  }
  ${s}pre code { color: #333; background-color: transparent; padding: 0; }

  ${s}blockquote {
    border-left: 4px solid #d1d5db;
    margin-left: 0;
    padding-left: 12pt;
    color: #4b5563;
    font-style: italic;
  }
  
  ${s}img { max-width: 100%; height: auto; }
  ${s}ul, ${s}ol { margin-bottom: 8pt; padding-left: 20pt; }
  ${s}li { margin-bottom: 2pt; }
  ${s}hr { border: 0; border-top: 1px solid #d1d5db; margin: 16pt 0; }
`;
};

// Dynamic Official Document (Gongwen) Style generator
export const getOfficialStyles = (config: GongwenConfig, scope?: string) => {
  const s = scope ? `${scope} ` : '';
  const root = scope || 'body';

  // Font Fallbacks
  const fangSong = `'FangSong_GB2312', 'FangSong', 'STFangsong', 'SimSun', serif`;
  const kaiTi = `'KaiTi_GB2312', 'KaiTi', 'STKaiti', 'SimSun', serif`;
  const heiTi = `'SimHei', 'STHeiti', 'Microsoft YaHei', sans-serif`;
  const xiaoBiaoSong = `'FZXiaoBiaoSong-B05S', 'FZXBSJW--GB1-0', 'SimSun', serif`; 
  
  const titleFont = config.headingFont.includes('XiaoBiaoSong') ? xiaoBiaoSong : 
                    config.headingFont.includes('SimHei') ? heiTi : xiaoBiaoSong;
  
  const bodyFont = config.bodyFont.includes('FangSong') ? fangSong :
                   config.bodyFont.includes('KaiTi') ? kaiTi : fangSong;

  // Note: @page cannot be scoped, but usually ignored in div.
  const pageRules = scope ? '' : `
  @page {
    size: A4;
    margin-top: ${Math.round(config.marginTop / 567)}cm;
    margin-bottom: ${Math.round(config.marginBottom / 567)}cm;
    margin-left: ${Math.round(config.marginLeft / 567)}cm;
    margin-right: ${Math.round(config.marginRight / 567)}cm;
  }`;

  return `
  ${pageRules}

  ${root} {
    font-family: ${bodyFont};
    font-size: ${config.bodySize}; 
    line-height: ${config.lineHeight}; 
    color: #000000;
  }
  
  ${s}.red-header {
    font-family: ${xiaoBiaoSong};
    color: #FF0000;
    font-size: 58pt;
    text-align: center;
    line-height: 1;
    font-weight: 500;
    margin-bottom: 15pt;
    white-space: nowrap;
    letter-spacing: 2pt;
  }

  ${s}.red-line {
    border-top: 3px solid #FF0000;
    margin-bottom: 40pt;
    width: 100%;
    height: 0;
  }
  
  ${s}h1 {
    font-family: ${titleFont};
    font-size: ${config.headingSize};
    text-align: center;
    font-weight: normal; 
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    color: #000000;
    border: none;
    line-height: 1.3;
  }

  ${s}h2 {
    font-family: ${heiTi};
    font-size: ${config.bodySize};
    font-weight: normal; 
    margin-top: ${config.lineHeight};
    margin-bottom: ${config.lineHeight};
    margin: 0;
    text-indent: ${config.indent};
    color: #000000;
    line-height: ${config.lineHeight};
  }

  ${s}h3 {
    font-family: ${kaiTi};
    font-size: ${config.bodySize};
    font-weight: normal;
    margin: 0;
    text-indent: ${config.indent};
    color: #000000;
    line-height: ${config.lineHeight};
  }
  
  ${s}h4 {
    font-family: ${bodyFont};
    font-size: ${config.bodySize};
    font-weight: bold;
    margin: 0;
    text-indent: ${config.indent};
    color: #000000;
    line-height: ${config.lineHeight};
  }
  
  ${s}p {
    margin: 0;
    text-indent: ${config.indent};
    text-align: justify;
    line-height: ${config.lineHeight};
  }

  ${s}table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 1em;
    margin-bottom: 1em;
    border: 1px solid #000;
    text-indent: 0;
    font-size: 14pt;
  }
  
  ${s}th, ${s}td {
    border: 1px solid #000;
    padding: 6px 4px;
    text-align: center;
    font-family: ${bodyFont};
    line-height: 1.5;
  }
  
  ${s}th {
    font-weight: bold;
  }

  ${s}ul, ${s}ol {
    margin: 0;
    padding-left: 0;
  }
  
  ${s}li {
    margin: 0;
    text-indent: ${config.indent};
    list-style-position: inside;
    line-height: ${config.lineHeight};
  }

  ${s}img {
    display: block;
    margin: 1em auto;
    max-width: 80%;
  }

  ${s}.meta-info {
    font-family: ${fangSong};
    font-size: 16pt;
  }
`;
};
