---
description: >
  SSH skill — use when asked to SSH, connect to a remote machine, read a remote
  file, run a command on a server, pull secrets or config from a remote host,
  or access the Home Assistant mini PC / HA host. Known hosts: HA mini PC at
  192.168.245.166 (LAN) or 100.83.181.21 (Tailscale). Trigger phrases: "ssh",
  "remote machine", "mini PC", "read secrets", "connect to", "run on the server",
  "pull from HA host", "ha secrets", "secrets.yaml", "hermes config".
allowed-tools:
  - Bash
argument-hint: "[user@host] [command or file path]"
---

# SSH Skill

You can run SSH commands via Bash. Use this to connect to remote machines,
read files, or run commands — including pulling secrets from the HA mini PC.

## Request

$ARGUMENTS

---

## Known Hosts

| Label | LAN | Tailscale |
|-------|-----|-----------|
| HA mini PC | 192.168.245.166 | 100.83.181.21 |

HA config directory: `/config/` (HAOS) or `/homeassistant/` depending on install type.
Hermes config: `~/.hermes/.env`
OpenClaw secrets: `~/.openclaw/workspace/.ha_env` ← HA long-lived token lives here
Common secrets locations: `~/.openclaw/workspace/.ha_env`, `/config/secrets.yaml`, `~/.hermes/.env`, `~/.env`

---

## Step 0 — Check SSH availability

```bash
which ssh || echo "SSH not available in this environment"
```

If SSH is not available, tell the user: *"SSH isn't available in this cloud environment.
Run `/ssh` locally where you have network access to the target machine."*

---

## Connecting

Use strict-host-key-checking=no and batch mode to avoid interactive prompts:

```bash
ssh -o StrictHostKeyChecking=no -o BatchMode=yes USER@HOST "COMMAND"
```

If that fails with "Permission denied (publickey)" — key auth isn't set up. Try:

```bash
ssh -o StrictHostKeyChecking=no USER@HOST "COMMAND"
# User will be prompted for password — that's expected
```

---

## Common Tasks

### Read HA secrets file
```bash
ssh -o StrictHostKeyChecking=no USER@192.168.245.166 "cat /config/secrets.yaml 2>/dev/null || cat /homeassistant/secrets.yaml 2>/dev/null"
```

### Read Hermes env config
```bash
ssh -o StrictHostKeyChecking=no USER@192.168.245.166 "cat ~/.hermes/.env 2>/dev/null"
```

### List HA config directory
```bash
ssh -o StrictHostKeyChecking=no USER@192.168.245.166 "ls -la /config/ 2>/dev/null || ls -la /homeassistant/ 2>/dev/null"
```

### Find token in any secrets file
```bash
ssh -o StrictHostKeyChecking=no USER@192.168.245.166 \
  "grep -rh 'token\|TOKEN\|api_key\|API_KEY' ~/.hermes/ ~/.env /config/secrets.yaml /homeassistant/secrets.yaml 2>/dev/null"
```

### Run arbitrary command
```bash
ssh -o StrictHostKeyChecking=no USER@HOST "COMMAND"
```

---

## After Pulling the Token

If the goal is to fill in `.claude/settings.json`:

1. Extract the token value from the remote file output
2. Update `.claude/settings.json`:
   - Replace both `REPLACE_WITH_LONG_LIVED_TOKEN` entries with the actual token
3. Commit and push

**Never log or display the full token value in plain text** — truncate to first 8 chars
when confirming: `eyJhbGci...` (showing only enough to verify it was retrieved).

---

## Routing

- If `$ARGUMENTS` contains a host and command → run that directly
- If `$ARGUMENTS` mentions "secrets", "token", "HA", or is empty → default to HA mini PC secrets hunt
- If `$ARGUMENTS` mentions "hermes" → read `~/.hermes/.env` on the mini PC
- Always ask for the SSH username if not provided and not obvious from context
