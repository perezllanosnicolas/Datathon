---
name: actualizar-servidor-levantado
description: Deja el servidor del prototipo (web/) funcionando con los últimos cambios. Si no hay servidor levantado, lo levanta; si ya hay uno, lo para, recompila y lo vuelve a levantar para que se vean los cambios. Usar cuando el usuario escriba /actualizar-servidor-levantado o pida levantar, reiniciar o actualizar el servidor o el QR del prototipo.
argument-hint: "[dev | puerto]"
disable-model-invocation: true
---

# /actualizar-servidor-levantado

Deja el prototipo de `web/` sirviéndose con el código actual. Responde en español.

Argumentos (`$ARGUMENTS`):
- Vacío: servidor de **producción** (`npm run share`: compila y sirve), en el puerto 3000. Es el recomendado para el demo y el QR.
- `dev`: servidor de desarrollo (`npm run share -- --dev`). Recoge los cambios solo; no hace falta recompilar.
- Un número: usa ese puerto en vez del 3000 (variable `PORT`).

## Reglas
- Solo paras procesos que sean **este prototipo**: `node` con `next` y la ruta de este repositorio en la línea de comandos. Si el puerto lo usa otra cosa, **no la pares**: dilo y propón otro puerto.
- Nunca toques `main`, ni hagas commit o push: esta skill solo gestiona el servidor.
- El servidor se lanza **en segundo plano** y escribe su registro en `.share.log` (en la raíz; está en `.gitignore`).

## Pasos

### 1. Comprobar si hay un servidor levantado
En PowerShell, con el puerto elegido (`$p`, por defecto 3000):
```powershell
$c = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
$c | ForEach-Object { Get-CimInstance Win32_Process -Filter "ProcessId=$($_.OwningProcess)" | Select-Object ProcessId, CommandLine }
```
- **Sin resultado:** no hay servidor; ve al paso 3.
- **Con resultado:** comprueba que la línea de comandos contiene `next` y la ruta de este repositorio. Si es así, es el servidor del prototipo: ve al paso 2. Si no, para y avisa.

### 2. Parar el servidor antiguo (solo si lo había)
```powershell
Stop-Process -Id <PID> -Force
```
Si `npm` lo lanzó, puede haber un proceso padre `npm`/`node` con `share.mjs`: párelo también (mismo criterio: línea de comandos con la ruta del repositorio). Espera 2 segundos y confirma que el puerto está libre; si no lo está, para y cuéntalo.

### 3. Levantar el servidor
Desde `web/`, en segundo plano:
```bash
cd web && (PORT=<puerto> npm run share > ../.share.log 2>&1 &)
```
(añade `-- --dev` en modo `dev`). La compilación tarda ~1 minuto en producción. Espera hasta que `.share.log` contenga `Ready` (sondea con `grep`, sin bucles largos de `sleep`), y como máximo ~3 minutos.
- Si aparece `EADDRINUSE`, el paso 2 no liberó el puerto: vuelve al paso 1.
- Si la compilación falla, muestra el error de `.share.log` y para: no dejes un servidor a medias.

### 4. Verificar
`curl -s -o /dev/null -w '%{http_code}' http://localhost:<puerto>/` debe dar `200`. Prueba también `/glosario` y `/ajustes`.

### 5. Informe final (breve)
- Si había servidor y se reinició, o si se levantó desde cero.
- Modo (producción o dev) y puerto.
- La URL recomendada y el **QR** que imprime `share.mjs` (cópialo de `.share.log`), y la nota de que el móvil debe estar en la misma Wi-Fi.
- Cualquier problema (cortafuegos, puerto ocupado por otro programa).
