---
description: >
  Home Assistant skill — use for any request involving smart home devices, entities,
  automations, dashboards, scenes, scripts, energy, history, sensors, debugging HA
  issues, or building/modifying Lovelace dashboards. Connects via ha-mcp MCP server
  (84+ tools). Trigger phrases: "home assistant", "HA", "automation", "entity",
  "light/switch/sensor/climate/binary_sensor", "dashboard", "Lovelace", "scene",
  "debug HA", "smart home".
allowed-tools:
  - mcp__home-assistant__*
  - Bash
  - Read
  - Write
argument-hint: "[query|automate|debug|dashboard|status|scene|script] <description>"
---

# Home Assistant Skill

You have direct access to the user's Home Assistant instance via the **ha-mcp MCP server** (84+ tools). Use these tools to query, build, debug, and manage their smart home.

## Request

$ARGUMENTS

---

## Step 0 — Verify Connection

Before doing anything else, attempt a lightweight ha-mcp tool call (e.g., list a small set of entities). If it fails or returns a connection error:

```
⚠️  ha-mcp not connected. To set up:

Option A — Add-on (HAOS):
  1. HA → Settings → Add-ons → Store → ⋮ → Repositories → add:
     https://github.com/homeassistant-ai/ha-mcp
  2. Install "Home Assistant MCP Server" → Start
  3. Copy URL from Logs tab:
     🔐 MCP Server URL: http://<ip>:9583/<secret_path>
  4. Run: claude mcp add-json home-assistant '{"type":"http","url":"http://<ip>:9583/<secret_path>"}'

Option B — uvx (local, any OS):
  claude mcp add --transport stdio home-assistant \
    --env HOMEASSISTANT_URL=http://homeassistant.local:8123 \
    --env HOMEASSISTANT_TOKEN=<your_long_lived_token> \
    -- uvx ha-mcp@latest

Then restart Claude Code and retry /ha
```

Stop and show the above if connection fails.

---

## Routing

Route based on the request. If no subcommand is given, infer intent from the full request text.

### `status` — Home overview

Show what's active across the home:

1. Call entity listing tools filtered by: `light`, `switch`, `climate`, `binary_sensor`, `cover`
2. Separate into ON vs OFF/inactive
3. Surface anything unusual (lights on at odd hours, doors open, climate running unoccupied)
4. Show last_changed for active entities

---

### `query <entity or area>` — Entity / history lookup

1. Search for the entity by name or entity_id
2. Fetch full state including all attributes (brightness, temperature, battery, etc.)
3. If history requested, fetch the last N state changes
4. Present as a clean summary table

---

### `automate <description>` — Create or modify an automation

1. List existing automations to check for similar/conflicting ones
2. Draft the automation — show the full YAML before writing anything:

```yaml
alias: <friendly name>
description: <what it does>
trigger:
  - ...
condition:
  - ...
action:
  - ...
mode: single
```

3. **Ask for confirmation before saving.** Never write automations silently.
4. After confirmation, create the automation and report the entity_id assigned

Common patterns:
- Time-based: `sun.sun` triggers, `time` triggers with `input_datetime` helpers
- Presence: `device_tracker` or `person` state changes
- Sensor threshold: `numeric_state` trigger with `above`/`below`
- Notification: `notify.mobile_app_<device>` or `persistent_notification.create`

---

### `debug <entity or automation name>` — Troubleshoot broken behaviour

Systematic diagnosis:

1. **Fetch entity state** — check `state`, `last_changed`, `last_updated`, `attributes`
2. **Check automation traces** — get the last 5 traces for any related automations
3. **Analyse each trace** — look for:
   - Trigger fired but condition blocked → explain which condition failed and why
   - Trigger never fired → check trigger config against current entity state
   - Action errored → show the error message from the trace
4. **Check related entities** — if an automation depends on another entity's state, check that too
5. **Report root cause** with a specific fix
6. **Apply fix** only after confirming with user

Common causes:
- Condition checking presence/time that's never true
- Entity renamed — automation still references old entity_id
- Automation disabled (`automation.turn_off` was called)
- Service no longer available after HA update
- `last_triggered` is null → automation has never run (check trigger)

---

### `dashboard <description>` — Build or update Lovelace

1. Fetch current dashboard list to understand existing layout
2. If updating: fetch the target dashboard config first
3. Draft the card YAML — show it before applying:

```yaml
type: <card-type>
entity: <entity_id>
# ...
```

4. **Confirm before writing.** Show a summary of what will change.
5. Apply and return the dashboard URL

Useful card types: `entities`, `glance`, `gauge`, `history-graph`, `energy-date-selection`, `weather-forecast`, `alarm-panel`, `map`, `picture-entity`

---

### `scene <description>` — Create or activate a scene

1. List existing scenes matching the area/name
2. If creating: draft scene with entity states, confirm before saving
3. If activating: call `scene.turn_on` with the scene entity_id

---

### `script <description>` — Create or run a script

Like automations but without triggers. Useful for sequences of actions:

1. List existing scripts for context
2. Draft the script sequence, confirm before saving
3. If running an existing script: call `script.turn_on`

---

## General Rules

- **Always show entity IDs** alongside friendly names — users need them for further config
- **Never make write operations silently** — always confirm automation/dashboard/script creation first
- **For HA YAML**: validate field names match the HA version (ha-mcp tools report HA version — check if >2026.1)
- **When ha-mcp has tool search mode enabled** (`ENABLE_TOOL_SEARCH=true`): first search for the relevant tool by name, then invoke it
- **Backup notice**: ha-mcp auto-backs up edited config files — mention this when making destructive edits
- **Read-only mode**: if write tools are unavailable, report that ha-mcp is in read-only mode and explain how to disable it (add-on config → `read_only_mode: false`)
