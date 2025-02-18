import { TargetService } from './TargetService.js';
import { Router } from "express";
import { TargetController } from "./TargetController.js";
import { TornApiService } from '../../service/TornApiService.js';
import { BaldrsListService } from '../../service/BaldrsListService.js';

const tornService = new TornApiService()
const blService = new BaldrsListService(tornService)
const targetService = new TargetService(tornService, blService)
const targetController = new TargetController(targetService)

const router = Router();

router.get("/", targetController.getTargets.bind(targetController));

export default router;
