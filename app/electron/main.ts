import { ChildProcess, spawn } from 'child_process';
import { app, BrowserWindow } from 'electron';
import path from 'path';

let backendProcess: ChildProcess | null = null;
let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const indexPath = path.resolve(__dirname, '../../fe-app/dist/index.html');
  console.log('Path HTML:', path.resolve(__dirname, '../../fe-app/dist/index.html'));
  mainWindow.loadURL(`file://${path.resolve(__dirname, '../../fe-app/dist/index.html')}`);
};

const startBackend = () => {
  const backendPath = path.resolve(__dirname, '../../be-api/dist/index.js');
  backendProcess = spawn('node', [backendPath], {
    stdio: 'inherit',
    env: { ...process.env, ELECTRON: 'true' }
  });

  backendProcess.on('error', (err: unknown) => {
    console.error('Errore avvio backend:', err);
  });
};

app.whenReady().then(() => {
  startBackend();
  createWindow();
});

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
