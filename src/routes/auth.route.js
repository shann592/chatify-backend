import { Router } from "express";

const router = Router();

router.get("/signup", (req, res, next) => {
  res.send("signup");
});
router.get("/login", (req, res, next) => {
  res.send("login");
});
router.get("/logout", (req, res, next) => {
  res.send("logout");
});

export default router;
