import "dotenv/config";

import { createApp } from "./app.js";
import { loadConfig } from "./config/index.js";
import { bootstrap } from "./bootstrap.js";

const config = loadConfig();
const db = bootstrap(config);
const app = createApp({ config, db });

const server = app.listen(config.port, () => {
  console.log(`API IT-equipment sur http://localhost:${config.port} (${config.nodeEnv})`);
});

function arreter() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}
process.on("SIGINT", arreter);
process.on("SIGTERM", arreter);
