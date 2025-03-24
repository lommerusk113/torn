import './env.js';
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import trackUsers from "./scripts/tracker.js";
import { getEnemy, track } from "./scripts/factionTracker.js";
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use("/api", routes);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const runInterval = async (fn, interval) => {
    while (true) {
        await fn();
        await sleep(interval);
    }
};
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    trackUsers();
    getEnemy();
    Promise.all([
        runInterval(() => trackUsers(), 60 * 1000),
        runInterval(() => getEnemy(), 5 * 60 * 1000),
        runInterval(() => track(), 1000)
    ]);
});
