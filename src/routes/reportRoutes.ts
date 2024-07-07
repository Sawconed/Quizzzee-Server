import { Router } from "express";
import {
  createReport,
  deleteReport,
  getReportById,
  resolveReport,
  getReports,
} from "../services/reportServices";
import {
  verifyAdmin,
  verifyJWT,
  verifySuperAdmin,
  verifyUser,
} from "../middlewares/authMiddlewares";

const reportRoutes = Router();

reportRoutes.get("/", verifyJWT, verifyAdmin, getReports);

reportRoutes.get("/sadmin", verifyJWT, verifySuperAdmin, getReports);

reportRoutes.get("/:reportId", verifyJWT, verifyAdmin, getReportById);

reportRoutes.post("/", verifyJWT, verifyUser, createReport);

reportRoutes.patch("/", verifyJWT, verifyAdmin, resolveReport);

reportRoutes.delete("/:reportId", verifyJWT, verifyAdmin, deleteReport);

export default reportRoutes;
