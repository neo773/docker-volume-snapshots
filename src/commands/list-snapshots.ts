import path from "path";
import { SNAPSHOT_DIR } from "../constants/SNAPSHOT_DIR";
import { FileUtils } from "../utils/file-utils";

export async function listSnapshots(json: boolean): Promise<void> {
  const snapshots = FileUtils.listSnapshots();

  if (snapshots.length === 0) {
    if (json) {
      console.log("[]");
    } else {
      console.log(`No snapshots found in ${SNAPSHOT_DIR}`);
    }
    return;
  }

  if (json) {
    const data = snapshots.map((filename) => ({
      filename,
      size: FileUtils.getSize(path.join(SNAPSHOT_DIR, filename)),
    }));
    console.log(JSON.stringify(data, null, 2));
  } else {
    for (const filename of snapshots) {
      const size = FileUtils.getSize(path.join(SNAPSHOT_DIR, filename));
      console.log(`${filename}  (${size})`);
    }
  }
}
