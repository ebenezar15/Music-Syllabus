// Riffbook for Mac — a thin desktop shell around the web app, with MIDI and microphone allowed.
const { app, BrowserWindow, session, shell, Menu } = require('electron');
const path = require('path');

const ALLOWED = new Set(['midi', 'midiSysex', 'media', 'audioCapture', 'clipboard-sanitized-write']);

function createWindow() {
  const win = new BrowserWindow({
    width: 1360, height: 880, minWidth: 420, minHeight: 560,
    title: 'Riffbook', backgroundColor: '#0e1424',
    webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  win.loadFile(path.join(__dirname, 'app', 'riffbook', 'index.html'));
  // Links to other websites open in the normal browser
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', (e, url) => { if (/^https?:/.test(url)) { e.preventDefault(); shell.openExternal(url); } });
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((wc, permission, cb) => cb(ALLOWED.has(permission)));
  session.defaultSession.setPermissionCheckHandler((wc, permission) => ALLOWED.has(permission));
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { role: 'appMenu' }, { role: 'editMenu' }, { role: 'viewMenu' }, { role: 'windowMenu' }
  ]));
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});
app.on('window-all-closed', () => app.quit());
