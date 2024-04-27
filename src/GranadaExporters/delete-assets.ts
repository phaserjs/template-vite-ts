import { rm } from "fs/promises";
import path from "path";

// Calculate the path to the assets directory
const assetsDirPath = path.resolve("dist", "assets");
console.log(`Deleting ${assetsDirPath}...`);

// Use fs.rm to delete the assets directory recursively
rm(assetsDirPath, { recursive: true, force: true })
  .then(() => {
    console.log(`${assetsDirPath} was successfully deleted.`);
  })
  .catch((err) => {
    console.error(`Failed to delete ${assetsDirPath}:`, err);
    process.exit(1); // Exit with an error code
  });
