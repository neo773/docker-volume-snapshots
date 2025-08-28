import { DockerCli } from "../helpers/cli/docker";
import { OrbStackCli } from "../helpers/cli/orbstack";
import { Prompts } from "../helpers/tui/prompts";
import { ConfigManager } from "../utils/config-manager";
import { FileUtils } from "../utils/file-utils";

export async function createSnapshot(): Promise<void> {
  if (!ConfigManager.hasConfigs()) {
    throw new Error("No configurations found. Run setup first.");
  }

  const configName = await Prompts.select(
    "Select configuration:",
    ConfigManager.listConfigs().map((name) => ({ title: name, value: name })),
  );

  const config = ConfigManager.getConfig(configName);
  console.log(`\n📦 Creating snapshot for: ${config.VOLUME}`);

  const filename = await Prompts.text(
    "Snapshot filename (or leave blank for auto):",
    "",
  );

  const outputPath = filename
    ? FileUtils.resolveSnapshotPath(filename)
    : FileUtils.resolveSnapshotPath(
        FileUtils.generateSnapshotName(config.VOLUME),
      );

  console.log(`💾 Saving to: ${outputPath}`);
  console.log("⏳ Exporting...");

  DockerCli.stopContainer(config.CONTAINER);

  OrbStackCli.exportVolume(config.VOLUME, outputPath);

  DockerCli.startContainer(config.CONTAINER);

  const size = FileUtils.getSize(outputPath);
  console.log(`✅ Snapshot created: ${size}`);
}
