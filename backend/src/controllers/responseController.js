import { ResponseModel } from "../models/responseModel.js";
import { AnswerModel } from "../models/answerModel.js";
import { QuestionModel } from "../models/questionModel.js";
import { VisitorModel } from "../models/visitorModel.js";
import { generatePdfFromResponse } from "../utils/pdfGenerator.js";

export const submitResponse = async (req, res, next) => {
  try {
    const formId = req.params.formId;
    // visitorId may come from body if frontend created visitor first
    const { visitorId = null, submitted_by_user = null, answers = [] } = req.body;

    // if visitorId is provided but numeric string, accept it. No login required.
    const responseId = await ResponseModel.create({ form_id: formId, visitor_id: visitorId, submitted_by_user });

    // answers expected: [{ question_id, value, file_path? }]
    for (const a of answers) {
      const val = a.value === undefined ? null : (typeof a.value === "object" ? JSON.stringify(a.value) : String(a.value));
      await AnswerModel.create({ response_id: responseId, question_id: a.question_id, value: val, file_path: a.file_path || null });
    }

    res.status(201).json({ responseId });
  } catch (err) {
    next(err);
  }
};

export const getResponses = async (req, res, next) => {
  try {
    const formId = req.params.formId;
    const rows = await ResponseModel.findByFormId(formId);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const getResponsePdf = async (req, res, next) => {
  try {
    const responseId = req.params.responseId;
    const response = await ResponseModel.findById(responseId);
    if (!response) return res.status(404).json({ message: "response not found" });

    const answers = await AnswerModel.findByResponseId(responseId);
    const questions = await QuestionModel.findByFormId(response.form_id);

    // generate a PDF buffer
    const pdfBuffer = await generatePdfFromResponse({ response, answers, questions });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="response_${responseId}.pdf"`,
      "Content-Length": pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};
