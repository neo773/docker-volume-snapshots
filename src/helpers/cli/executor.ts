import { execSync } from "child_process";

export class CliExecutor {
  static exec(command: string): string {
    try {
      return execSync(command, { encoding: "utf8", stdio: "pipe" });
    } catch (error) {
      throw new Error(`Command failed: ${command}\n${error}`);
    }
  }

  static execQuiet(command: string): string {
    return CliExecutor.exec(command).trim();
  }

  static execLines(command: string): string[] {
    return CliExecutor.execQuiet(command)
      .split("\n")
      .filter((line) => line.trim());
  }
}
