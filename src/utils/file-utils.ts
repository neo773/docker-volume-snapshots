import fs from "fs";
import path from "path";
import { SNAPSHOT_DIR } from "../constants/SNAPSHOT_DIR";

export class FileUtils {
  static ensureDir(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  static exists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  static getSize(filePath: string): string {
    const stats = fs.statSync(filePath);
    const mb = stats.size / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }

  static listSnapshots(): string[] {
    if (!fs.existsSync(SNAPSHOT_DIR)) {
      return [];
    }

    return fs
      .readdirSync(SNAPSHOT_DIR)
      .filter((file) => file.endsWith(".tar.zst"))
      .sort((a, b) => {
        const statA = fs.statSync(path.join(SNAPSHOT_DIR, a));
        const statB = fs.statSync(path.join(SNAPSHOT_DIR, b));
        return statB.mtime.getTime() - statA.mtime.getTime();
      });
  }

  static generateSnapshotName(volumeName: string): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const dateStr = `${day}-${month}-${year}`;

    const randomWords = [
      "crimson",
      "dawn",
      "ember",
      "frost",
      "golden",
      "harbor",
      "ivory",
      "jade",
      "kaleidoscope",
      "lunar",
      "mystic",
      "nebula",
      "ocean",
      "pearl",
      "quartz",
      "ruby",
      "sapphire",
      "twilight",
      "umbra",
      "velvet",
      "whisper",
      "xenial",
      "yearning",
      "zenith",
      "azure",
      "breeze",
      "cascade",
      "dew",
      "ethereal",
      "fern",
      "gossamer",
      "harmony",
    ];

    const wordOne = randomWords[Math.floor(Math.random() * randomWords.length)];
    const wordTwo = randomWords[Math.floor(Math.random() * randomWords.length)];

    return `${volumeName}-${dateStr}-${wordOne}-${wordTwo}.tar.zst`;
  }

  static resolveSnapshotPath(filename: string): string {
    if (!filename.endsWith(".tar.zst")) {
      filename += ".tar.zst";
    }

    if (path.isAbsolute(filename)) {
      return filename;
    }

    FileUtils.ensureDir(SNAPSHOT_DIR);
    return path.join(SNAPSHOT_DIR, filename);
  }
}
