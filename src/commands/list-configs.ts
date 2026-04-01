import { ConfigManager } from "../utils/config-manager";

export async function listConfigs(json: boolean): Promise<void> {
  const configFile = ConfigManager.loadConfigFile();
  const names = Object.keys(configFile.configs);

  if (names.length === 0) {
    if (json) {
      console.log("{}");
    } else {
      console.log("No configurations found. Run 'dvs setup' first.");
    }
    return;
  }

  if (json) {
    console.log(JSON.stringify(configFile.configs, null, 2));
  } else {
    for (const name of names) {
      const config = configFile.configs[name]!;
      console.log(`${name}  container=${config.CONTAINER}  volume=${config.VOLUME}`);
    }
  }
}
