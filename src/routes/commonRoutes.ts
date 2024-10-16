import { Router } from "express";
import {
  forgetPassword,
  resetPassword,
  login,
  logout,
  signup,
  googleAuthenticate,
  googleCallback,
  refresh,
} from "../services/commonServices";
import { search } from "../services/searchServices";
import { verifyJWT } from "../middlewares/authMiddlewares";
import passport from "passport";

const commonRoutes = Router();

commonRoutes.post("/login", login);

commonRoutes.post("/signup", signup);

commonRoutes.get("/search", search);

commonRoutes.get("/logout", verifyJWT, logout);

commonRoutes.post("/forget_password", forgetPassword);

commonRoutes.post("/reset_password", resetPassword);

commonRoutes.get("/auth/google", googleAuthenticate);

commonRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    session: false,
  }),
  googleCallback
);

commonRoutes.get("/auth/google/refresh", refresh);

export default commonRoutes;
