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
app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
    trackUsers();
    getEnemy();
    setInterval(trackUsers, 60000);
    setInterval(getEnemy, 5 * 60 * 1000);
    setInterval(track, 1000);
});
