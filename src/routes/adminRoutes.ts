import { Router } from "express";
import { blockAdmin, createAdmin, deleteAdmin, getAdmin, getAdmins, unblockAdmin } from "../services/adminServices";

const adminRoutes = Router();

adminRoutes.get("/", getAdmins); // Only return admins that are not super admins

adminRoutes.get("/:adminId", getAdmin);

adminRoutes.post("/", createAdmin);

// adminRoutes.put("/:adminId", updateAdmin); // Not supported

adminRoutes.put("/block/:adminId", blockAdmin); // Block admin

adminRoutes.put("/unblock/:adminId", unblockAdmin); // Block admin

adminRoutes.delete("/:adminId", deleteAdmin);

export default adminRoutes;