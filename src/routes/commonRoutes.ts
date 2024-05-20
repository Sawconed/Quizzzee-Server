
import { Router } from "express";
import { login, logout, signup } from "../services/commonServices";



const commonRoutes = Router();

commonRoutes.post('/login', login);

commonRoutes.post('/signup', signup);

commonRoutes.get('/logout', logout);

export default commonRoutes;