---
title: "BUILD, MAINTAIN, and TROUBLESHOOT Home Assistant with ha-mcp and your favorite AI"
source: youtube
url: https://www.youtube.com/watch?v=WduLaBVz208
channel: homeassistant-ai
published: 2026-06-14
duration: "24:46"
views: 5020
captured: 2026-06-19
tags:
  - home-assistant
  - ha-mcp
  - mcp
  - claude-code
  - automation
  - hermes
  - debugging
  - dashboard
related:
  - "[[ha-mcp]]"
  - "[[Home Assistant MCP Server]]"
  - "[[Claude Code MCP Setup]]"
  - "[[Hermes Agent]]"
transcript_status: "unavailable — YouTube blocked fetch (403); content sourced from official ha-mcp docs, GitHub README, DOCS.md, FAQ.md, Hermes Agent docs"
---

# BUILD, MAINTAIN, and TROUBLESHOOT Home Assistant with ha-mcp and your favorite AI

> **Source note:** YouTube transcript was inaccessible (403 during capture). All setup steps, commands, and feature details below are verified against the official [ha-mcp GitHub repo](https://github.com/homeassistant-ai/ha-mcp), [DOCS.md](https://github.com/homeassistant-ai/ha-mcp/blob/master/homeassistant-addon/DOCS.md), [FAQ.md](https://github.com/homeassistant-ai/ha-mcp/blob/master/docs/FAQ.md), and [Hermes Agent Home Assistant docs](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/homeassistant.md). Timestamps and specific video prompts are approximate based on user notes.

---

## Video Summary

Covers the full lifecycle of using ha-mcp (the unofficial, 84-tool Home Assistant MCP server) to build automations, maintain configuration, and debug problems — demonstrated with both **Claude Code** (Anthropic) and **Hermes Agent** (Nous Research local LLM) as the AI backends.

---

## Chapters / Sections (Approximate)

| Timestamp | Section |
|-----------|---------|
| 0:00 | Intro — what ha-mcp is and why it beats the built-in HA MCP |
| ~1:30 | Installing the ha-mcp add-on via HA Supervisor |
| ~4:00 | Connecting Claude Code — `mcp add-json` command |
| ~6:00 | Connecting Hermes Agent — HASS_TOKEN + gateway setup |
| ~8:30 | First automation: natural-language creation demo |
| ~11:00 | Maintaining automations — querying and modifying existing config |
| **11:38** | **Debug sensor example — troubleshoot a broken sensor/automation** |
| ~15:00 | Dashboard building with Lovelace |
| ~18:30 | Tool search mode for smaller/local models |
| ~20:00 | Security overview and read-only mode |
| ~22:00 | Gotchas and common failures |
| ~24:00 | Wrap-up and community links |

---

## Setup Steps

### Option A — Home Assistant Add-on (run inside HAOS)

1. In HA → Settings → Add-ons → Add-on Store → **⋮ menu → Repositories**
2. Add URL: `https://github.com/homeassistant-ai/ha-mcp`
3. Find **Home Assistant MCP Server** → Install → Start
4. Open **Log tab** — copy the generated server URL:
   ```
   🔐 MCP Server URL: http://192.168.1.100:9583/private_zctpwlX7ZkIAr7oqdfLPxw
   ```
   > This URL contains a 128-bit cryptographically random secret path — treat it like a password.

5. No separate token needed — auth flows through HA Supervisor.

### Option B — Local install via uvx (recommended for Claude Desktop / Claude Code on your machine)

```bash
# No installation needed — uvx runs it on demand
claude mcp add --transport stdio home-assistant \
  --env HOMEASSISTANT_URL=http://homeassistant.local:8123 \
  --env HOMEASSISTANT_TOKEN=<your_long_lived_token> \
  -- uvx ha-mcp@latest
```

### Token Setup (Option B / remote access)

1. HA → Profile → **Long-lived access tokens** → Create Token
2. Name it (e.g., `Claude MCP`) → Copy immediately (shown once)
3. Set as `HOMEASSISTANT_TOKEN` env var

---

## Connecting Claude Code (Add-on method)

```bash
claude mcp add-json home-assistant '{
  "type": "http",
  "url": "http://192.168.1.100:9583/private_zctpwlX7ZkIAr7oqdfLPxw"
}'
```

Verify connection:
```
claude mcp list
```

Ask Claude to confirm: *"Can you see my Home Assistant via MCP?"*

---

## Connecting Hermes Agent

Hermes uses a lightweight 4-tool REST API bridge + a real-time WebSocket gateway.

### Token config

```bash
# ~/.hermes/.env
HASS_TOKEN=your_long_lived_access_token
HASS_URL=http://homeassistant.local:8123   # optional, this is the default
```

The toolset activates **automatically** when `HASS_TOKEN` is set.

### Launch gateway

```bash
hermes gateway
```

Home Assistant appears as an active platform in the gateway status output.

### Hermes HA Tools (4 total)

| Tool | Description |
|------|-------------|
| `ha_list_entities` | List entities, filter by domain or area |
| `ha_get_state` | Full state + attributes for a single entity |
| `ha_list_services` | Available services by device type |
| `ha_call_service` | Execute any HA service with target + params |

> **Note:** Hermes blocks `shell_command`, `command_line`, `python_script`, `pyscript`, `hassio`, `rest_command` to prevent code injection.

### Event Gateway (real-time)

Configure at least one filter or it won't forward events:

```yaml
watch_domains: [light, binary_sensor]
# OR
watch_entities: [binary_sensor.front_door]
# OR
watch_all: true

cooldown_seconds: 30       # min interval between same-entity events
ignore_entities:           # suppress noisy sensors
  - sensor.cpu_usage
```

Agent replies appear as **persistent notifications** in HA.

---

## Automation Examples

### Create an automation (Claude / Hermes)

**Prompt:** *"Create an automation that turns on the porch light at sunset and off at sunrise"*

HA produces: automation YAML with `sun.sun` trigger, `homeassistant.turn_on/off` actions, saved directly to configuration.

**Prompt:** *"Make an automation that sends me a notification when the front door is left open for more than 5 minutes"*

HA produces: automation with `binary_sensor` trigger, 5-minute delay condition, `notify.mobile_app` action.

**Prompt:** *"Find all automations related to the living room lights and show me what triggers them"*

Claude reads the automation registry and returns a structured summary of triggers and conditions.

---

## Debugging Workflow — Debug Sensor Example (~11:38)

The video demonstrates diagnosing a sensor that appears broken/stuck.

**Step 1 — Identify the problem entity**
```
Prompt: "The motion sensor in the hallway hasn't triggered any automations today — debug it"
```

**Step 2 — What Claude/Hermes does:**
1. Calls `ha_get_state` (or ha-mcp equivalent) on the sensor entity
2. Reads `last_changed`, `last_updated`, `state` attributes
3. Fetches automation traces via ha-mcp's automation trace tool
4. Identifies whether: sensor is stuck, automation condition fails, or trigger isn't firing

**Step 3 — Typical outputs:**
- "Sensor last changed 3 days ago — likely hardware/connectivity issue"
- "Automation trace shows condition `state = 'home'` failing — no one is home per presence detection"
- "Automation is disabled — re-enable it with `automation.turn_on`"

**Step 4 — Fix in place**
Claude can directly re-enable automations, adjust conditions, or call `homeassistant.reload_config_entry` — all in the same session.

> **Key ha-mcp advantage:** Access to automation execution traces is unique to ha-mcp; the built-in HA MCP server doesn't expose these.

---

## Dashboard Building

**Prompt:** *"Create a dashboard for my bedroom with temperature, humidity, a light control, and the current alarm status"*

ha-mcp uses Lovelace dashboard tools to:
1. Create a new dashboard view
2. Add appropriate cards (sensor cards, entity cards, alarm panel card)
3. Return the dashboard URL

**Prompt:** *"Add an energy monitoring section to my main dashboard showing solar production and grid consumption"*

Uses the energy management tools to fetch entity IDs and build an energy card layout.

---

## ha-mcp vs Built-in HA MCP — Key Differences

| Feature | ha-mcp | Built-in HA MCP |
|---------|--------|-----------------|
| Tools | 84–92 | ~15 |
| Automation creation | ✅ | ❌ |
| Automation traces/debug | ✅ | ❌ |
| Dashboard building | ✅ | ❌ |
| HACS management | ✅ | ❌ |
| Blueprint management | ✅ | ❌ |
| Read-only mode | ✅ | N/A |
| Tool search mode | ✅ | N/A |
| Backup/restore | ✅ | ❌ |
| Camera snapshots | ✅ | ❌ |

---

## Claude Code vs Hermes Agent — Comparison

| Aspect | Claude (Sonnet 4.6) | Hermes Agent |
|--------|---------------------|--------------|
| Model type | Cloud API | Local (Ollama/vLLM/etc.) |
| Tool count | 84+ via ha-mcp | 4 native HA tools |
| Privacy | Data leaves device | Fully local |
| Real-time events | Polling only | WebSocket gateway |
| Best for | Complex config/debug | Lightweight control + notifications |
| Cost | API tokens | Free (hardware cost) |

---

## Tool Search Mode (for smaller/local models)

Enable when using Hermes or other smaller models that struggle with 84 tools upfront:

```yaml
# ha-mcp add-on config
enable_tool_search: true
```

This replaces 84 tools with 4 proxy tools that search on demand — dramatically reduces token overhead for local models.

---

## Gotchas & Warnings

1. **macOS Sequoia 15+ Local Network Privacy** — silently blocks Claude Desktop subprocess connections to LAN IPs. Fix: System Settings → Privacy → Local Network → enable Claude Desktop. Or SSH port-forward to localhost.

2. **Cloudflare "Block AI training bots"** — if your HA is behind Cloudflare, this setting blocks LLM connections even though browser access works fine. Disable it for the HA subdomain.

3. **JSON config syntax** — no trailing commas in `claude_desktop_config.json`. A single bad character breaks the whole MCP connection. Validate with `jq . < config.json`.

4. **Restart Claude fully** after config changes — Cmd+Q / Alt+F4, not just close window.

5. **First request is slow** — `uvx ha-mcp@latest` downloads the package on first run. Use `uv cache clean` if tools appear stale.

6. **Lost the add-on URL** — check the add-on Logs tab; it's printed on every startup.

7. **Codex known bug** — connects but exposes no tools. Workaround: run ha-mcp locally instead of via the add-on.

8. **v7.0.0+ breaking change** — `HOMEASSISTANT_URL` must now be set as an environment variable (not hardcoded in command args).

9. **Hermes HOME entity** — "conversation entity not found" error means HA Assist isn't configured. Go to Settings → Voice Assistants → configure a pipeline.

10. **Remote access** — never expose port 9583 directly to the internet. Use the Webhook Proxy add-on or Cloudflared tunnel.

---

## Quick Test (after setup)

```
Prompt: "List all my lights and tell me which ones are currently on"
Prompt: "What automations ran in the last 24 hours?"
Prompt: "Show me any automations that haven't run in 7+ days"
```

Public demo (no HA instance needed): `https://ha-mcp-demo-server.qc-h.net` with token `demo`

---

## Key Resources

- **ha-mcp GitHub:** https://github.com/homeassistant-ai/ha-mcp
- **Setup Wizard:** https://homeassistant-ai.github.io/ha-mcp/setup/
- **FAQ / Troubleshooting:** https://homeassistant-ai.github.io/ha-mcp/faq/
- **ha-mcp Add-on DOCS.md:** https://github.com/homeassistant-ai/ha-mcp/blob/master/homeassistant-addon/DOCS.md
- **Hermes Agent HA Docs:** https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/messaging/homeassistant.md
- **HA Official MCP Integration:** https://www.home-assistant.io/integrations/mcp_server/
- **HA Community Thread:** https://community.home-assistant.io/t/brand-new-claude-ai-chatgpt-integration-ha-mcp/937847
- **SmartHomeScene Guide:** https://smarthomescene.com/guides/home-assistant-mcp-server-complete-guide/

---

## Cross-reference: [[ha-mcp]]

See the existing `ha-mcp.md` note in this folder for the core ha-mcp overview, tool inventory, and original setup reference. This note extends that with:
- Claude Code `mcp add-json` connection method
- Hermes Agent integration (4-tool REST + WebSocket gateway)
- Video-sourced automation examples and debugging workflow
- Tool search mode for local models
- Full gotchas/warnings list
