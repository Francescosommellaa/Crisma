# build.ps1
Write-Host "🧹 Pulizia cartelle..."
Remove-Item -Recurse -Force ../fe-app/dist/* -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ../be-api/dist/* -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ./dist/* -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ./release/* -ErrorAction SilentlyContinue

Write-Host "🚀 Compilazione FE e BE..."
cd ../fe-app
npm run build

cd ../be-api
npm run build

cd ../electron
npm run build

Write-Host "🛠 Generazione .exe..."
npm run make:exe