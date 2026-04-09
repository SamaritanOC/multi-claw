# MultiClaw for Windows

A native Windows desktop app for running multiple OpenClaw Mission Control dashboards simultaneously.

MultiClaw for Windows wraps the OpenClaw built-in Control UI in an Electron shell, giving you a proper installable app with persistent authentication — no browser, no token prompts, no storage clearing. Each window is independent, with its own login, its own session, arranged however you want on your desktop.

## Download

| OS | Download |
|---|---|
| Windows 11 | [multiclaw-windows-setup.exe](https://github.com/SamaritanOC/multi-claw/releases/latest/download/multiclaw-windows-setup.exe) |

---

## How it works

MultiClaw for Windows connects directly to your OpenClaw gateways over your Tailscale network. Your gateways run on your home machines as normal. Each app window is just a secure native window into one of them from anywhere.
Windows Machine
└── MultiClaw for Windows
├── Window 1 → Tailscale → OpenClaw gateway A
├── Window 2 → Tailscale → OpenClaw gateway B
└── Window 3 → Tailscale → OpenClaw gateway C

## Requirements

- One or more OpenClaw installations, each running and accessible
- Tailscale with each host on your tailnet
- Each host gateway exposed via Tailscale Serve
- Windows 11

## Host configuration

Add this to your openclaw.json gateway block:
```json
"tailscale": {
  "mode": "serve"
},
"auth": {
  "mode": "token",
  "allowTailscale": true
},
"controlUi": {
  "allowedOrigins": ["https://your-tailscale-hostname"]
}
```

## Installation

Download and run the installer:
multiclaw-windows-setup.exe

**Windows SmartScreen warning**

Because MultiClaw for Windows is not yet code-signed, Windows Defender SmartScreen will show a blue warning dialog when you run the installer. This is expected for open-source apps distributed outside the Microsoft Store.

To proceed:
1. Click **More info** in the SmartScreen dialog
2. Click **Run anyway**

If you prefer to unblock the file before running it:
1. Right-click `multiclaw-windows-setup.exe` → **Properties**
2. At the bottom of the General tab, check **Unblock**
3. Click **OK**, then run the installer normally

Follow the on-screen prompts. A desktop shortcut and Start Menu entry will be created automatically.

## First launch

1. Open MultiClaw
2. Enter your gateway URL (e.g. https://your-machine.tailnet-name.ts.net)
3. Enter your gateway token (found in ~/.openclaw/openclaw.json under gateway.auth.token)
4. Click Connect
5. On your OpenClaw host, approve the pairing request:
```bash
openclaw devices list
openclaw devices approve <requestId>
```

Pairing is a one-time step per device. After that the app connects automatically on every launch.

## Opening a new window

Right-click anywhere in any MultiClaw window and select **New Window**, or use the **MultiClaw** menu in the menu bar and select **New Window** (Ctrl+N).

## Updating

MultiClaw for Windows checks for updates automatically on every launch. When a new version is available it downloads in the background and prompts you to restart to apply it.

## Troubleshooting

### App opens a blank window

Confirm Tailscale is running and connected on your Windows machine and that your OpenClaw gateway host is reachable on your tailnet.

### Pairing approval

When you open MultiClaw for Windows for the first time, the gateway registers a new device and waits for operator approval.

**To approve:**
1. Open Mission Control or the OpenClaw webchat on your gateway host
2. Go to **Devices** — you will see a pending device entry
3. Approve it

Pairing codes expire after **1 hour**. If approval times out, close the app, reopen it, and approve the new pairing request before the hour is up.

---

## License

MIT

## Support The Samaritan Project

This is an active, build-in-public project focused on developing replicable, private agentic AI infrastructure that can be deployed across any industry or use case. If you're interested in where local-first AI is headed, and want to support the hardware and infrastructure that makes this possible, follow along and contribute at [The Samaritan Project — Buy Me A Coffee](https://buymeacoffee.com/thesamaritanproject)
