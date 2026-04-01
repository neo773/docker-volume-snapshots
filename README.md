# OrbStack Volume Manager

CLI tool for creating and restoring Docker volume snapshots using OrbStack's native export/import functionality.

## Usage

```bash
npm install -g docker-volume-snapshot

dvs --help
```

## Prerequisites

- [OrbStack](https://orbstack.dev/) installed and running
- Docker containers with named volumes

## Commands

### Setup a container-volume configuration

```bash
dvs setup --container my-app --volume my-app-data
```

### Create a snapshot

```bash
dvs create --config my-app
dvs create --config my-app --filename my-backup
```

### Restore a snapshot

```bash
dvs restore --config my-app --snapshot my-backup.tar.zst --yes
```

### Delete a snapshot

```bash
dvs delete --snapshot my-backup.tar.zst --yes
```

### List resources

```bash
dvs list snapshots
dvs list configs
dvs list containers
dvs list volumes --container my-app
```

All list commands support `--json` for machine-readable output:

```bash
dvs list snapshots --json
dvs list configs --json
```

## Configuration

Configurations are stored as JSON in `~/.orbstack-volume-manager/config.json`:

```json
{
  "configs": {
    "my-app": {
      "CONTAINER": "my-app",
      "VOLUME": "my-app-data"
    }
  }
}
```

## Snapshots

Snapshots are saved to `~/orbstack-snapshots/` as compressed `.tar.zst` files with automatic timestamped names or custom filenames.

## Development

```bash
bun install
bun src/entrypoint.ts --help
```
