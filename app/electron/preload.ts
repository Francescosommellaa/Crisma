import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  chooseDirectory: () => ipcRenderer.invoke('choose-directory')
});