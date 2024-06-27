import { Router } from "express";
import {
  blockAdmin,
  createAdmin,
  deleteAdmin,
  getAdmin,
  getAdmins,
  unblockAdmin,
} from "../services/adminServices";
import {
  verifyJWT,
  verifyAdmin,
  verifySuperAdmin,
} from "../middlewares/authMiddlewares";

const adminRoutes = Router();

adminRoutes.get("/", verifyJWT, verifySuperAdmin, getAdmins); // Only return admins that are not super admins

adminRoutes.get("/:adminId", verifyJWT, verifySuperAdmin, getAdmin);

adminRoutes.post("/", verifyJWT, verifySuperAdmin, createAdmin);

// adminRoutes.put("/:adminId", updateAdmin); // Not supported

adminRoutes.put("/block/:adminId", verifyJWT, verifySuperAdmin, blockAdmin); // Block admin

adminRoutes.put("/unblock/:adminId", verifyJWT, verifySuperAdmin, unblockAdmin); // Block admin

adminRoutes.delete("/:adminId", verifyJWT, verifySuperAdmin, deleteAdmin);

export default adminRoutes;
