
import FileSaver from 'file-saver';
import { marked } from 'marked';
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
    // breaks: true ensures newlines become <br>, essential for the signature block
    const htmlContentRaw = await marked.parse(markdown, { breaks: true });

    let htmlContent = htmlContentRaw;

    // 2. Styles and Header/Footer Logic
    let cssRules = '';
    let headerHtml = '';
    let footerHtml = '';

    if (mode === StyleMode.Official) {
        cssRules = getOfficialStyles(gongwenConfig, undefined, true);

        // Header (Red Header Text - Organization Name)
        // Fix: Use single <p> with border-bottom CSS (defined in docxStyles) for stable rendering
        if (gongwenConfig.redHeaderText) {
            headerHtml = `<p class="red-header">${gongwenConfig.redHeaderText}</p>`;
        } else {
            // Standard Official Doc (No Red Header) -> No Red Line
            headerHtml = '';
        }

        // Footer (Page Numbers)
        // Implements Odd/Even page footer logic
        // Odd Page (f1): Right aligned, empty one char (margin-right: 14pt for Sihao)
        // Even Page (f2): Left aligned, empty one char (margin-left: 14pt for Sihao)
        const footerOdd = `
          <div style='mso-element:footer' id=f1>
            <p class=MsoFooter style='margin:0in;text-align:right;line-height:normal;margin-right:14.0pt'>
              <span style='font-size:14.0pt;font-family:宋体;mso-ascii-font-family:宋体;mso-hansi-font-family:宋体'>
                — <span style='mso-field-code:" PAGE "'></span> —
              </span>
            </p>
          </div>
        `;

        const footerEven = `
          <div style='mso-element:footer' id=f2>
            <p class=MsoFooter style='margin:0in;text-align:left;line-height:normal;margin-left:14.0pt'>
              <span style='font-size:14.0pt;font-family:宋体;mso-ascii-font-family:宋体;mso-hansi-font-family:宋体'>
                — <span style='mso-field-code:" PAGE "'></span> —
              </span>
            </p>
          </div>
        `;

        footerHtml = footerOdd + footerEven;

        // 3. Signature Post-processing (Smart Detection)
        // Find the last paragraph. If it is short (likely Date/Name), force right alignment.
        // We detect this by looking for the last <p> tag.
        const lastParaRegex = /<p[^>]*>([\s\S]*?)<\/p>\s*$/i;
        const match = htmlContent.match(lastParaRegex);
        if (match) {
            const inner = match[1];
            // Remove tags to check length
            const textLength = inner.replace(/<[^>]+>/g, '').trim().length;
            
            // If length is reasonable for a signature (e.g. < 50 chars)
            if (textLength < 50 && textLength > 0) {
                htmlContent = htmlContent.replace(lastParaRegex, 
                    `<div class="signature-box">${inner}</div>`
                );
            }
        }

    } else {
        // Standard Mode
        cssRules = getStandardStyles(undefined, true);
        // Standard docs usually don't have the specific red header/page number requirement in this context,
        // but we apply the styles to center the title.
    }

    // 4. Construct the Complete HTML File (MIME Spoofing Method)
    // This is the most robust way to support Word specific features like Field Codes (Page Numbers)
    const docContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${filename}</title>
        <!--[if gte mso 9]>
        <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          <!--
          ${cssRules}
          
          /* Common Resets for Word */
          p.MsoFooter, li.MsoFooter, div.MsoFooter {
            margin:0in;
            margin-bottom:.0001pt;
            mso-pagination:widow-orphan;
            font-size:12.0pt;
            font-family:"Times New Roman",serif;
          }
          -->
        </style>
      </head>
      <body>
        <div class="Section1">
          ${headerHtml}
          ${htmlContent}
          <br style='page-break-before:auto' />
          ${footerHtml}
        </div>
      </body>
      </html>
    `;

    // 5. Create Blob with specific Word MIME type
    const blob = new Blob(['\ufeff', docContent], {
      type: 'application/msword;charset=utf-8'
    });

    // 6. Download
    // @ts-ignore
    const saveAs = FileSaver.saveAs || FileSaver;
    saveAs(blob, filename);

    return true;

  } catch (error) {
    console.error("Docx generation failed:", error);
    throw error;
  }
};
