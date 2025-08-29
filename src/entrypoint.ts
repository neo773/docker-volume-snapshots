#!/usr/bin/env node
import { createSnapshot } from "./commands/create-snapshot";
import { deleteSnapshot } from "./commands/delete-snapshot";
import { restoreSnapshot } from "./commands/restore-snapshot";
import { setupContainer } from "./commands/setup-container";
import { OrbStackCli } from "./helpers/cli/orbstack";
import { Prompts } from "./helpers/tui/prompts";

async function main(): Promise<void> {
  console.log("🚀 OrbStack Volume Manager\n");

  if (!OrbStackCli.isAvailable()) {
    throw new Error("OrbStack CLI not found. Install OrbStack first.");
  }

  while (true) {
    const action = await Prompts.select("Choose action:", [
      { title: "📦 Create Snapshot", value: "create" },
      { title: "📥 Restore Snapshot", value: "restore" },
      { title: "🗑️  Delete Snapshot", value: "delete" },
      { title: "⚙️  Setup Container", value: "setup" },
    ]);

    switch (action) {
      case "create":
        await createSnapshot();
        await waitForKeyPress();
        console.clear();
        console.log("🚀 OrbStack Volume Manager\n");
        break;
      case "restore":
        await restoreSnapshot();
        return;
      case "delete":
        await deleteSnapshot();
        await waitForKeyPress();
        console.clear();
        console.log("🚀 OrbStack Volume Manager\n");
        break;
      case "setup":
        await setupContainer();
        await waitForKeyPress();
        console.clear();
        console.log("🚀 OrbStack Volume Manager\n");
        break;
    }
  }
}

async function waitForKeyPress(): Promise<void> {
  console.log("\n📋 Press any key to continue...");
  await new Promise<void>((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.once("data", () => {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      resolve();
    });
  });
}

process.on("SIGINT", () => {
  console.log("\n👋 Goodbye!");
  process.exit(0);
});

main().catch((error) => {
  console.error(`\n❌ ${error.message}`);
  process.exit(1);
});
