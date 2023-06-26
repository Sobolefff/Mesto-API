import { Router } from "express";
import { getAllUsers, findUserById, createUser } from "../controllers/users";

const router = Router();

router.get("/users", getAllUsers);
router.get("/users/:userId", findUserById);
router.post("/users", createUser);

export default router;
