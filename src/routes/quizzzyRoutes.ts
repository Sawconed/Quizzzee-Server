import { Router } from "express";
import {
  getAllQuizzzy,
  getQuizzzy,
  createQuizzzy,
  updateQuizzzy,
  deleteQuizzzy,
  blockQuizzzy,
  unblockQuizzzy,
  downloadExcelSample,
  downloadCSVSample,
  getAllQuizzzyWithUserID,
} from "../services/quizzzyServices";

import { createExam, submitAnswer } from "../services/examServices";

const quizzzyRoutes = Router();

quizzzyRoutes.get("/", getAllQuizzzy);
quizzzyRoutes.get("/:quizzzyId", getQuizzzy);
quizzzyRoutes.get("/:userId/my_quizzzy", getAllQuizzzyWithUserID);
quizzzyRoutes.post("/", createQuizzzy);
quizzzyRoutes.put("/:quizzzyId", updateQuizzzy);
quizzzyRoutes.delete("/:quizzzyId", deleteQuizzzy);
quizzzyRoutes.patch("/:quizzzyId/block", blockQuizzzy);
quizzzyRoutes.patch("/:quizzzyId/unblock", unblockQuizzzy);

quizzzyRoutes.post("/exam/submit", submitAnswer);
quizzzyRoutes.post("/exam/:quizzzyId", createExam);

quizzzyRoutes.get("/export/sample/excel", downloadExcelSample);
quizzzyRoutes.get("/export/sample/csv", downloadCSVSample);

export default quizzzyRoutes;
