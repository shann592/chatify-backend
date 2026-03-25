import { Router } from "express";

const router = Router();

router.get("/send", (req, res, next) => {
  res.send("send message endpoint");
});

export default router;
