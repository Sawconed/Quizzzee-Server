import { Router } from "express";
import {
  getAllQuizzz,
  getQuizzz,
  createQuizzz,
  updateQuizzz,
  deleteQuizzz,
  createMultipleQuizzz,
  deleteAllQuizzzes,
} from "../services/quizzzServices";
import { verifyJWT, verifyUser } from "../middlewares/authMiddlewares";

const quizzzRoutes = Router();

quizzzRoutes.get("/", getAllQuizzz);
quizzzRoutes.get("/:quizzzId", getQuizzz);
quizzzRoutes.post("/", verifyJWT, verifyUser, createQuizzz);
quizzzRoutes.post("/multiple", verifyJWT, verifyUser, createMultipleQuizzz);
quizzzRoutes.put("/:quizzzId", verifyJWT, verifyUser, updateQuizzz);
quizzzRoutes.delete("/:quizzzId", verifyJWT, verifyUser, deleteQuizzz);
quizzzRoutes.delete("/", verifyJWT, verifyUser, deleteAllQuizzzes);

export default quizzzRoutes;
