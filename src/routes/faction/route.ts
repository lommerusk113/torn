import { Router } from "express";
import { TornApiService } from '../../service/TornApiService.js';
import { BaldrsListService } from '../../service/BaldrsListService.js';
import { TrackerController } from './track/TrackerController.js';
import { TrackerRepository } from './track/TrackerRespository.js';
import { TrackerService } from "./track/TrackerService.js";

const tornService = new TornApiService()
const trackerRepository = new TrackerRepository()
const trackerService = new TrackerService(tornService, trackerRepository)
const trackerController = new TrackerController(trackerService)

const router = Router();

router.get("/addTracker", trackerController.addTracker.bind(trackerController));
router.get("/removeTracker", trackerController.removeTracker.bind(trackerController));
router.get("/getAllTrackers", trackerController.getAllTrackers.bind(trackerController));

router.get("/getAllMembers", trackerController.getAllMembers.bind(trackerController));
router.get("/getMember", trackerController.getMemberHistory.bind(trackerController));

export default router;
