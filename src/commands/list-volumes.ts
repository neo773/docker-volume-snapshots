import { DockerCli } from "../helpers/cli/docker";

export async function listVolumes(
  containerName: string,
  json: boolean,
): Promise<void> {
  const volumes = DockerCli.getContainerVolumes(containerName);

  if (volumes.length === 0) {
    if (json) {
      console.log("[]");
    } else {
      console.log(`No volumes found for container '${containerName}'.`);
    }
    return;
  }

  if (json) {
    console.log(JSON.stringify(volumes, null, 2));
  } else {
    for (const name of volumes) {
      console.log(name);
    }
  }
}
