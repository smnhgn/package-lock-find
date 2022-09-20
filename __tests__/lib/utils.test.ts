import { readPackageLock } from "../../src/lib/utils";

test("readPackageLock", async () => {
  expect(readPackageLock("__tests__/fixtures/empty")).resolves.toEqual({
    name: "empty",
    lockfileVersion: 2,
    packages: {},
    dependencies: {},
  });

  expect(readPackageLock("__tests__/fixtures/missing")).rejects.toThrow();
});
