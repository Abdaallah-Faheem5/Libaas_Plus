import "dotenv/config";
import { sql } from "drizzle-orm";
import app from "./app.js";
import  db  from "./configs/db.config.js";


async function startServer() {
  try {
    await db.execute(sql`SELECT 1`);
    console.log("Connected to MySQL successfully");

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });

  } catch (err) {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  }
}

startServer();