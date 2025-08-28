import fs from "fs";
import path from "path";
import type { Config, ConfigFile } from "../types/config";
import { CONFIG_PATH } from "../constants/CONFIG_PATH";

export class ConfigManager {
  private static ensureConfigDir(): void {
    const dir = path.dirname(CONFIG_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  static loadConfigFile(): ConfigFile {
    if (!fs.existsSync(CONFIG_PATH)) {
      return { configs: {} };
    }

    try {
      const content = fs.readFileSync(CONFIG_PATH, "utf8");
      return JSON.parse(content);
    } catch {
      return { configs: {} };
    }
  }

  static saveConfigFile(configFile: ConfigFile): void {
    ConfigManager.ensureConfigDir();
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(configFile, null, 2));
  }

  static getConfig(name: string): Config {
    const configFile = ConfigManager.loadConfigFile();
    const config = configFile.configs[name];

    if (!config) {
      throw new Error(`Configuration '${name}' not found`);
    }

    return config;
  }

  static saveConfig(name: string, config: Config): void {
    const configFile = ConfigManager.loadConfigFile();
    configFile.configs[name] = config;
    ConfigManager.saveConfigFile(configFile);
  }

  static listConfigs(): string[] {
    const configFile = ConfigManager.loadConfigFile();
    return Object.keys(configFile.configs);
  }

  static hasConfigs(): boolean {
    return ConfigManager.listConfigs().length > 0;
  }
}
