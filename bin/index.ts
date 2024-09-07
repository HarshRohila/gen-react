#!/usr/bin/env -S npx tsx
import { $, argv } from "zx";
import path from "path";
import { fileURLToPath } from "url";
import { readdir } from "fs/promises";
import { join } from "path";

const PLACEHOLDER = "templatename";

const componentName = argv.c;

const projectPath = process.cwd();

if (componentName) {
  const targetPath = path.relative(
    projectPath,
    `src/components/${componentName}`
  );
  const templatePath = path.join(getDirName(), "../templates/component");

  await $`mkdir -p ${targetPath}`;

  const files = await readdir(templatePath);

  for (const file of files) {
    const sourceFile = join(templatePath, file);

    let destFileName = file;
    if (file.includes(PLACEHOLDER)) {
      destFileName = file.replace(PLACEHOLDER, componentName);
    }

    const destFile = join(targetPath, destFileName);

    await $`sed 's/${PLACEHOLDER}/${componentName}/g' ${sourceFile} > ${destFile}`;
  }
}

function getDirName() {
  const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
  const __dirname = path.dirname(__filename); // get the name of the directory
  return __dirname;
}
