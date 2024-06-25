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
  getAllFavoriteQuizzzy,
  exportQuizzzy,
} from "../services/quizzzyServices";

import { createExam, submitAnswer } from "../services/examServices";

const quizzzyRoutes = Router();

quizzzyRoutes.get("/", getAllQuizzzy);
quizzzyRoutes.get("/:quizzzyId", getQuizzzy);
quizzzyRoutes.get("/:userId/my_quizzzy", getAllQuizzzyWithUserID);
quizzzyRoutes.get("/:userId/favorite", getAllFavoriteQuizzzy);
quizzzyRoutes.post("/", createQuizzzy);
quizzzyRoutes.put("/:quizzzyId", updateQuizzzy);
quizzzyRoutes.delete("/:quizzzyId", deleteQuizzzy);
quizzzyRoutes.patch("/:quizzzyId/block", blockQuizzzy);
quizzzyRoutes.patch("/:quizzzyId/unblock", unblockQuizzzy);

quizzzyRoutes.post("/:quizzzyId/exam", createExam);
quizzzyRoutes.post("/:quizzzyId/submit", submitAnswer);

quizzzyRoutes.get("/export/sample/excel", downloadExcelSample);
quizzzyRoutes.get("/export/sample/csv", downloadCSVSample);
quizzzyRoutes.get("/export/:quizzzyId", exportQuizzzy);

export default quizzzyRoutes;
