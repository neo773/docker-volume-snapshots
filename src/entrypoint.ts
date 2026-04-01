#!/usr/bin/env node
import { Command } from "commander";
import { createSnapshot } from "./commands/create-snapshot";
import { deleteSnapshot } from "./commands/delete-snapshot";
import { restoreSnapshot } from "./commands/restore-snapshot";
import { setupContainer } from "./commands/setup-container";
import { listSnapshots } from "./commands/list-snapshots";
import { listConfigs } from "./commands/list-configs";
import { listContainers } from "./commands/list-containers";
import { listVolumes } from "./commands/list-volumes";
import { OrbStackCli } from "./helpers/cli/orbstack";

const program = new Command();

program
  .name("dvs")
  .description("Docker volume snapshot manager using OrbStack")
  .version("0.0.6")
  .hook("preAction", () => {
    if (!OrbStackCli.isAvailable()) {
      console.error("Error: OrbStack CLI not found. Install OrbStack first.");
      process.exit(1);
    }
  });

program
  .command("create")
  .description("Create a snapshot of a Docker volume")
  .requiredOption("--config <name>", "Name of the saved configuration to use")
  .option("--filename <name>", "Custom snapshot filename (auto-generated if omitted)")
  .action(async (opts) => {
    await createSnapshot(opts.config, opts.filename);
  });

program
  .command("restore")
  .description("Restore a snapshot to a Docker volume")
  .requiredOption("--config <name>", "Name of the saved configuration to restore to")
  .requiredOption("--snapshot <name>", "Snapshot filename to restore")
  .option("--yes", "Skip confirmation prompt", false)
  .action(async (opts) => {
    await restoreSnapshot(opts.config, opts.snapshot, opts.yes);
  });

program
  .command("delete")
  .description("Delete a snapshot file")
  .requiredOption("--snapshot <name>", "Snapshot filename to delete")
  .option("--yes", "Skip confirmation prompt", false)
  .action(async (opts) => {
    await deleteSnapshot(opts.snapshot, opts.yes);
  });

program
  .command("setup")
  .description("Save a container-volume configuration")
  .requiredOption("--container <name>", "Docker container name")
  .requiredOption("--volume <name>", "Docker volume name")
  .action(async (opts) => {
    await setupContainer(opts.container, opts.volume);
  });

const list = program
  .command("list")
  .description("List resources");

list
  .command("snapshots")
  .description("List available snapshots")
  .option("--json", "Output as JSON", false)
  .action(async (opts) => {
    await listSnapshots(opts.json);
  });

list
  .command("configs")
  .description("List saved configurations")
  .option("--json", "Output as JSON", false)
  .action(async (opts) => {
    await listConfigs(opts.json);
  });

list
  .command("containers")
  .description("List Docker containers")
  .option("--json", "Output as JSON", false)
  .action(async (opts) => {
    await listContainers(opts.json);
  });

list
  .command("volumes")
  .description("List volumes for a container")
  .requiredOption("--container <name>", "Docker container name")
  .option("--json", "Output as JSON", false)
  .action(async (opts) => {
    await listVolumes(opts.container, opts.json);
  });

program.parseAsync().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
