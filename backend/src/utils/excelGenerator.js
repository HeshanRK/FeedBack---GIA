import ExcelJS from 'exceljs';

export async function generateFeedbackExcel(responses) {
  const workbook = new ExcelJS.Workbook();
  const mainSheet = workbook.addWorksheet('All Feedback Responses');

  let currentRow = 1;

  responses.forEach((response, userIndex) => {
    // ===== USER HEADER SECTION (GIA GOLD & BLACK) =====
    mainSheet.mergeCells(currentRow, 1, currentRow, 3);
    const userHeaderCell = mainSheet.getCell(currentRow, 1);
    userHeaderCell.value = `RESPONSE #${response.id} - ${response.visitor_name || 'Unknown Visitor'}`;
    userHeaderCell.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
    userHeaderCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F2937' }
    };
    userHeaderCell.alignment = { horizontal: 'center', vertical: 'middle' };
    mainSheet.getRow(currentRow).height = 30;
    
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
        fgColor: { argb: 'FFFEF3C7' }
      };
      
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
    
    [1, 2, 3].forEach(col => {
      const cell = mainSheet.getCell(currentRow, col);
      cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC9A961' }
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

    // ===== GROUP ANSWERS BY PARENT (for sub-questions) =====
    const groupedAnswers = groupAnswersByParent(response.answers || []);

    // ===== QUESTIONS AND ANSWERS =====
    if (groupedAnswers && groupedAnswers.length > 0) {
      groupedAnswers.forEach((item, qIndex) => {
        // Question number (GIA Black)
        mainSheet.getCell(currentRow, 1).value = qIndex + 1;
        mainSheet.getCell(currentRow, 1).alignment = { horizontal: 'center', vertical: 'top' };
        mainSheet.getCell(currentRow, 1).font = { bold: true, size: 11, color: { argb: 'FF1F2937' } };

        // Question text (Bold Black)
        mainSheet.getCell(currentRow, 2).value = item.q_text || 'Question';
        mainSheet.getCell(currentRow, 2).alignment = { wrapText: true, vertical: 'top' };
        mainSheet.getCell(currentRow, 2).font = { bold: true, color: { argb: 'FF1F2937' } };

        // ===== HANDLE SUB-QUESTIONS =====
        if (item.subAnswers && item.subAnswers.length > 0) {
          // For sub-questions, create a formatted string with all sub-answers
          let subAnswersText = '';
          item.subAnswers.forEach((subAnswer, idx) => {
            const subValue = formatAnswerValue(subAnswer.value);
            subAnswersText += `${subAnswer.sub_question_label}: ${subValue}`;
            if (idx < item.subAnswers.length - 1) {
              subAnswersText += '\n';
            }
          });

          mainSheet.getCell(currentRow, 3).value = subAnswersText;
          mainSheet.getCell(currentRow, 3).alignment = { wrapText: true, vertical: 'top' };
          mainSheet.getCell(currentRow, 3).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFBF0' }
          };

          // Adjust row height for sub-answers
          const lineCount = item.subAnswers.length;
          mainSheet.getRow(currentRow).height = Math.max(30, lineCount * 20);
        } else {
          // Regular answer (no sub-questions)
          const answerValue = formatAnswerValue(item.value);
          mainSheet.getCell(currentRow, 3).value = answerValue;
          mainSheet.getCell(currentRow, 3).alignment = { wrapText: true, vertical: 'top' };
          mainSheet.getCell(currentRow, 3).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFBF0' }
          };

          const minHeight = Math.max(30, Math.ceil(answerValue.length / 50) * 15);
          mainSheet.getRow(currentRow).height = minHeight;
        }

        // Add borders to all cells
        [1, 2, 3].forEach(col => {
          mainSheet.getCell(currentRow, col).border = {
            top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
            left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
            bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
            right: { style: 'thin', color: { argb: 'FFD1D5DB' } }
          };
        });

        currentRow++;
      });
    } else {
      mainSheet.mergeCells(currentRow, 1, currentRow, 3);
      mainSheet.getCell(currentRow, 1).value = 'No answers provided';
      mainSheet.getCell(currentRow, 1).alignment = { horizontal: 'center', vertical: 'middle' };
      mainSheet.getCell(currentRow, 1).font = { italic: true, color: { argb: 'FF6B7280' } };
      
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
    fgColor: { argb: 'FFFEF3C7' }
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
    
    if (colIndex === 1) {
      column.width = Math.min(Math.max(maxLength + 2, 5), 10);
    } else {
      column.width = Math.min(Math.max(maxLength + 2, 20), 80);
    }
  });

  return workbook;
}

// Helper function to group answers by parent question
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

// Helper function to format answer values
function formatAnswerValue(value) {
  if (value === null || value === undefined) {
    return 'No answer provided';
  }
  
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.join(', ');
      } else if (typeof parsed === 'object') {
        return JSON.stringify(parsed);
      } else {
        return String(parsed);
      }
    } catch {
      return value;
    }
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
}