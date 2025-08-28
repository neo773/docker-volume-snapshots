import { DockerCli } from "../helpers/cli/docker";
import { Prompts } from "../helpers/tui/prompts";
import { ConfigManager } from "../utils/config-manager";

export async function setupContainer(): Promise<void> {
  console.log("⚙️ Container Setup\n");

  const containers = DockerCli.listContainers();
  if (containers.length === 0) {
    throw new Error("No containers found");
  }

  const containerName = await Prompts.select(
    "Select container:",
    containers.map((name) => ({ title: name, value: name })),
  );

  const volumes = DockerCli.getContainerVolumes(containerName);
  if (volumes.length === 0) {
    throw new Error(`No volumes found for container '${containerName}'`);
  }

  const volumeName = await Prompts.select(
    "Select volume:",
    volumes.map((name) => ({ title: name, value: name })),
  );

  ConfigManager.saveConfig(containerName, {
    CONTAINER: containerName,
    VOLUME: volumeName,
  });

  console.log(`✅ Configuration saved: ${containerName} -> ${volumeName}`);
}
