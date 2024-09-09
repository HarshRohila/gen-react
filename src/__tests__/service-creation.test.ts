import { $ } from "zx/core";
import { expectFileContent } from "../test-utils";

describe("Service Creation", () => {
  beforeEach(async () => {
    await $`pnpm clear`;
  });

  afterAll(async () => {
    await $`pnpm clear`;
  });

  it("creates service", async () => {
    await $`tsx ./src/index.ts s person`;

    const expectedFilePath = "./src/features/person/services/PersonService.ts";

    const expectedContent = `const PersonService = {};

		export { PersonService };`;

    await expectFileContent(expectedFilePath, expectedContent);
  });

  it("creates service within feature", async () => {
    await $`tsx ./src/index.ts s person -f user`;

    const expectedFilePath = "./src/features/user/services/PersonService.ts";

    const expectedContent = `const PersonService = {};

		export { PersonService };`;

    await expectFileContent(expectedFilePath, expectedContent);
  });
});
