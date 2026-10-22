# SimuLex (visita virtual accesible al juzgado) — Datathon Brecha Judicial (Reto 3)

Web **mobile-first** que prepara a una persona neurodivergente antes de ir al juzgado. Muestra, paso a paso, qué va a pasar, cuánto dura cada parte, qué tiene que llevar y qué se espera de ella. Ámbito del demo: **civil**.

> Prototipo con **datos sintéticos**. No sustituye el asesoramiento legal. Las traducciones al catalán, gallego y euskera están pendientes de revisión por hablantes nativos.

Documentación del proyecto: [`docs/`](docs/) (PRD, TRD, AppFlow, UI/UX, Backend, Plan de implementación).

## Arrancar el prototipo

Requisitos: **Node.js 22.13 o superior** (usa `node:sqlite`, sin instalar una base de datos).

```bash
cd web
npm install
npm run dev          # desarrollo: http://localhost:3000
```

### Demo en el móvil (hosting local)
```bash
cd web
npm run demo         # compila y sirve en 0.0.0.0:3000
```
1. El portátil y el móvil tienen que estar en la **misma red Wi-Fi**. Mejor una red propia (punto de acceso del móvil).
2. En el portátil, busca su IP local (`ipconfig` en Windows; `ifconfig` en macOS o Linux).
3. En el móvil, abre `http://<IP-del-portátil>:3000`.
4. El "abogado" se simula con un segundo dispositivo en la misma red, que abre el enlace de invitación.

### Desplegar en Vercel (demo en la presentación)
1. En Vercel: **Add New → Project**, importa el repositorio y pon **Root Directory = `web`** (framework: Next.js; no hace falta ningún ajuste más ni variables de entorno).
2. Despliega la rama que se vaya a presentar. El resto es automático: `npm run build` y Node 22 o superior.
3. En Vercel el disco es de solo lectura salvo `/tmp`: la base de datos (casos y enlace del abogado) vive en `/tmp/app.db` y **no es permanente ni se comparte entre instancias**. Es suficiente para el demo, pero un caso creado puede desaparecer tras un rato sin uso. Antes de presentar, haz un recorrido completo y no reinicies el despliegue.
4. El OCR descarga los modelos de idioma la primera vez que se sube una citación (la primera lectura tarda más). Las fotos de más de 3,5 MB se reducen en el navegador antes de subirlas (Vercel limita el cuerpo a 4,5 MB); un PDF de más de 4,5 MB no se podrá subir.
5. Las funciones locales (`npm run share`, el QR) no se usan en Vercel.

### QR para abrirlo en el móvil
```bash
cd web
npm run share            # compila, arranca y muestra una URL + código QR en la terminal
npm run share -- --dev   # igual, con el servidor de desarrollo
```
Escanea el QR con la cámara del móvil (misma Wi-Fi). Si hay varias redes, se recomienda la Wi-Fi y se listan las demás. Si no carga, permite Node.js en el cortafuegos de Windows (redes privadas).

**Fuera de la Wi-Fi:** abre un túnel (p. ej. `cloudflared tunnel --url http://localhost:3000`) y ejecuta `PUBLIC_URL=<url del túnel> npm run share` para generar el QR de esa URL. Un túnel publica el prototipo en internet mientras esté abierto: solo con datos sintéticos.

### Foto de la fachada
Cada sede judicial lleva una foto fija de su fachada en `web/public/images/facades/` (de Wikimedia Commons; autoría y licencia en `web/data/catalog/courts.json`, campo `photo`). No hace falta clave ni internet.

### OCR de la citación
El OCR (tesseract.js) se ejecuta **en el propio servidor**. La primera vez descarga los modelos de español, catalán, gallego y euskera en `web/data/tessdata/`, así que hace falta internet. Después funciona sin conexión. Conviene subir una citación de prueba antes del demo para que los modelos ya estén descargados.

Hay citaciones sintéticas en `web/data/citaciones-sinteticas/`. Se pueden subir tal cual (.txt) para probar la extracción, o como foto o PDF.

## Comprobaciones
```bash
cd web
npm run lint
npm run typecheck
npm run build && npm start      # en una terminal
npm run smoke                   # en otra: prueba la API de punta a punta (33 comprobaciones)
```

## Qué incluye (núcleo del demo, Fases 2–7 del plan)
| Función | Dónde |
|---|---|
| Cuestionario de adaptación sin registro: idioma, tamaño de letra, filtros por neurodivergencia, movimiento, color, contraste, letra legible, lectura en voz alta | `/cuestionario`, `/ajustes` |
| Cuatro idiomas (es, ca, gl, eu), con aviso si un texto aún no está traducido | `web/src/i18n/`, contenido en `web/data/catalog/` |
| Buscador con filtros, tolerante a tildes, que busca en los cuatro idiomas | `/buscar` |
| Subir citación: foto/PDF → texto (OCR en el servidor) → trámite y juzgado del catálogo → la persona lo confirma | `/citacion`, `/api/citation` |
| Flujo paso a paso con barra de progreso ("Paso 3 de 9 · Has hecho 2 · Te quedan 7"), fases, lista de pasos, saltar y repetir | `/caso/[id]` |
| Foto de la fachada de la sede judicial, con alternativa de texto | `/caso/[id]` (paso de llegada) |
| Enlace del abogado: 48 h, revocable, nombre y número de colegiado obligatorios (sin comprobar), solo texto | `/caso/[id]/abogado`, `/abogado/[token]` |
| Resumen con la lista de documentos e impresión | `/caso/[id]/resumen` |

## Privacidad (diseño actual)
- El perfil de adaptaciones y el progreso se guardan **solo en el navegador**. Al servidor solo llega el idioma, en una cookie, para el atributo `lang`.
- El servidor guarda un caso anónimo: el trámite, el juzgado, un hash del secreto del dispositivo y los documentos del abogado. No guarda nombres ni la citación.
- La citación se procesa en memoria y se descarta. No se escribe en disco y no se registra su texto.

## Estructura
```
docs/                 Documentación del proyecto
web/
  data/catalog/       Trámites, juzgados y glosario (JSON editable por el equipo de Derecho)
  data/citaciones-sinteticas/   Citaciones de prueba
  scripts/smoke-test.mjs        Prueba de la API
  src/app/            Pantallas y API (Next.js App Router)
  src/components/     Componentes (barra de progreso, fachada, documentos…)
  src/i18n/           Textos de la interfaz en es, ca, gl, eu
  src/lib/            Catálogo, extracción de la citación, almacenamiento en el dispositivo
  src/server/         SQLite, seguridad de tokens, OCR
```
