import { ConfigManager } from "../utils/config-manager";

export async function setupContainer(
  containerName: string,
  volumeName: string,
): Promise<void> {
  ConfigManager.saveConfig(containerName, {
    CONTAINER: containerName,
    VOLUME: volumeName,
  });

  console.log(`Configuration saved: ${containerName} -> ${volumeName}`);
}
