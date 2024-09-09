import { $ } from "zx/core";
import { expectFileContent } from "../test-utils";

describe("Redux Slice Creation", () => {
  beforeEach(async () => {
    await $`pnpm clear`;
  });

  afterAll(async () => {
    await $`pnpm clear`;
  });

  it("creates redux-slice", async () => {
    await $`tsx ./src/index.ts rs counter`;

    const expectedFilePath = "./src/redux/slices/counter/index.ts";

    const expectedContent = `const initialState = {};

		const counterSlice = createSlice({
			name: "counter",
			initialState,
			reducers: {},
		});
		
		export const {} = counterSlice.actions;
		export default counterSlice.reducer;
		`;

    await expectFileContent(expectedFilePath, expectedContent);
  });

  it("creates redux-slice with hyphen in name", async () => {
    await $`tsx ./src/index.ts rs global-state`;

    const expectedFilePath = "./src/redux/slices/global-state/index.ts";

    const expectedContent = `const initialState = {};

		const globalStateSlice = createSlice({
			name: "global-state",
			initialState,
			reducers: {},
		});
		
		export const {} = globalStateSlice.actions;
		export default globalStateSlice.reducer;
		`;

    await expectFileContent(expectedFilePath, expectedContent);
  });
});
