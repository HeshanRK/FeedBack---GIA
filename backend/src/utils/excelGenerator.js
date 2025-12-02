import ExcelJS from 'exceljs';

export async function generateFeedbackExcel(responses) {
  const workbook = new ExcelJS.Workbook();

  // ========== ONE SHEET WITH ALL USERS ==========
  const mainSheet = workbook.addWorksheet('All Feedback Responses');

  let currentRow = 1;

  // Process each response (each user)
  responses.forEach((response, userIndex) => {
    // ===== USER HEADER SECTION (GIA GOLD & BLACK) =====
    mainSheet.mergeCells(currentRow, 1, currentRow, 3);
    const userHeaderCell = mainSheet.getCell(currentRow, 1);
    userHeaderCell.value = `RESPONSE #${response.id} - ${response.visitor_name || 'Unknown Visitor'}`;
    userHeaderCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
    userHeaderCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F2937' } // GIA Black
    };
    userHeaderCell.alignment = { horizontal: 'center', vertical: 'middle' };
    mainSheet.getRow(currentRow).height = 30;
    
    // Add borders to merged header
    [1, 2, 3].forEach(col => {
      mainSheet.getCell(currentRow, col).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    
    currentRow++;

    // ===== USER INFORMATION (GIA GOLD BACKGROUND) =====
    const userInfo = [
      ['Visitor Name:', response.visitor_name || 'N/A'],
      ['Visitor Type:', response.visitor_type === 'guest' ? 'Guest Visitor' : 'Internal Visitor'],
      ['Form:', response.form_title || 'N/A'],
      ['Organization:', response.organization || 'N/A'],
      ['ID Number:', response.id_number || 'N/A'],
      ['Date:', new Date(response.submitted_at).toLocaleString()]
    ];

    userInfo.forEach(([label, value]) => {
      mainSheet.getCell(currentRow, 1).value = label;
      mainSheet.mergeCells(currentRow, 2, currentRow, 3);
      mainSheet.getCell(currentRow, 2).value = value;
      
      mainSheet.getCell(currentRow, 1).font = { bold: true, color: { argb: 'FF1F2937' } };
      mainSheet.getCell(currentRow, 1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFEF3C7' } // Light Gold
      };
      
      // Add borders to info rows
      [1, 2, 3].forEach(col => {
        mainSheet.getCell(currentRow, col).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      
      currentRow++;
    });

    currentRow++;

    // ===== QUESTIONS & ANSWERS HEADER (GIA GOLD) =====
    mainSheet.getCell(currentRow, 1).value = '#';
    mainSheet.getCell(currentRow, 2).value = 'Question';
    mainSheet.getCell(currentRow, 3).value = 'Answer';
    
    // Apply GIA brand colors
    [1, 2, 3].forEach(col => {
      const cell = mainSheet.getCell(currentRow, col);
      cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC9A961' } // GIA Gold
      };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'medium', color: { argb: 'FF1F2937' } },
        left: { style: 'thin' },
        bottom: { style: 'medium', color: { argb: 'FF1F2937' } },
        right: { style: 'thin' }
      };
    });
    
    mainSheet.getRow(currentRow).height = 25;
    currentRow++;

    // ===== QUESTIONS AND ANSWERS =====
    if (response.answers && response.answers.length > 0) {
      response.answers.forEach((answer, qIndex) => {
        // Question number (GIA Black)
        mainSheet.getCell(currentRow, 1).value = qIndex + 1;
        mainSheet.getCell(currentRow, 1).alignment = { horizontal: 'center', vertical: 'top' };
        mainSheet.getCell(currentRow, 1).font = { bold: true, size: 11, color: { argb: 'FF1F2937' } };

        // Question text (Bold Black)
        mainSheet.getCell(currentRow, 2).value = answer.q_text || 'Question';
        mainSheet.getCell(currentRow, 2).alignment = { wrapText: true, vertical: 'top' };
        mainSheet.getCell(currentRow, 2).font = { bold: true, color: { argb: 'FF1F2937' } };

        // ===== FIX ANSWER VALUE - Remove JSON brackets =====
        let answerValue = '';
        
        if (answer.value === null || answer.value === undefined) {
          answerValue = 'No answer provided';
        } else if (Array.isArray(answer.value)) {
          answerValue = answer.value.join(', ');
        } else if (typeof answer.value === 'string') {
          try {
            const parsed = JSON.parse(answer.value);
            if (Array.isArray(parsed)) {
              answerValue = parsed.join(', ');
            } else if (typeof parsed === 'object') {
              answerValue = JSON.stringify(parsed);
            } else {
              answerValue = String(parsed);
            }
          } catch {
            answerValue = answer.value;
          }
        } else if (typeof answer.value === 'object') {
          answerValue = JSON.stringify(answer.value);
        } else {
          answerValue = String(answer.value);
        }

        mainSheet.getCell(currentRow, 3).value = answerValue;
        mainSheet.getCell(currentRow, 3).alignment = { wrapText: true, vertical: 'top' };
        
        // Light gold background for answer
        mainSheet.getCell(currentRow, 3).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFBF0' } // Very light gold/cream
        };

        // Add borders ONLY to columns 1, 2, 3
        [1, 2, 3].forEach(col => {
          mainSheet.getCell(currentRow, col).border = {
            top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
            left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
            bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
            right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
          };
        });

        // Adjust row height based on content
        const minHeight = Math.max(30, Math.ceil(answerValue.length / 50) * 15);
        mainSheet.getRow(currentRow).height = minHeight;

        currentRow++;
      });
    } else {
      mainSheet.mergeCells(currentRow, 1, currentRow, 3);
      mainSheet.getCell(currentRow, 1).value = 'No answers provided';
      mainSheet.getCell(currentRow, 1).alignment = { horizontal: 'center', vertical: 'middle' };
      mainSheet.getCell(currentRow, 1).font = { italic: true, color: { argb: 'FF6B7280' } };
      
      // Add borders to "no answers" row
      [1, 2, 3].forEach(col => {
        mainSheet.getCell(currentRow, col).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
      
      currentRow++;
    }

    // Add spacing between users
    currentRow += 3;
  });

  // Footer (GIA Colors)
  mainSheet.mergeCells(currentRow, 1, currentRow, 3);
  const footerCell = mainSheet.getCell(currentRow, 1);
  footerCell.value = `Generated by GIA Feedback System - ${new Date().toLocaleString()}`;
  footerCell.font = { italic: true, size: 9, color: { argb: 'FF6B7280' } };
  footerCell.alignment = { horizontal: 'center' };
  footerCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFFEF3C7' } // Light Gold
  };

  // ===== AUTO-SIZE ONLY 3 COLUMNS =====
  [1, 2, 3].forEach(colIndex => {
    const column = mainSheet.getColumn(colIndex);
    let maxLength = 0;
    
    column.eachCell({ includeEmpty: false }, (cell) => {
      const cellValue = cell.value ? cell.value.toString() : '';
      if (cellValue.length > maxLength) {
        maxLength = cellValue.length;
      }
    });
    
    // Set column width with min and max limits
    if (colIndex === 1) {
      // Column A (number column) - smaller
      column.width = Math.min(Math.max(maxLength + 2, 5), 10);
    } else {
      // Columns B and C - auto-size with reasonable limits
      column.width = Math.min(Math.max(maxLength + 2, 20), 80);
    }
  });

  return workbook;
}