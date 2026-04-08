# 🦞 MultiClaw
<img style="float:right; margin-left 20px;" src="https://labb.run/wp-content/uploads/2026/04/icon.png">
MultiClaw is a Linux desktop app that lets you run multiple OpenClaw Mission Control sessions at once, each in its own window.

Open a new window for each OpenClaw installation you manage. Each window is independent, with its own login, its own session, arranged however you want on your desktop

## How it works

1. Open MultiClaw — the OpenClaw Mission Control login screen appears automatically
2. Enter your gateway URL and token to connect to your first installation
3. Log into a second OpenClaw installation in the new window
4. Repeat for as many installations as you manage
5. Arrange and resize your windows however you want. Your sessions persist between launches

## Requirements

- One or more OpenClaw installations, each running and accessible
- Tailscale with each host on your tailnet
- Each host gateway exposed via Tailscale Serve
- Debian-based Linux on the machine running MultiClaw

## Installation

Download the latest release:

```bash
wget https://github.com/SamaritanOC/multi-claw/releases/latest/download/multi-claw-amd64.deb
sudo dpkg -i multi-claw-amd64.deb
```

Or install the AppImage:

```bash
wget https://github.com/SamaritanOC/multi-claw/releases/latest/download/MultiClaw.AppImage
chmod +x MultiClaw.AppImage
./MultiClaw.AppImage
```

## Usage

1. Open MultiClaw from your application menu
2. The OpenClaw Mission Control login screen appears automatically
3. Enter your gateway URL and token to connect
4. Right-click anywhere in the window and select **New Window** to open a second instance
5. Log into a different OpenClaw installation in the new window
6. Arrange and resize windows however you like

Each window remembers its session between launches — you won't need to log in again unless your token expires.

## Opening a new window

Right-click anywhere in any MultiClaw window and select **New Window**, or use the **MultiClaw** menu in the menu bar and select **New Window** (Ctrl+N).

## Wayland / display issues

MultiClaw is an Electron app. On Linux systems running Wayland, the app may fail to launch or render a blank window.

**Fix — force XWayland mode:**

```bash
multi-claw --ozone-platform=x11
```

Or set it permanently by editing your launcher/desktop entry to include `--ozone-platform=x11` in the `Exec=` line.

## Building from source

```bash
git clone https://github.com/SamaritanOC/multi-claw.git
cd multi-claw
npm install
npm run electron:build
sudo dpkg -i dist-app/multi-claw-*-amd64.deb
```

## License

MIT
