# Neon MCP auth opening constantly / failing

If Neon MCP keeps opening auth in a new tab and it fails (or opens repeatedly), do this:

## 1. Use only one Neon MCP server

You have two Neon MCP servers enabled (`user-Neon` and `plugin-neon-postgres-neon`). Two servers = two OAuth flows and often a loop.

- Open **Cursor Settings → MCP** (or Features → MCP).
- Disable **one** of the Neon servers (e.g. keep “Neon” and turn off “neon”, or the other way around).

## 2. Clear OAuth cache

Neon’s docs say cached OAuth credentials can cause `invalid redirect uri` and failed auth. Clear the cache and restart Cursor:

```bash
rm -rf ~/.mcp-auth
```

Then fully quit and reopen Cursor.

## 3. (Recommended) Use API key instead of OAuth

So the browser never opens:

1. Create an API key: [Neon Console → Settings → API Keys](https://console.neon.tech/app/settings/api-keys).
2. In this project, `.cursor/mcp.json` is set to use **one** Neon server with API key. Replace `PASTE_NEON_API_KEY_HERE` in that file with your key (or set `NEON_API_KEY` in your environment and use that value in `mcp.json`).
3. Disable the other Neon MCP in Cursor Settings so only this project-defined server is used.

After that, Neon MCP uses the key and no OAuth tab should open.
