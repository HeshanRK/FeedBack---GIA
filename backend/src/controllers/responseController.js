import { ResponseModel } from "../models/responseModel.js";
import { AnswerModel } from "../models/answerModel.js";
import { QuestionModel } from "../models/questionModel.js";
import { VisitorModel } from "../models/visitorModel.js";
import { generatePdfFromResponse } from "../utils/pdfGenerator.js";

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

    // Validate visitor exists if visitorId provided
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

    // Save answers
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

    const answers = await AnswerModel.findByResponseId(responseId);
    const questions = await QuestionModel.findByFormId(response.form_id);

    // Generate PDF buffer
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