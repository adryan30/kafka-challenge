import "dotenv/config";
import { app } from "./app";

const PORT = process.env.PORT || 3333;
async function run() {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

run().catch(console.error);
