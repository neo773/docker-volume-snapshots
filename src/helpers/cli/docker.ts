import { CliExecutor } from "./executor";

export class DockerCli {
  static listContainers(): string[] {
    return CliExecutor.execLines('docker ps -a --format "{{.Names}}"');
  }

  static getContainerVolumes(containerName: string): string[] {
    const command = `docker inspect ${containerName} --format '{{range .Mounts}}{{if eq .Type "volume"}}{{.Name}}{{"\\n"}}{{end}}{{end}}'`;
    return CliExecutor.execLines(command);
  }

  static stopContainer(containerName: string): void {
    CliExecutor.exec(`docker stop ${containerName}`);
  }

  static startContainer(containerName: string): void {
    CliExecutor.exec(`docker start ${containerName}`);
  }
}
