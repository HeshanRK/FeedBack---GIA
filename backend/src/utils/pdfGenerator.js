import puppeteer from "puppeteer";

export async function generatePdfFromResponse({ response, answers, questions }) {
  // Group answers by parent question for sub-questions
  const groupedAnswers = groupAnswersByParent(answers);

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Response ${response.id}</title>
    <style>
      body {
        background-color: #e5e7eb;
        font-family: 'Times New Roman', serif;
        margin: 0;
        padding: 50px 20px;
      }

      .paper-doc {
        background-color: #ffffff;
        width: 210mm;
        min-height: 297mm;
        padding: 25mm;
        margin: 0 auto;
        position: relative;
        box-sizing: border-box;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      }

      .header {
        border-bottom: 2px solid #000;
        padding-bottom: 20px;
        margin-bottom: 40px;
        text-align: right;
        position: relative;
        z-index: 1;
        background-color: white;
      }
      
      .header h1 {
        font-size: 28px;
        text-transform: uppercase;
        letter-spacing: 3px;
        margin: 0;
        color: #1f2937;
        font-weight: bold;
      }
      
      .header p {
        margin: 8px 0 0 0;
        font-size: 13px;
        color: #6b7280;
        font-family: 'Segoe UI', sans-serif;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .form-content {
        position: relative;
        z-index: 1;
        background-color: white;
        padding-bottom: 40px;
      }

      .date-display {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 40px;
      }

      .date-box {
        width: 250px;
      }

      .date-label {
        font-size: 11px;
        font-weight: bold;
        color: #6b7280;
        text-transform: uppercase;
        font-family: 'Segoe UI', sans-serif;
        margin-bottom: 5px;
      }

      .date-value {
        border-bottom: 1px solid #9ca3af;
        font-family: 'Courier New', monospace;
        font-size: 16px;
        color: #1f2937;
        padding: 5px 0;
      }

      .response-info {
        background-color: #f9fafb;
        border: 2px solid #e5e7eb;
        padding: 25px;
        margin-bottom: 40px;
        border-radius: 8px;
      }

      .response-info h2 {
        font-size: 18px;
        color: #1f2937;
        margin: 0 0 20px 0;
        font-family: 'Segoe UI', sans-serif;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      }

      .info-item {
        display: flex;
        flex-direction: column;
      }

      .info-label {
        font-size: 11px;
        color: #6b7280;
        text-transform: uppercase;
        font-weight: 700;
        margin-bottom: 8px;
        font-family: 'Segoe UI', sans-serif;
        letter-spacing: 0.05em;
      }

      .info-value {
        font-size: 15px;
        color: #111827;
        font-weight: 600;
        font-family: 'Segoe UI', sans-serif;
        padding: 10px;
        background-color: white;
        border-radius: 4px;
        border: 1px solid #e5e7eb;
      }

      .question-block {
        margin-bottom: 40px;
        page-break-inside: avoid;
      }

      .question-number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 35px;
        height: 35px;
        background-color: #e0e7ff;
        color: #4f46e5;
        border-radius: 50%;
        font-weight: bold;
        font-size: 16px;
        margin-right: 15px;
        font-family: 'Segoe UI', sans-serif;
        vertical-align: middle;
      }

      .question-label {
        display: inline;
        font-size: 16px;
        font-weight: 700;
        color: #1f2937;
        font-family: 'Segoe UI', sans-serif;
        vertical-align: middle;
      }

      .answer-line {
        border-bottom: 1px solid #9ca3af;
        padding: 10px 0;
        margin-left: 50px;
        margin-top: 10px;
        font-family: 'Courier New', monospace;
        font-size: 16px;
        color: #1f2937;
        min-height: 25px;
        word-wrap: break-word;
      }

      .answer-textarea {
        border: 1px solid #9ca3af;
        border-radius: 4px;
        padding: 15px;
        margin-left: 50px;
        margin-top: 10px;
        font-family: 'Courier New', monospace;
        font-size: 15px;
        color: #1f2937;
        min-height: 80px;
        white-space: pre-wrap;
        word-wrap: break-word;
        background-color: #fafafa;
      }

      /* SUB-QUESTION STYLES */
      .sub-answers-container {
        margin-left: 50px;
        margin-top: 15px;
        border-left: 3px solid #e0e7ff;
        padding-left: 20px;
      }

      .sub-answer-item {
        margin-bottom: 15px;
        padding: 12px;
        background-color: #f9fafb;
        border-radius: 4px;
        border: 1px solid #e5e7eb;
      }

      .sub-answer-label {
        font-size: 13px;
        font-weight: 700;
        color: #4f46e5;
        text-transform: uppercase;
        font-family: 'Segoe UI', sans-serif;
        margin-bottom: 5px;
        letter-spacing: 0.5px;
      }

      .sub-answer-value {
        font-family: 'Courier New', monospace;
        font-size: 14px;
        color: #1f2937;
        word-wrap: break-word;
      }

      .no-answer {
        color: #9ca3af;
        font-style: italic;
      }

      .doc-footer {
        position: relative;
        z-index: 1;
        margin-top: 60px;
        padding-top: 15px;
        border-top: 1px solid #e5e7eb;
        text-align: center;
        font-size: 10px;
        color: #9ca3af;
        font-family: 'Segoe UI', sans-serif;
        background-color: white;
      }
    </style>
  </head>
  <body>

    <div class="paper-doc">
      
      <header class="header">
        <h1>Feedback Form</h1>
        <p>GIA Feedback System</p>
      </header>

      <div class="form-content">
        
        <div class="date-display">
          <div class="date-box">
            <div class="date-label">Date</div>
            <div class="date-value">${new Date(response.submitted_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</div>
          </div>
        </div>

        <div class="response-info">
          <h2>Response Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Response ID</div>
              <div class="info-value">#${response.id}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Submitted Date</div>
              <div class="info-value">${new Date(response.submitted_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Visitor Name</div>
              <div class="info-value">${escapeHtml(response.name || 'N/A')}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Visitor Type</div>
              <div class="info-value">${response.type ? (response.type === 'guest' ? 'Guest Visitor' : 'Internal Visitor') : 'N/A'}</div>
            </div>
            ${response.organization ? `
            <div class="info-item">
              <div class="info-label">Organization</div>
              <div class="info-value">${escapeHtml(response.organization)}</div>
            </div>
            ` : ''}
            ${response.id_number ? `
            <div class="info-item">
              <div class="info-label">ID Number</div>
              <div class="info-value">${escapeHtml(response.id_number)}</div>
            </div>
            ` : ''}
            ${response.purpose ? `
            <div class="info-item">
              <div class="info-label">Purpose</div>
              <div class="info-value">${escapeHtml(response.purpose)}</div>
            </div>
            ` : ''}
          </div>
        </div>

        ${groupedAnswers.map((item, index) => {
          return `
          <div class="question-block">
            <div>
              <span class="question-number">${index + 1}</span>
              <span class="question-label">${escapeHtml(item.q_text)}</span>
            </div>
            
            ${item.subAnswers && item.subAnswers.length > 0 ? `
              <div class="sub-answers-container">
                ${item.subAnswers.map(subAnswer => {
                  const hasAnswer = subAnswer.value && String(subAnswer.value).trim() !== "";
                  return `
                    <div class="sub-answer-item">
                      <div class="sub-answer-label">${escapeHtml(subAnswer.sub_question_label)}</div>
                      <div class="sub-answer-value ${!hasAnswer ? 'no-answer' : ''}">
                        ${hasAnswer ? escapeHtml(String(subAnswer.value)) : 'No answer provided'}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            ` : `
              ${(() => {
                const displayValue = item.value || "";
                const hasAnswer = displayValue && String(displayValue).trim() !== "";
                const isLongAnswer = String(displayValue).length > 50 || String(displayValue).includes('\n');
                
                return isLongAnswer ? `
                  <div class="answer-textarea ${!hasAnswer ? 'no-answer' : ''}">
                    ${hasAnswer ? escapeHtml(String(displayValue)) : 'No answer provided'}
                  </div>
                ` : `
                  <div class="answer-line ${!hasAnswer ? 'no-answer' : ''}">
                    ${hasAnswer ? escapeHtml(String(displayValue)) : 'No answer provided'}
                  </div>
                `;
              })()}
            `}
          </div>
          `;
        }).join("")}

      </div>

      <footer class="doc-footer">
        Generated by GIA Feedback System. Internal Use Only. © 2025
      </footer>

    </div>

  </body>
  </html>
  `;

  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ 
      format: "A4", 
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });
    
    return pdfBuffer;
  } catch (err) {
    console.error("Error generating PDF:", err);
    throw new Error("Failed to generate PDF");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Helper function to group answers by parent
function groupAnswersByParent(answers) {
  const grouped = [];
  const processedIds = new Set();

  answers.forEach((answer) => {
    if (processedIds.has(answer.question_id)) return;

    if (answer.parent_question_id) {
      let parentGroup = grouped.find(g => g.question_id === answer.parent_question_id);
      
      if (!parentGroup) {
        parentGroup = {
          question_id: answer.parent_question_id,
          q_text: answer.q_text,
          subAnswers: []
        };
        grouped.push(parentGroup);
      }

      parentGroup.subAnswers.push({
        question_id: answer.question_id,
        sub_question_label: answer.sub_question_label,
        value: answer.value
      });

      processedIds.add(answer.question_id);
    } else {
      grouped.push({
        question_id: answer.question_id,
        q_text: answer.q_text,
        value: answer.value,
        subAnswers: []
      });
      processedIds.add(answer.question_id);
    }
  });

  return grouped;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}