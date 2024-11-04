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
  updatePassword,
} from "../services/commonServices";
import { search } from "../services/searchServices";
import { verifyJWT } from "../middlewares/authMiddlewares";
import passport from "passport";

const commonRoutes = Router();

commonRoutes.post("/login", login);

commonRoutes.post("/signup", signup);

commonRoutes.get("/search", search);

commonRoutes.get("/logout", verifyJWT, logout);

commonRoutes.post("/forgetPassword", forgetPassword);

commonRoutes.patch("/resetPassword", resetPassword);

commonRoutes.patch("/updatePassword", updatePassword);

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
