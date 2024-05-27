import { Router } from "express";
import { getAllQuizzz, getQuizzz, createQuizzz, updateQuizzz, deleteQuizzz } from "../services/quizzzServices";

const quizzzRoutes = Router();

quizzzRoutes.get("/", getAllQuizzz);
quizzzRoutes.get("/:quizzzId", getQuizzz);
quizzzRoutes.post("/", createQuizzz);
quizzzRoutes.put("/:quizzzId", updateQuizzz);
quizzzRoutes.delete("/:quizzzId", deleteQuizzz);

export default quizzzRoutes;