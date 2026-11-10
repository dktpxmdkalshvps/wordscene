# WordScene agent guidance

## Desktop QA with agent-desktop

Use `agent-desktop` only for local development and QA of the WordScene UI, not as a production runtime dependency.

Before first use on Windows:

1. Run `agent-desktop status`.
2. Run `agent-desktop skills get platform`.
3. Use `agent-desktop <command> --help` for command-specific flags.

Keep the observe -> act -> verify loop:

```powershell
agent-desktop snapshot --skeleton --app "Google Chrome" -i --compact
agent-desktop snapshot --root '@<snapshot-id>:e3' -i --compact
agent-desktop click '@<snapshot-id>:e12'
agent-desktop snapshot --root '@<snapshot-id>:e3' -i --compact
```

In PowerShell, quote every accessibility ref because `@token` is a splatting operator. Do not use `--headed` or coordinate input unless the user explicitly permits physical input. Never repeat an action unless the result says retry is safe; inspect the live UI first. Keep screenshots, snapshots, clipboard contents, and command output private.
