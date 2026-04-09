import { app, BrowserWindow, shell, session, Menu, MenuItem } from 'electron'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'
import * as fs from 'fs'
import * as http from 'http'

const BASE_PORT = 18800
const CONFIG_PATH = path.join(app.getPath('userData'), 'windows.json')

const MIME: Record<string, string> = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.svg':  'image/svg+xml',
  '.map':  'application/json',
}

interface WinConfig {
  id: string
  label: string
  port: number
}

let windowConfigs: WinConfig[] = []
const activeWindows: Map<string, BrowserWindow> = new Map()
const activeServers: Map<string, http.Server> = new Map()

function loadConfigs(): WinConfig[] {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'))
    }
  } catch {}
  return []
}

function saveConfigs() {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(windowConfigs, null, 2))
}

function getControlUiRoot(): string {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'app.asar.unpacked', 'control-ui')
    : path.join(__dirname, '..', '..', '..', 'control-ui')
}

function startUiServer(port: number): Promise<http.Server> {
  const root = getControlUiRoot()
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const rel = req.url === '/' ? 'index.html' : req.url!.split('?')[0]
      const filePath = path.join(root, rel)
      fs.readFile(filePath, (err, data) => {
        if (err) {
          fs.readFile(path.join(root, 'index.html'), (e2, d2) => {
            if (e2) { res.writeHead(404); res.end(); return }
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(d2)
          })
          return
        }
        const ext = path.extname(filePath)
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
        res.end(data)
      })
    })
    server.listen(port, '127.0.0.1', () => resolve(server))
    server.on('error', reject)
  })
}

function installOriginRewriter(ses: Electron.Session) {
  ses.webRequest.onBeforeSendHeaders(
    { urls: ['ws://*/*', 'wss://*/*'] },
    (details, callback) => {
      const url = new URL(details.url)
      const protocol = url.protocol === 'wss:' ? 'https' : 'http'
      details.requestHeaders['Origin'] = `${protocol}://${url.hostname}`
      callback({ requestHeaders: details.requestHeaders })
    }
  )
}

function buildAppMenu() {
  const menu = new Menu()
  menu.append(new MenuItem({
    label: 'MultiClaw',
    submenu: [
      {
        label: 'New Window',
        accelerator: 'CmdOrCtrl+N',
        click: () => createMCWindow()
      },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => app.quit()
      }
    ]
  }))
  menu.append(new MenuItem({
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ]
  }))
  Menu.setApplicationMenu(menu)
}

function initAutoUpdater() {
  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.on('error', (err) => console.error('Auto-updater error:', err))
  autoUpdater.checkForUpdatesAndNotify()
}

async function createMCWindow(config?: WinConfig) {
  const usedPorts = windowConfigs.map(w => w.port)
  let port = BASE_PORT
  while (usedPorts.includes(port)) port++

  const id = config?.id || crypto.randomUUID()
  const label = config?.label || `Window ${windowConfigs.length + 1}`

  if (!config) {
    const cfg: WinConfig = { id, label, port }
    windowConfigs.push(cfg)
    saveConfigs()
  } else {
    port = config.port
  }

  const server = await startUiServer(port)
  activeServers.set(id, server)

  const partition = `persist:mcwindow-${id}`
  const ses = session.fromPartition(partition)
  installOriginRewriter(ses)

  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    title: label,
    backgroundColor: '#0f0f0f',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
      session: ses,
    }
  })

  win.setMenuBarVisibility(false)
  win.loadURL(`http://127.0.0.1:${port}`)

  win.webContents.on('context-menu', () => {
    const ctx = new Menu()
    ctx.append(new MenuItem({
      label: 'New Window',
      click: () => createMCWindow()
    }))
    ctx.popup({ window: win })
  })

  activeWindows.set(id, win)

  win.on('closed', () => {
    activeWindows.delete(id)
    const server = activeServers.get(id)
    if (server) { server.close(); activeServers.delete(id) }
    windowConfigs = windowConfigs.filter(w => w.id !== id)
    saveConfigs()
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(() => {
  buildAppMenu()
  windowConfigs = loadConfigs()

  if (windowConfigs.length > 0) {
    for (const cfg of windowConfigs) {
      createMCWindow(cfg)
    }
  } else {
    createMCWindow()
  }

  if (app.isPackaged) initAutoUpdater()
})

app.on('window-all-closed', () => {
  activeServers.forEach(s => s.close())
  app.quit()
})
