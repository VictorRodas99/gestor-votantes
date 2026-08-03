---
name: commit-style-match
description: Analyze a git repository's existing commit history, extract the exact commit message convention used, and commit pending changes following that same convention — one commit per file where possible, grouping only tightly coupled files. Use this whenever the user asks to commit changes, stage work, write commit messages, clean up a dirty working tree, or mentions matching the repo's commit style. Never include author names or attribution in the messages.
---

# Commit Style Match

Commit uncommitted work using **the repository's own commit message convention**, inferred from its history — not a generic or assumed convention.

## Core rules

1. **The existing history is the spec.** Never impose Conventional Commits (or any other style) unless the history already uses it.
2. **One file per commit by default.** Group files into a single commit only when they are genuinely inseparable.
3. **No attribution, ever.** No author names, no `Co-authored-by:`, no "Generated with…", no tool or assistant mentions, no emoji signatures. The message describes *only* what changed.
4. **Never invent scope.** Only describe changes actually present in the diff.

## Workflow

### Step 1 — Read the current state

```bash
git rev-parse --is-inside-work-tree     # confirm it's a repo
git status --porcelain=v1              # what's pending
git diff                               # unstaged changes
git diff --cached                      # already-staged changes
```

If the working tree is clean, say so and stop.

If changes are already staged, do not silently reset them — mention it and ask whether to commit them as staged or re-split them per file.

### Step 2 — Extract the commit message pattern

Read enough history to see the pattern clearly:

```bash
git log -n 40 --pretty=format:'%s'                    # subjects only
git log -n 15 --pretty=format:'---%n%s%n%n%b'         # subjects + bodies
git log -n 40 --pretty=format:'%s' --name-only        # message ↔ file scope
```

Fill in this checklist before writing anything:

| Attribute | What to determine |
|---|---|
| **Prefix** | Is there one? (`feat:`, `fix:`, `[FIX]`, `FIX -`, `update:`, none) Exact spelling, punctuation, spacing |
| **Scope** | `feat(auth):` style scope? Is it a module, folder, or filename? |
| **Case** | lowercase-everything, Sentence case, or Title Case after the prefix |
| **Mood/tense** | Imperative ("add validation") vs past ("added validation") vs gerund ("adding validation") |
| **Language** | English, Portuguese, etc. — match the history, not the user's chat language |
| **Length** | Typical subject length; is there a hard wrap around 50/72 chars? |
| **Punctuation** | Trailing period or not |
| **Ticket refs** | `ABC-123`, `#42` — where they appear (prefix vs suffix) and whether they're on *every* commit or only some |
| **Body** | Do commits normally have bodies? Bullet list or prose? If most commits are subject-only, write subject-only |
| **Granularity** | Do past commits touch one file or many? Mirror that habit |

If the history is inconsistent, follow the **most recent 10–15 commits**, since that reflects the current convention. If the repo has fewer than ~5 commits or no discernible pattern, state that plainly and propose a simple, neutral convention (`short imperative summary, lowercase, no period`) before committing.

State the detected pattern back to the user in one or two lines before committing, e.g.:
> Detected pattern: `type(scope): lowercase imperative summary`, no trailing period, subject-only, ~50 chars, Portuguese.

### Step 3 — Group the changed files

Default: **one commit per file.**

Group into a single commit only when the files cannot stand alone:

- A source file and its dedicated test file, when the test only covers the new behavior
- A manifest and its lockfile (`package.json` + `package-lock.json`, `pyproject.toml` + `uv.lock`, `Gemfile` + `Gemfile.lock`)
- A rename/move that spans several files, or a symbol rename touching multiple call sites
- Generated output plus its source (schema → generated types, `.proto` → stubs)
- A component and its co-located style/index files created in the same change

Do **not** group merely because files sit in the same folder, were edited in the same session, or share a general theme.

Untracked files count as changes to commit, but skip anything that looks like build output, dependency directories, local env files, credentials, or large binaries. Flag those and suggest `.gitignore` instead of committing them.

### Step 4 — Write each message from the diff

For each group, read its diff before writing:

```bash
git diff -- <path>            # or: git diff --cached -- <path>
```

The message is a plain summary of what the change does. Derive it from the diff, not the filename. When several unrelated edits sit in one file, summarize the dominant change and, if the pattern allows bodies, list the rest as bullets.

**Forbidden in every message:** author names, usernames, emails, `Co-authored-by`, `Signed-off-by` (unless the existing history already uses it), assistant/tool attribution, "as requested", "per review by X".

### Step 5 — Commit

Stage and commit each group separately:

```bash
git add -- <path...>
git commit -m "<message>"
```

For a multi-line message matching a body-using pattern, use repeated `-m` flags:

```bash
git commit -m "<subject>" -m "<body>"
```

Never use `git add -A` or `git add .` — always name the exact paths, so an unintended file can't slip into a commit.

Do not use `--author`, `--amend`, or `--no-verify` unless explicitly asked. If a pre-commit hook fails, stop, report the failure, and let the user decide.

### Step 6 — Verify and report

```bash
git log -n <count> --pretty=format:'%h %s' --name-only
git status --porcelain=v1
```

Confirm every intended file is committed and nothing unintended went along. Report the list of commits created. **Do not push** unless asked.

## Examples

Given a history like:

```
fix(api): handle null response from payment gateway
feat(auth): add refresh token rotation
chore(deps): bump axios to 1.7.4
```

Detected pattern: `type(scope): lowercase imperative summary`, no trailing period, subject-only, scope = module name.

Pending: `src/auth/session.ts` (added session expiry check), `src/auth/session.test.ts` (tests for it), `README.md` (fixed a broken link).

Resulting commits:

```
feat(auth): add session expiry check        →  src/auth/session.ts, src/auth/session.test.ts
docs: fix broken link in setup section      →  README.md
```

The two auth files ship together because the test only exercises the new check; the README is unrelated and gets its own commit.

---

Given a history like:

```
Ajusta validação do formulário de cadastro
Corrige cálculo do frete para pedidos internacionais
Remove logs de debug do checkout
```

Detected pattern: Portuguese, no prefix, third-person present, Sentence case, no trailing period, one file per commit.

A change adding a CPF field to the registration form becomes:

```
Adiciona campo de CPF no formulário de cadastro
```

Not `feat: add CPF field` — the repo's language and prefix-free style win.