# MultiClaw

A multi-instance OpenClaw desktop app for administrators managing more than one OpenClaw installation.

MultiClaw lets you open multiple independent OpenClaw Mission Control sessions side by side — each in its own window, each with its own persistent login. No browser tabs, no juggling credentials.

## How it works

Each window is a fully independent OpenClaw session. Open as many windows as you need, log each one into a different OpenClaw installation, and arrange them however you want on your desktop.
MultiClaw Window 1          MultiClaw Window 2
└── OpenClaw Instance A     └── OpenClaw Instance B
└── Tailscale gateway       └── Tailscale gateway
└── Agents, models          └── Agents, models
memory, sessions            memory, sessions

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

## Free vs paid

MultiClaw is free and open source. The free version supports unlimited windows.

A hosted/managed version with additional features is planned for teams and enterprise operators.

## License

MIT
