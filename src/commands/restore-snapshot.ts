import path from "path";
import { SNAPSHOT_DIR } from "../constants/SNAPSHOT_DIR";
import { DockerCli } from "../helpers/cli/docker";
import { OrbStackCli } from "../helpers/cli/orbstack";
import { ConfigManager } from "../utils/config-manager";

export async function restoreSnapshot(
  configName: string,
  snapshotName: string,
  skipConfirm: boolean,
): Promise<void> {
  const config = ConfigManager.getConfig(configName);
  const snapshotPath = path.join(SNAPSHOT_DIR, snapshotName);

  if (!skipConfirm) {
    console.error(
      `Error: Restoring to volume '${config.VOLUME}' will overwrite existing data. Pass --yes to confirm.`,
    );
    process.exit(1);
  }

  console.log(`Restoring ${snapshotName} to volume: ${config.VOLUME}`);

  DockerCli.stopContainer(config.CONTAINER);
  OrbStackCli.importVolume(snapshotPath, config.VOLUME);
  DockerCli.startContainer(config.CONTAINER);

  console.log(`Restored to volume: ${config.VOLUME}`);
}
