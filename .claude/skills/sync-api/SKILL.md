---
name: sync-api
description: Sync the local `api/` code (CodeIgniter 3) with what runs in production, via rsync over SSH plus git as a safety net. Use when asked to sync/update/pull the API, run the server rsync, "sincronizar la api", "actualizar api desde producción", check what the provider changed in `Eleccionesapi.php`, or before re-testing the server-side pendings.
---

# Sync `api/` from production

The `api/` code **lives on the server** (`elecciones.appbinario.com`, bitbucket repo
`joncar/jr`, owned by the provider). Locally there are our own adjustments that the server
would overwrite. The sync is **one-way: production → local**. Nothing is ever pushed up.

> **Output language:** everything this skill produces for the repo or the user — commit
> messages, updates to `notes/`, the final report, any comment written into `api/` — must be
> **in Spanish**, matching the existing history and notes. These instructions are English;
> the artifacts are not.

Two layers of protection:

1. **rsync excludes** — files that must never come from the server.
2. **Git as a safety net** — everything else is allowed to be overwritten, but **only after
   committing**, so `git diff` shows exactly what the server brought and local work can be
   restored selectively.

Fixed facts:

| Item | Value |
| --- | --- |
| Local repo | `~/binario/elecciones/api` (separate git repo, gitignored by the frontend) |
| Branch | `local/docker-pre-rsync` |
| Host | `jorge@elecciones.appbinario.com` |
| Key | `~/binario/certificados/sysventas-aws-2.pem` |
| Remote path | `/var/www/html/elecciones/` |
| Container | `elecciones_api` (mounts `api/` as a volume → **no rebuild needed**) |

Long-form reference: `notes/api/comando-actualizar-api.md`.

## Quick check (no rsync)

If the question is just "did the controller change?", **do not sync**. Pull the file into a
scratchpad and diff it — this touches nothing in `api/` and needs no clean tree:

```sh
ssh -i ~/binario/certificados/sysventas-aws-2.pem jorge@elecciones.appbinario.com \
  'cat /var/www/html/elecciones/application/modules/api/controllers/Eleccionesapi.php' \
  > "$SCRATCH/prod-Eleccionesapi.php"
diff "$SCRATCH/prod-Eleccionesapi.php" \
  ~/binario/elecciones/api/application/modules/api/controllers/Eleccionesapi.php
```

## Sync, step by step

### 1. Get the tree clean (mandatory)

```sh
cd ~/binario/elecciones/api
git branch --show-current    # must be local/docker-pre-rsync
git status --short
```

If there are uncommitted changes, **commit them before the rsync** (descriptive message, in
Spanish, matching the existing history). This is the step that guarantees nothing is lost: if
the tree is dirty and the changes are not yours to commit, **stop and report**, don't sync
anyway.

### 2. Dry run

```sh
rsync -avzn -e "ssh -i ~/binario/certificados/sysventas-aws-2.pem" \
  --exclude='frontend/' --exclude='vendor/' --exclude='.git/' \
  --exclude='application/logs/' \
  --exclude='application/config/database.php' --exclude='.env' \
  jorge@elecciones.appbinario.com:/var/www/html/elecciones/ ./
```

Never add `--delete`. The excludes are fixed: `database.php` and `.env` hold the local Docker
credentials (deliberately with no production fallback); the rest is noise.

Read the listing: if `index.php` or `Eleccionesapi.php` show up, expect a decision in step 4.

### 3. Real rsync

Same command **without the `n`** (`-avz`).

### 4. Review what the server overwrote

```sh
git status --short    # M = overwritten by the server, ?? = new file from the server
git diff
```

File by file:

- **Server wins** (provider improvements, or it already contains our deployed work) → do nothing.
- **Local wins** → `git restore <file>`.
- **Mixed** (server and we touched different parts) → `git restore -p <file>`, or merge by hand.

**`index.php` is always restored**: local uses
`define('ENVIRONMENT', getenv('CI_ENV') ?: 'development')`, the server hardcodes it.

```sh
git restore index.php
```

`application/modules/api/controllers/Eleccionesapi.php` is the other file with local history:
if there were endpoints of ours not yet deployed, compare carefully before letting the server win.

### 5. Commit the synced state

```sh
git add -A
git commit -m "sync servidor YYYY-MM-DD (resumen de lo que trajo)"
```

History format (keep it, in Spanish): `sync servidor 2026-08-05 (votaciones escribe barrio_id;
ruta elecciones/(.+) en routes)`. Two syncs in one day get a `b`, `c` suffix.

### 6. Check the container is still healthy

The volume picks up changes without a rebuild, but confirm the API still answers:

```sh
curl -s "http://localhost:8090/api/Eleccionesapi/sectores?limit=1" | head -c 300
```

If something broke: `docker compose -f database/compose.yaml up -d --force-recreate api`.

### 7. Post-sync (don't skip)

Provider progress arrives **only** through this channel, so after every sync:

- **Diff the controller** against the previous commit and summarize which endpoints, filters
  or fields are new:
  ```sh
  git diff HEAD~1 -- application/modules/api/controllers/Eleccionesapi.php
  ```
- **Re-test the live pendings** in `notes/api/pendientes-server.md` against local **and**
  production, and update that note (in Spanish) with the result and the date.
- If new endpoints/fields appeared, update `notes/api/documentation.md` (and
  `escritura-votaciones.md` if the `/votaciones` POST changed).
- **An existing column ≠ a POST that writes it**: the DB and the controller advance
  separately. Check both layers — `SHOW COLUMNS` on the DB **and** the method's `$data` array
  in the controller — before calling a field resolved.
- Only then assess whether the frontend can take advantage (a new server-side filter, a field
  that no longer needs mitigation in the service's `map*`).

## Final report

Close with (in Spanish): what the server brought (files + functional summary), what was
restored locally, the commit created, and which `pendientes-server.md` items changed state.
If nothing changed, say so in one line — that's a valid and frequent outcome.
