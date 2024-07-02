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
import {
  verifyAdmin,
  verifyJWT,
  verifyUser,
} from "../middlewares/authMiddlewares";

const quizzzyRoutes = Router();

quizzzyRoutes.get("/", getAllQuizzzy);
quizzzyRoutes.get("/:quizzzyId", getQuizzzy);
quizzzyRoutes.get(
  "/:userId/my_quizzzy",
  verifyJWT,
  verifyUser,
  getAllQuizzzyWithUserID
);
quizzzyRoutes.get(
  "/:userId/favorite",
  verifyJWT,
  verifyUser,
  getAllFavoriteQuizzzy
);
quizzzyRoutes.post("/", verifyJWT, verifyUser, createQuizzzy);
quizzzyRoutes.put("/:quizzzyId", verifyJWT, verifyUser, updateQuizzzy);
quizzzyRoutes.delete("/:quizzzyId", verifyJWT, verifyUser, deleteQuizzzy);
quizzzyRoutes.patch("/:quizzzyId/block", verifyJWT, verifyAdmin, blockQuizzzy); //**Admin */
quizzzyRoutes.patch(
  "/:quizzzyId/unblock",
  verifyJWT,
  verifyAdmin,
  unblockQuizzzy
); //**Admin */

quizzzyRoutes.post("/:quizzzyId/exam", createExam);
quizzzyRoutes.post("/:quizzzyId/submit", submitAnswer);

quizzzyRoutes.get("/export/sample/excel", downloadExcelSample);
quizzzyRoutes.get("/export/sample/csv", downloadCSVSample);
quizzzyRoutes.get("/export/:quizzzyId", exportQuizzzy);

export default quizzzyRoutes;
