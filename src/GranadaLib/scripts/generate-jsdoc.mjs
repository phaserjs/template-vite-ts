import { exec } from "child_process";
import path from "path";

const outputDir = path.resolve("./docs");

function generateDocs() {
  // Construct the command to execute JSDoc using the configuration file
  const command = `npx jsdoc -c jsdoc.json -d "${outputDir}" -v`;

  // Execute the command
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error generating JSDoc: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`JSDoc stderr: ${stderr}`);
      return;
    }
    console.log(`JSDoc generated successfully! Output: ${stdout}`);
  });
}

generateDocs();
