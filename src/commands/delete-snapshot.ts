import fs from "fs";
import path from "path";
import { SNAPSHOT_DIR } from "../constants/SNAPSHOT_DIR";

export async function deleteSnapshot(
  snapshotName: string,
  skipConfirm: boolean,
): Promise<void> {
  const snapshotPath = path.join(SNAPSHOT_DIR, snapshotName);

  if (!fs.existsSync(snapshotPath)) {
    throw new Error(`Snapshot not found: ${snapshotPath}`);
  }

  if (!skipConfirm) {
    console.error(
      `Error: Deleting '${snapshotName}' cannot be undone. Pass --yes to confirm.`,
    );
    process.exit(1);
  }

  fs.unlinkSync(snapshotPath);
  console.log(`Deleted snapshot: ${snapshotName}`);
}
