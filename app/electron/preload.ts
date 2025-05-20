import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  chooseDirectory: () => ipcRenderer.invoke('select-directory'),
});
