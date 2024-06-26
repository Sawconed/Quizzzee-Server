import { Router } from "express";
import { login, logout, signup } from "../services/commonServices";
import { search } from "../services/searchServices";
import { verifyJWT, verifyUser } from "../middlewares/authMiddlewares";

const commonRoutes = Router();

commonRoutes.post("/login", login);

commonRoutes.post("/signup", signup);

commonRoutes.get("/search", search);

commonRoutes.get("/logout", verifyJWT, verifyUser, logout);

export default commonRoutes;
