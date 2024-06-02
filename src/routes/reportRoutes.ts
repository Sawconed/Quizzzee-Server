import { Router } from "express";
import { createReport, deleteReport, getReportById, getReports } from "../services/reportServices";

const reportRoutes = Router();

reportRoutes.get("/", getReports);

reportRoutes.get("/:reportId", getReportById);

reportRoutes.post("/", createReport);

reportRoutes.delete("/:reportId", deleteReport);

export default reportRoutes;