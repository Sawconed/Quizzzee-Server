import { Router } from "express";
import {
   getAllQuizzzy, getQuizzzy, createQuizzzy, updateQuizzzy,deleteQuizzzy,
   blockQuizzzy, unblockQuizzzy
} from "../services/quizzzyServices"

const quizzzyRoutes = Router();

quizzzyRoutes.get("/", getAllQuizzzy)
quizzzyRoutes.get("/:quizzzyId", getQuizzzy)
quizzzyRoutes.post("/", createQuizzzy)
quizzzyRoutes.put("/:quizzzyId", updateQuizzzy)
quizzzyRoutes.delete("/:quizzzyId", deleteQuizzzy)
quizzzyRoutes.patch("/:quizzzyId/block", blockQuizzzy);
quizzzyRoutes.patch("/:quizzzyId/unblock", unblockQuizzzy);
export default quizzzyRoutes;