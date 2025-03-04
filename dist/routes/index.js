import express from "express";
import targetsRoute from "./targets/route.js";
import trackerRoute from "./faction/route.js";
const router = express.Router();
router.use("/targets", targetsRoute);
router.use("/faction", trackerRoute);
export default router;
