import fs from "fs";
import path from "path";
import { SNAPSHOT_DIR } from "../constants/SNAPSHOT_DIR";
import { Prompts } from "../helpers/tui/prompts";
import { FileUtils } from "../utils/file-utils";

export async function deleteSnapshot(): Promise<void> {
  const snapshots = FileUtils.listSnapshots();
  if (snapshots.length === 0) {
    throw new Error(`No snapshots found in ${SNAPSHOT_DIR}`);
  }

  const selectedSnapshot = await Prompts.select(
    "Select snapshot to delete:",
    snapshots.map((filename) => ({
      title: `${filename} (${FileUtils.getSize(path.join(SNAPSHOT_DIR, filename))})`,
      value: filename,
    })),
  );

  const snapshotPath = path.join(SNAPSHOT_DIR, selectedSnapshot);

  const confirmed = await Prompts.confirm(
    `⚠️  Delete snapshot '${selectedSnapshot}'? This action cannot be undone!`,
    false,
  );

  if (!confirmed) {
    console.log("❌ Cancelled");
    return;
  }

  console.log("🗑️ Deleting snapshot...");

  fs.unlinkSync(snapshotPath);

  console.log(`✅ Deleted snapshot: ${selectedSnapshot}`);
}