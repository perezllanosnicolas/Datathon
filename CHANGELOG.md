# Cambios

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [0.2.0] — 2026-10-25 · Preparación para la evaluación técnica
### Añadido
- Ramas **`local`** (Docker: `docker compose up`, modelos del OCR dentro de la imagen, SQLite en un volumen) y **`online`** (Vercel: `vercel.json`, región en la UE).
- **Tests unitarios** con Vitest (49): extracción de la citación, integridad del catálogo, traducciones completas, seguridad de los tokens.
- **GitHub Actions:** lint, tipos y tests en Node 22 y 24; build y smoke test; imagen Docker en `local`; CodeQL; Dependabot. Plantillas de issues y PR.
- Smoke test con **OCR real** de una imagen (36 comprobaciones).
- `npm run ocr:models` para descargar los modelos del OCR por adelantado.
- Cabeceras de seguridad (`Referrer-Policy: no-referrer`, `Permissions-Policy`, `X-Content-Type-Options`).
- Documentación: índice, resumen ejecutivo, diagramas (Gantt, arquitectura, secuencias, datos, ramas, CI), herramientas usadas, stack ideal, escalabilidad y despliegue. `CONTRIBUTING.md`, `SECURITY.md`.

### Corregido
- La caché de los modelos del OCR nunca se escribía (faltaba la carpeta): se descargaban en cada arranque y no funcionaba sin internet.
- En compilaciones *standalone* y *serverless* faltaban dependencias de tesseract.js (`bmp-js`, `node-fetch`…) y fallaba el OCR de imágenes.
- Comprobación de las 48 h del smoke test sensible a diferencias de reloj.

### Cambiado
- El paquete pasa a llamarse `simulex`. Se quitan archivos de la plantilla de Next.js que no se usaban.

## [0.1.0] — 2026-10-23 · Datathon
Prototipo presentado en la final: cuestionario de adaptación, cuatro idiomas, buscador, citación con OCR, flujo paso a paso con barra de progreso, fachada, enlace del abogado, glosario, pictogramas y fotos, lectura en voz alta y dictado. Despliegue en Vercel. Detalle de las decisiones en `CLAUDE.md`.
