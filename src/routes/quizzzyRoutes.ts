import { Router } from "express";
import {
   getAllQuizzzy, getQuizzzy, createQuizzzy, updateQuizzzy,deleteQuizzzy
} from "../services/quizzzyServices"

const quizzzyRoutes = Router();

quizzzyRoutes.get("/", getAllQuizzzy)
quizzzyRoutes.get("/:quizzzyId", getQuizzzy)
quizzzyRoutes.post("/", createQuizzzy)
quizzzyRoutes.put("/:quizzzyId", updateQuizzzy)
quizzzyRoutes.delete("/:quizzzyId", deleteQuizzzy)

export default quizzzyRoutes;