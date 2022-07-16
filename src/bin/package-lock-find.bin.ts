#!/usr/bin/env node
import { Command } from "commander";

import { findDependencyByName, readPackageLock } from "../lib/utils";
import { PackageLock } from "../types/package-lock";

const program = new Command();

program
  .version("0.0.1")
  .argument("<dependency>", "name of dependency")
  .option("-p, --path <path>", "path to package-lock.json", "./")
  .action(async (dependencyName, options) => {
    const packageLock: PackageLock = await readPackageLock(options.path);
    const dependencyResults = findDependencyByName(dependencyName, packageLock.dependencies);
    const formattedResults = dependencyResults.map((dependencyResult) => {
      return dependencyResult.history
        .map(([name, dependency]) => `${name}@${dependency.version}`)
        .join(" => ");
    });

    console.log(JSON.stringify(formattedResults, null, 2));
  })
  .parse(process.argv);
