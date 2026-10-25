# SimuLex — Visita virtual accesible a la sede judicial

[![CI](https://github.com/perezllanosnicolas/Datathon/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/perezllanosnicolas/Datathon/actions/workflows/ci.yml)
[![CodeQL](https://github.com/perezllanosnicolas/Datathon/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/perezllanosnicolas/Datathon/actions/workflows/codeql.yml)
![Node](https://img.shields.io/badge/node-%E2%89%A522.13-339933)
![Next.js](https://img.shields.io/badge/Next.js-16-000000)
![Idiomas](https://img.shields.io/badge/idiomas-es%20%C2%B7%20ca%20%C2%B7%20gl%20%C2%B7%20eu-0f7d7c)

Web **para móvil** que prepara a una persona neurodivergente (TEA, TDAH, dislexia, discalculia, disgrafía) **antes de ir a una sede judicial**. Le muestra, paso a paso y adaptado a ella, qué va a pasar, cuánto dura, qué tiene que llevar y qué se espera de ella. Ámbito del demo: **civil**.

Proyecto **finalista** del Datathon *Brecha Judicial* (DATAfórum JUSTICIA 2026), Reto 3 «Justicia inteligente para la neurodiversidad» (Ineco).

> Prototipo con **datos sintéticos**. No sustituye el asesoramiento legal. Las traducciones al catalán, gallego y euskera están pendientes de revisión por hablantes nativos.

**Demo:** https://datathon-olive.vercel.app · **Vídeo:** https://youtu.be/t4ye8JS2_Rg · **Documentación:** [`docs/`](docs/README.md) · **Resumen ejecutivo:** [`docs/00-Resumen-ejecutivo.md`](docs/00-Resumen-ejecutivo.md)

## Ejecutarlo

El repositorio tiene tres ramas ([detalle](docs/11-Ramas-y-despliegue.md)):

| Rama | Para | Cómo |
|---|---|---|
| **`local`** | Ejecutarlo en tu equipo con un comando | `git clone -b local …` → `docker compose up -d --build` → http://localhost:3000 |
| **`online`** | Publicarlo en internet | Vercel, Root Directory = `web` |
| **`main`** | Revisar o desarrollar el código | Node.js ≥ 22.13 (ver abajo) |

### Con Docker (rama `local`)
```bash
git clone -b local https://github.com/perezllanosnicolas/Datathon.git simulex
cd simulex
docker compose up -d --build
```
Desde el móvil, en la misma Wi-Fi: `http://<IP-del-ordenador>:3000`. Funciona sin internet después de construir la imagen.

### Con Node (rama `main`)
```bash
cd web
npm ci
npm run dev        # http://localhost:3000
npm run share      # compila, arranca y muestra un QR para abrirlo en el móvil
```

## Comprobaciones
```bash
cd web
npm run lint
npm run typecheck
npm test                          # 49 tests unitarios (Vitest)
npm run build && npm start        # en una terminal
npm run smoke                     # en otra: 36 comprobaciones de la API, con OCR real
```
GitHub Actions ejecuta todo esto en cada push, en Node 22 y 24. En la rama `local` también construye y prueba la imagen Docker.

## Qué incluye
| Función | Dónde |
|---|---|
| Cuestionario de adaptación **sin registro**: idioma, tamaño (6 niveles) y tipo de letra (Atkinson Hyperlegible, OpenDyslexic), movimiento, colores tranquilos, contraste, leer en voz alta, dictado, pictogramas o fotos y filtros por neurodivergencia | `/cuestionario`, `/ajustes` |
| Cuatro idiomas (es, ca, gl, eu), con aviso si un texto aún no está traducido | `web/src/i18n/`, `web/data/catalog/` |
| Buscador tolerante a tildes, en los cuatro idiomas | `/buscar` |
| **Subir la citación:** foto o PDF → texto (OCR en el propio servidor) → trámite y sede del catálogo → la persona confirma | `/citacion`, `/api/citation` |
| Flujo paso a paso con **barra de progreso**, fases, saltar y repetir | `/caso/[id]` |
| Foto de la fachada de la sede con alternativa en texto | pasos de llegada |
| **Enlace del abogado/a:** 48 h, revocable, solo texto, sin ver el perfil | `/caso/[id]/abogado`, `/abogado/[token]` |
| Resumen con la lista de documentos e impresión | `/caso/[id]/resumen` |
| Glosario «Palabras difíciles» (39 términos) | `/glosario` |

## Privacidad
- El perfil de adaptaciones y el progreso se guardan **solo en el navegador**. Al servidor solo llega el idioma.
- El servidor guarda un caso anónimo (trámite, sede, hash de un secreto y los documentos del abogado). Ni nombres ni la citación.
- La citación se procesa **en memoria** y se descarta; su texto no se registra.

## Estructura
```
.github/              CI (tests, smoke, Docker, CodeQL), Dependabot, plantillas
docs/                 Documentación (empieza por docs/README.md)
web/
  data/catalog/       Trámites, sedes y glosario en 4 idiomas (JSON editable por Derecho)
  data/citaciones-sinteticas/   Citaciones de prueba
  public/             Fachadas, fotos por paso, pictogramas ARASAAC, logotipos
  scripts/            Smoke test, QR, descarga de pictogramas y de modelos OCR
  src/app/            Pantallas y API (Next.js App Router)
  src/components/     Componentes (barra de progreso, fachada, documentos…)
  src/i18n/           Textos de la interfaz en es, ca, gl, eu
  src/lib/            Catálogo, extracción de la citación, almacenamiento en el dispositivo
  src/server/         SQLite, seguridad de tokens, OCR
  tests/              Tests unitarios (Vitest)
```
