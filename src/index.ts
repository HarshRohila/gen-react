#!/usr/bin/env -S npx tsx
import { $, argv, chalk } from "zx";
import path from "path";
import { fileURLToPath } from "url";
import { readdir } from "fs/promises";
import { join } from "path";

const PLACEHOLDER = "templatename";
const CAMELCASE_PLACEHOLDER = "templateName";

const { f: featureName } = argv;
const [type, name] = argv._;

const projectPath = process.cwd();

switch (type) {
  case "c": {
    if (featureName) {
      await createComponent(name, `src/features/${featureName}/components`);
    } else {
      await createComponent(name, "src/components");
    }
    break;
  }
  case "s": {
    await createService(name);
    break;
  }
  case "rs": {
    await createReduxSlice(name);
    break;
  }
}

async function createReduxSlice(name: string) {
  const targetPath = await setTargetPath(`src/redux/slices/${name}`);
  await copyFiles(name, targetPath, "redux-slice");
}

async function setTargetPath(path: string) {
  await $`mkdir -p ${path}`;
  return path;
}

async function createService(serviceName: string) {
  const fName = featureName || serviceName;

  const targetPath = await setTargetPath(`src/features/${fName}/services`);

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
    const camelCase = kebabToCamelCase(componentName);
    await $`sed -i '' 's/${CAMELCASE_PLACEHOLDER}/${camelCase}/g' ${destFile}`;
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

function kebabToCamelCase(str: string): string {
  return str.replace(/-./g, (match) => match[1].toUpperCase());
}
