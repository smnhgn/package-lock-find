#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";

import { findDependency, findPackage, readPackageLock } from "../lib/utils";
import { PackageLock } from "../types/package-lock";

const { version } = require("../../package.json");

const program = new Command();

program
  .version(version, "-v, --version")
  .argument("<name>", "name of package/dependency")
  .option("-p, --path <path>", "path to package-lock.json", "./")
  .action(async (name, { path }) => {
    const packageLock: PackageLock = await readPackageLock(path);
    const results =
      packageLock.lockfileVersion === 2
        ? findPackage(name, packageLock.packages)
        : findDependency(name, packageLock.dependencies);
    const formattedResults = results.map(({ history }) => {
      return history.map(([name, { version }]) => `${name}@${version}`).join(" => ");
    });

    if (formattedResults.length === 0) {
      throw new Error(chalk.yellow(`package/dependency ${name} not found`));
    }

    for (const result of formattedResults) {
      console.log(chalk.blue(result));
    }
  })
  .parse(process.argv);
