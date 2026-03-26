import { Router } from "express";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkUser,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkUser);
export default router;
