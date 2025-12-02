/* cSpell:disable */
import { ResponseModel } from "../models/responseModel.js";
import { AnswerModel } from "../models/answerModel.js";
import { QuestionModel } from "../models/questionModel.js";
import { VisitorModel } from "../models/visitorModel.js";
import { generatePdfFromResponse } from "../utils/pdfGenerator.js";
import { generateFeedbackExcel } from "../utils/excelGenerator.js";

export const submitResponse = async (req, res, next) => {
  try {
    const formId = req.params.formId;
    
    if (!formId || isNaN(formId)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }
    
    const { visitorId = null, submitted_by_user = null, answers = [] } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Answers are required" });
    }

    if (visitorId) {
      const visitor = await VisitorModel.findById(visitorId);
      if (!visitor) {
        return res.status(400).json({ message: "Invalid visitor ID" });
      }
    }

    const responseId = await ResponseModel.create({ 
      form_id: formId, 
      visitor_id: visitorId, 
      submitted_by_user 
    });

    for (const a of answers) {
      if (!a.question_id) {
        console.warn("Skipping answer without question_id:", a);
        continue;
      }
      
      const val = a.value === undefined || a.value === null 
        ? null 
        : (typeof a.value === "object" ? JSON.stringify(a.value) : String(a.value));
        
      await AnswerModel.create({ 
        response_id: responseId, 
        question_id: a.question_id, 
        value: val, 
        file_path: a.file_path || null 
      });
    }

    res.status(201).json({ responseId });
  } catch (err) {
    console.error("Error submitting response:", err);
    next(err);
  }
};

export const getResponses = async (req, res, next) => {
  try {
    const formId = req.params.formId;
    
    if (!formId || isNaN(formId)) {
      return res.status(400).json({ message: "Invalid form ID" });
    }
    
    const rows = await ResponseModel.findByFormId(formId);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching responses:", err);
    next(err);
  }
};

export const getResponsePdf = async (req, res, next) => {
  try {
    const responseId = req.params.responseId;
    
    if (!responseId || isNaN(responseId)) {
      return res.status(400).json({ message: "Invalid response ID" });
    }
    
    const response = await ResponseModel.findById(responseId);
    if (!response) {
      return res.status(404).json({ message: "Response not found" });
    }

    // Use the method that includes question text
    const answers = await AnswerModel.findByResponseIdWithQuestions(responseId);
    const questions = await QuestionModel.findByFormId(response.form_id);

    const pdfBuffer = await generatePdfFromResponse({ response, answers, questions });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="response_${responseId}.pdf"`,
      "Content-Length": pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("Error generating PDF:", err);
    next(err);
  }
};

export const getResponseDetails = async (req, res, next) => {
  try {
    const responseId = req.params.responseId;
    
    if (!responseId || isNaN(responseId)) {
      return res.status(400).json({ message: "Invalid response ID" });
    }

    // FIXED: Use method that includes question text
    const answers = await AnswerModel.findByResponseIdWithQuestions(responseId);
    
    if (!answers || answers.length === 0) {
      return res.status(404).json({ message: "Response not found" });
    }

    res.json(answers);
  } catch (err) {
    console.error("Error fetching response details:", err);
    next(err);
  }
};

export const downloadAllResponses = async (req, res, next) => {
  try {
    const { startDate, endDate, formId } = req.query;

    let query = `
      SELECT 
        r.id,
        r.submitted_at,
        f.title AS form_title,
        v.name AS visitor_name,
        v.type AS visitor_type,
        v.organization,
        v.id_number,
        v.purpose
      FROM responses r
      LEFT JOIN visitors v ON r.visitor_id = v.id
      LEFT JOIN forms f ON r.form_id = f.id
      WHERE 1=1
    `;

    const params = [];

    if (formId) {
      query += " AND r.form_id = ?";
      params.push(formId);
    }

    if (startDate) {
      query += " AND DATE(r.submitted_at) >= ?";
      params.push(startDate);
    }

    if (endDate) {
      query += " AND DATE(r.submitted_at) <= ?";
      params.push(endDate);
    }

    query += " ORDER BY r.submitted_at DESC";

    const { pool } = await import("../config/db.js");
    const [responses] = await pool.query(query, params);

    if (responses.length === 0) {
      return res.status(404).json({
        message: "No responses found for the selected criteria",
      });
    }

    const responsesWithAnswers = await Promise.all(
      responses.map(async (response) => {
        const answers = await AnswerModel.findByResponseIdWithQuestions(
          response.id
        );

        return {
          ...response,
          answers,
        };
      })
    );

    const workbook = await generateFeedbackExcel(responsesWithAnswers);
    const buffer = await workbook.xlsx.writeBuffer();

    res.writeHead(200, {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=FeedbackGIA_Report_${Date.now()}.xlsx`,
      "Content-Length": buffer.length,
    });

    res.end(buffer);
  } catch (err) {
    console.error("Error downloading responses:", err);
    next(err);
  }
};

export const deleteResponse = async (req, res, next) => {
  try {
    const responseId = req.params.responseId;
    
    if (!responseId || isNaN(responseId)) {
      return res.status(400).json({ message: "Invalid response ID" });
    }

    const { pool } = await import("../config/db.js");
    
    await pool.query("DELETE FROM answers WHERE response_id = ?", [responseId]);
    await pool.query("DELETE FROM responses WHERE id = ?", [responseId]);
    
    res.json({ ok: true, message: "Response deleted successfully" });
  } catch (err) {
    console.error("Error deleting response:", err);
    next(err);
  }
};