
import FileSaver from 'file-saver';
import { marked } from 'marked';
import { asBlob } from 'html-docx-js-typescript';
import { getStandardStyles, getOfficialStyles } from '../lib/docxStyles';
import { StyleMode, GongwenConfig, GONGWEN_PRESETS } from '../types';

export const generateDocx = async (
  markdown: string, 
  filename: string = 'document.docx',
  mode: StyleMode = StyleMode.Standard,
  gongwenConfig: GongwenConfig = GONGWEN_PRESETS.default
) => {
  try {
    // 1. Convert Markdown to HTML
    const htmlContent = await marked.parse(markdown);

    // 2. Select Styles based on mode
    let selectedStyle = '';
    let margins = { top: 720, right: 720, bottom: 720, left: 720 }; // Standard default
    let headerHtml = '';

    if (mode === StyleMode.Official) {
        selectedStyle = getOfficialStyles(gongwenConfig);
        margins = { 
            top: gongwenConfig.marginTop, 
            right: gongwenConfig.marginRight || 1100,
            bottom: gongwenConfig.marginBottom, 
            left: gongwenConfig.marginLeft || 1100
        };

        if (gongwenConfig.redHeaderText) {
            headerHtml = `
              <div class="red-header">${gongwenConfig.redHeaderText}</div>
              <div class="red-line"></div>
            `;
        }
    } else {
        selectedStyle = getStandardStyles();
    }

    // 3. Wrap HTML in a structure that Word understands better
    // Note: We use <br/> for line breaks, but CSS line-height controls spacing
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            ${selectedStyle}
          </style>
        </head>
        <body>
          ${headerHtml}
          ${htmlContent}
        </body>
      </html>
    `;

    // 4. Convert HTML string to Docx Blob
    const blob = await asBlob(fullHtml, {
      orientation: 'portrait',
      margins: margins,
    });

    // 5. Trigger Download
    if (blob) {
      // @ts-ignore
      const saveAs = FileSaver.saveAs || FileSaver;
      saveAs(blob as Blob, filename);
      return true;
    } else {
      throw new Error("生成 Blob 失败");
    }
  } catch (error) {
    console.error("Docx generation failed:", error);
    throw error;
  }
};
