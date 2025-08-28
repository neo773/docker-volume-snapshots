import path from "path";
import { SNAPSHOT_DIR } from "../constants/SNAPSHOT_DIR";
import { DockerCli } from "../helpers/cli/docker";
import { OrbStackCli } from "../helpers/cli/orbstack";
import { Prompts } from "../helpers/tui/prompts";
import { ConfigManager } from "../utils/config-manager";
import { FileUtils } from "../utils/file-utils";

export async function restoreSnapshot(): Promise<void> {
  if (!ConfigManager.hasConfigs()) {
    throw new Error("No configurations found. Run setup first.");
  }

  const configName = await Prompts.select(
    "Select configuration:",
    ConfigManager.listConfigs().map((name) => ({ title: name, value: name })),
  );

  const config = ConfigManager.getConfig(configName);

  const snapshots = FileUtils.listSnapshots();
  if (snapshots.length === 0) {
    throw new Error(`No snapshots found in ${SNAPSHOT_DIR}`);
  }

  const selectedSnapshot = await Prompts.select(
    "Select snapshot:",
    snapshots.map((filename) => ({
      title: `${filename} (${FileUtils.getSize(path.join(SNAPSHOT_DIR, filename))})`,
      value: filename,
    })),
  );

  const snapshotPath = path.join(SNAPSHOT_DIR, selectedSnapshot);

  const confirmed = await Prompts.confirm(
    `⚠️  Restore to volume '${config.VOLUME}'? This will overwrite existing data!`,
    false,
  );

  if (!confirmed) {
    console.log("❌ Cancelled");
    return;
  }

  console.log("⏳ Importing...");

  DockerCli.stopContainer(config.CONTAINER);

  OrbStackCli.importVolume(snapshotPath, config.VOLUME);

  DockerCli.startContainer(config.CONTAINER);

  console.log(`✅ Restored to volume: ${config.VOLUME}`);
}
