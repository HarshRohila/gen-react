#!/usr/bin/env -S npx tsx
import { $, argv, chalk } from "zx";
import path from "path";
import { fileURLToPath } from "url";
import { readdir } from "fs/promises";
import { join } from "path";

const PLACEHOLDER = "templatename";

const { f: featureName } = argv;
const [type, name] = argv._;

let componentName = "";
let serviceName = "";

if (type === "c") {
  componentName = name;
} else if (type == "s") {
  serviceName = name;
}

const projectPath = process.cwd();

if (featureName && componentName) {
  await createComponent(
    componentName,
    `src/features/${featureName}/components`
  );
} else if (componentName) {
  await createComponent(componentName, "src/components");
} else if (serviceName) {
  await createService(serviceName);
}

async function createService(serviceName: string) {
  const fName = featureName || serviceName;

  const targetPath = `src/features/${fName}/services`;

  await $`mkdir -p ${targetPath}`;

  const templatePath = path.join(getDirName(), `../templates/service`);
  const files = await readdir(templatePath);

  const pascalServiceName = hyphenatedToPascal(serviceName);

  for (const file of files) {
    const sourceFile = join(templatePath, file);

    let destFileName = file;
    if (file.includes(PLACEHOLDER)) {
      destFileName = file.replace(PLACEHOLDER, pascalServiceName);
    }

    const destFile = join(targetPath, destFileName);

    await $`sed 's/${PLACEHOLDER}/${pascalServiceName}/g' ${sourceFile} > ${destFile}`;
    logCreatedFile(destFile);
  }
}

function logCreatedFile(filePath: string) {
  console.log(chalk.green(`Created ${filePath}`));
}

async function createComponent(componentName: string, componentPath: string) {
  const targetPath = path.relative(
    projectPath,
    path.join(componentPath, componentName)
  );

  await $`mkdir -p ${targetPath}`;

  await copyFiles(componentName, targetPath, "component");
}

async function copyFiles(
  componentName: string,
  targetPath: string,
  templateName: string
) {
  const templatePath = path.join(getDirName(), `../templates/${templateName}`);

  const files = await readdir(templatePath);

  for (const file of files) {
    const sourceFile = join(templatePath, file);

    let destFileName = file;
    if (file.includes(PLACEHOLDER)) {
      destFileName = file.replace(PLACEHOLDER, componentName);
    }

    const destFile = join(targetPath, destFileName);

    await $`sed 's/${PLACEHOLDER}/${componentName}/g' ${sourceFile} > ${destFile}`;
    logCreatedFile(destFile);
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
