import { Router } from "express";
import { blockUser, deleteUser, getUser, getUsers, unblockUser, updateUser } from "../services/userServices";

const userRoutes = Router();

userRoutes.get("/", getUsers);

userRoutes.get("/:userId", getUser);

// userRoutes.post("/"); // Not supported

userRoutes.put("/:userId", updateUser);

userRoutes.put("/block/:userId", blockUser);

userRoutes.put("/unblock/:userId", unblockUser);

userRoutes.delete("/:userId", deleteUser);

export default userRoutes;