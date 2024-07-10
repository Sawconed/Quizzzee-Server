import { Router } from "express";
import { forgetPassword, login, logout, signup } from "../services/commonServices";
import { search } from "../services/searchServices";
import { verifyJWT } from "../middlewares/authMiddlewares";

const commonRoutes = Router();

commonRoutes.post("/login", login);

commonRoutes.post("/signup", signup);

commonRoutes.get("/search", search);

commonRoutes.get("/logout", verifyJWT, logout);

commonRoutes.put("/forget-password", forgetPassword);

export default commonRoutes;
