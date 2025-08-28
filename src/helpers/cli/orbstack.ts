import { CliExecutor } from "./executor";

export class OrbStackCli {
  static listVolumes(): string[] {
    return CliExecutor.execLines("orb docker volume ls --quiet");
  }

  static exportVolume(volumeName: string, outputPath: string): void {
    CliExecutor.exec(
      `orb docker volume export "${volumeName}" "${outputPath}"`,
    );
  }

  static importVolume(inputPath: string, volumeName?: string): void {
    const nameFlag = volumeName ? `--name "${volumeName}"` : "";
    CliExecutor.exec(`orb docker volume import "${inputPath}" ${nameFlag}`);
  }

  static isAvailable(): boolean {
    try {
      CliExecutor.exec("which orb");
      return true;
    } catch {
      return false;
    }
  }
}
