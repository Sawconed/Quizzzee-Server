import { Router } from "express";
import { login, loginAdmin, logout, signup } from "../services/commonServices";
import { search } from "../services/searchServices";

const commonRoutes = Router();

commonRoutes.post("/login", login);

commonRoutes.post("/signup", signup);

commonRoutes.post("/login/admin", loginAdmin);

commonRoutes.get("/search", search);

commonRoutes.get("/logout", logout);

export default commonRoutes;
