import { DockerCli } from "../helpers/cli/docker";

export async function listContainers(json: boolean): Promise<void> {
  const containers = DockerCli.listContainers();

  if (containers.length === 0) {
    if (json) {
      console.log("[]");
    } else {
      console.log("No containers found.");
    }
    return;
  }

  if (json) {
    console.log(JSON.stringify(containers, null, 2));
  } else {
    for (const name of containers) {
      console.log(name);
    }
  }
}
