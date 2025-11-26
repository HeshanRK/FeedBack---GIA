import puppeteer from "puppeteer";

export async function generatePdfFromResponse({ response, answers, questions }) {
  // Build a simple HTML representation
  const html = `
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Response ${response.id}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h1 { font-size: 20px; margin-bottom: 8px; }
      h2 { font-size: 16px; margin-top: 20px; }
      .q { margin-bottom: 12px; }
      .label { font-weight: bold; margin-bottom: 4px; }
      .answer { margin-left: 8px; color: #333; }
      .meta { font-size: 12px; color: #666; margin-bottom: 10px; }
    </style>
  </head>
  <body>
    <h1>Form Response #${response.id}</h1>
    <div class="meta">Submitted at: ${new Date(response.submitted_at).toLocaleString()}</div>
    ${answers.map(a => {
      const questionText = a.q_text || (questions.find(q => q.id === a.question_id)?.q_text) || `Question ${a.question_id}`;
      const displayValue = (typeof a.value === "object") ? JSON.stringify(a.value) : (a.value ?? "");
      return `<div class="q"><div class="label">${escapeHtml(questionText)}</div><div class="answer">${escapeHtml(displayValue)}${a.file_path ? `<div>File: ${escapeHtml(a.file_path)}</div>` : ""}</div></div>`;
    }).join("")}
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
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
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

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}