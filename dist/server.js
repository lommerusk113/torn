import "./env.js";
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import trackUsers from "./scripts/tracker.js";
import WarTrackerRepository from "./repository/WarTrackerRepository.js";
import ApiKeyRepository from "./repository/ApiKeyRepository.js";
import { TornApiService } from "./service/TornApiService.js";
import { WarTracker } from "./service/WarTrackerService.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use("/api", routes);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const runInterval = async (fn, interval) => {
    while (true) {
        await fn();
        await sleep(interval);
    }
};
const warTracker = new WarTracker(new WarTrackerRepository(), new ApiKeyRepository(), new TornApiService());
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    trackUsers();
    warTracker.getEnemy();
    Promise.all([
        runInterval(() => console.log("Health check: ", new Date()), 60 * 1000 * 15),
        runInterval(() => trackUsers(), 60 * 1000),
        runInterval(() => warTracker.getEnemy(), 5 * 60 * 1000),
        runInterval(() => warTracker.track(), 1000),
        runInterval(() => warTracker.toggleUpdateBsp(), 15 * 60 * 1000),
    ]);
});
