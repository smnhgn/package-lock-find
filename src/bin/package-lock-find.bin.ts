#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program
  .action(() => {
    console.log("package-lock-find works!");
  })
  .parse(process.argv);
