import * as fs from "fs/promises";

async function expectFileContent(
  expectedFilePath: string,
  expectedContent: string
) {
  const fileExist = await checkFileExists(expectedFilePath);

  expect(fileExist).toBeTruthy();

  if (fileExist) {
    const isHavingExpectedContent = await isContentExpected(
      expectedFilePath,
      expectedContent
    );
    expect(isHavingExpectedContent).toBeTruthy();
  }
}

async function checkFileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

async function isContentExpected(filePath: string, expectedContent: string) {
  function normalizeContent(content: string): string {
    return content
      .replace(/\s+/g, " ") // Replace multiple spaces, tabs, newlines with a single space
      .trim(); // Remove leading/trailing spaces
  }

  const fileContent = await fs.readFile(filePath, "utf-8");

  const normalizedFileContent = normalizeContent(fileContent);
  const normalizedExpectedContent = normalizeContent(expectedContent);

  return normalizedFileContent === normalizedExpectedContent;
}

export { expectFileContent };
