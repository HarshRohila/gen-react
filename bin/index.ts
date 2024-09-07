#!/usr/bin/env -S npx tsx
import { $, argv } from "zx";
import path from "path";
import { fileURLToPath } from "url";
import { readdir } from "fs/promises";
import { join } from "path";

const component = argv.c;

const projectPath = process.cwd();

if (component) {
  const targetPath = path.relative(projectPath, `src/components/${component}`);
  const templatePath = path.join(getDirName(), "../templates/component");
  console.log(templatePath, targetPath);

  await $`mkdir -p ${targetPath}`;

  const files = await readdir(templatePath);

  for (const file of files) {
    const sourceFile = join(templatePath, file);

    let destFileName = file;
    if (file.includes("templatename")) {
      destFileName = file.replace("templatename", component);
    }

    const destFile = join(targetPath, destFileName);

    // Use sed to replace "templatename" with "Harsh" in each file and save changes to a temporary file
    await $`sed 's/templatename/${component}/g' ${sourceFile} > ${destFile}`;

    // Optionally, move the processed file to the destination directory (done by sed already)
    // If you want to delete the original file:
    // await $`mv ${destFile} ${destinationDir}`;
  }
}

function getDirName() {
  const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
  const __dirname = path.dirname(__filename); // get the name of the directory
  return __dirname;
}
