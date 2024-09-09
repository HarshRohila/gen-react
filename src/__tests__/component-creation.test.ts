import { $ } from "zx/core";
import { expectFileContent } from "../test-utils";

describe("Component Creation", () => {
  beforeEach(async () => {
    await $`pnpm clear`;
  });

  afterAll(async () => {
    await $`pnpm clear`;
  });

  it("creates component", async () => {
    await $`tsx ./src/index.ts c AwesomeComponent`;

    const expectedFilePath = "./src/components/AwesomeComponent/component.tsx";

    const expectedContent = `import React, { FC } from "react";

			interface AwesomeComponentProps {}
			
			const AwesomeComponent: FC<AwesomeComponentProps> = () => {
				return <div>AwesomeComponent Component</div>;
			};
			
			export { AwesomeComponent };`;

    await expectFileContent(expectedFilePath, expectedContent);
  });

  it("creates feature component", async () => {
    await $`tsx ./src/index.ts c AwesomeComponent -f awesome-feat`;

    const expectedFilePath =
      "./src/features/awesome-feat/components/AwesomeComponent/component.tsx";

    const expectedContent = `import React, { FC } from "react";

			interface AwesomeComponentProps {}
			
			const AwesomeComponent: FC<AwesomeComponentProps> = () => {
				return <div>AwesomeComponent Component</div>;
			};
			
			export { AwesomeComponent };`;

    await expectFileContent(expectedFilePath, expectedContent);
  });
});
