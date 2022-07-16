#!/usr/bin/env node
import { Command } from "commander";

const program = new Command();

program
  .action(() => {
    console.log("ts-cli-starter works!");
  })
  .parse(process.argv);
