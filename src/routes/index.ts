import express from "express";
import targetsRoute from "./targets/route.js";

const router = express.Router();

router.use("/targets", targetsRoute);

export default router;