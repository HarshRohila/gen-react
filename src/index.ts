#!/usr/bin/env -S npx tsx
import { $, argv } from "zx";
import path from "path";
import { fileURLToPath } from "url";
import { readdir } from "fs/promises";
import { join } from "path";

const PLACEHOLDER = "templatename";

const [type, componentName] = argv._;

const projectPath = process.cwd();

switch (type) {
  case "c": {
    await createComponent(componentName, "src/components");
  }
  case "fc": {
    const featureFolder = pascalToHyphenated(componentName);
    await createComponent(componentName, `src/features/${featureFolder}`);
  }
}

async function createComponent(componentName: string, componentPath: string) {
  const targetPath = path.relative(
    projectPath,
    path.join(componentPath, componentName)
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

function hyphenatedToPascal(name: string): string {
  return name
    .split("-") // Split the string by hyphens
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
    .join(""); // Join the words back together without spaces
}

function pascalToHyphenated(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1-$2") // Add hyphen between lowercase and uppercase letters
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2") // Add hyphen between consecutive uppercase letters
    .toLowerCase(); // Convert to lowercase
}
