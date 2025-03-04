import './env.js';
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import trackUsers from "./scripts/tracker.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  trackUsers()
  setInterval(trackUsers, 60000);
});