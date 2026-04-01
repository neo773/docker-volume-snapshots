import { DockerCli } from "../helpers/cli/docker";
import { OrbStackCli } from "../helpers/cli/orbstack";
import { ConfigManager } from "../utils/config-manager";
import { FileUtils } from "../utils/file-utils";

export async function createSnapshot(
  configName: string,
  filename?: string,
): Promise<void> {
  const config = ConfigManager.getConfig(configName);
  console.log(`Creating snapshot for volume: ${config.VOLUME}`);

  const outputPath = filename
    ? FileUtils.resolveSnapshotPath(filename)
    : FileUtils.resolveSnapshotPath(
        FileUtils.generateSnapshotName(config.VOLUME),
      );

  console.log(`Saving to: ${outputPath}`);

  DockerCli.stopContainer(config.CONTAINER);
  OrbStackCli.exportVolume(config.VOLUME, outputPath);
  DockerCli.startContainer(config.CONTAINER);

  const size = FileUtils.getSize(outputPath);
  console.log(`Snapshot created: ${outputPath} (${size})`);
}
