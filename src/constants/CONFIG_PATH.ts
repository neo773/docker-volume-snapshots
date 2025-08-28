import path from "path";
import os from "os";

export const CONFIG_PATH = path.join(
  os.homedir(),
  ".orbstack-volume-manager",
  "config.json",
);
