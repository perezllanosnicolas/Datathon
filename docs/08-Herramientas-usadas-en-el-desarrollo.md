# 08 · Herramientas usadas en el desarrollo

> Qué herramientas, configuraciones y pasos se usaron para construir SimuLex durante el Datathon (21–23 de octubre de 2026) y en la estandarización posterior del repositorio. Para cada una se indica **qué es**, **dónde se usó** y **para qué**.
>
> El prototipo lo construyó un equipo de seis personas en menos de tres días. Gran parte del código y de la documentación se escribió con un **asistente de programación con IA (Claude Code)** dirigido por Nicolás. Este documento explica cómo se configuró ese entorno para que el resultado fuera revisable y reproducible.

## Resumen

| Bloque | Herramientas |
|---|---|
| [1. Gestión del conocimiento](#1-gestión-del-conocimiento) | Segundo cerebro en Obsidian, Google Doc del equipo, `CLAUDE.md` del proyecto |
| [2. Planificación](#2-planificación-los-seis-documentos) | Seis documentos (PRD, TRD, AppFlow, UI/UX, Backend, Plan) con leyenda [D]/[P]/[?]/[V] |
| [3. Asistente de programación](#3-asistente-de-programación-claude-code) | Claude Code en VS Code, repositorio `claude-config`, protocolo de pre-vuelo |
| [4. Skills](#4-skills-habilidades-del-asistente) | Skills globales, de la bóveda, instaladas en el proyecto y propias del proyecto |
| [5. Desarrollo y calidad](#5-desarrollo-y-calidad) | Next.js, TypeScript, ESLint, Vitest, smoke test, playwright-cli |
| [6. Contenido y recursos](#6-contenido-y-recursos-visuales) | ARASAAC, Wikimedia Commons, fotos propias, generación de imágenes, tipografías |
| [7. Demo y presentación](#7-demo-y-presentación) | `npm run share` (QR), Vercel, Recordly modificado por automatización, simulador de móvil en Edge |
| [8. Repositorio y entrega](#8-repositorio-y-entrega) | Git + GitHub, GitHub Actions, CodeQL, Dependabot, Docker, Mermaid |

---

## 1. Gestión del conocimiento

### Segundo cerebro en Obsidian (personal de Nicolás)
- **Qué es:** un «segundo cerebro» en [Obsidian](https://obsidian.md/) (notas Markdown enlazadas), fuera de este repositorio. Tiene su propio `CLAUDE.md` con convenciones: enlaces `[[doble corchete]]`, etiquetas (`#proyecto`, `#estado/activo`…), nombres en minúsculas con guiones, fechas `YYYY-MM-DD` y una sección «🔗 Relacionado» en cada nota.
- **Estructura:** `proyectos/`, `personas/`, `research/`, `resources/`, `ideas/`, `inbox/`, `daily-notes/`, `templates/` (plantillas de proyecto, persona, research…) y `bases/` (vistas de tabla de proyectos y personas con Obsidian Bases).
- **Dónde se usó:**
  - `proyectos/datathon.md`: ficha del proyecto (fase, decisiones, equipo, próximos pasos).
  - `resources/datathon-reto-3-neurodivergencia.md`: resumen del reto.
  - `resources/datathon-prompt-investigacion-legal-academica.md`: prompt para la investigación legal y académica.
  - `personas/`: una nota por persona del equipo (Marianela, Cristina, Dani, Leyre, Carlos).
- **Para qué:** tener el contexto del reto y de las decisiones fuera del código y consultable por el asistente de IA en cualquier sesión. El asistente lee y actualiza la bóveda con skills propias (ver §4.2).
- El repositorio también se puede abrir como bóveda de Obsidian (carpeta `.obsidian/`, ignorada en Git) para leer `docs/` con enlaces y vista de grafo.

### Google Doc del equipo
- **Qué es:** documento compartido de ideas y debate (enlace en `CLAUDE.md`).
- **Dónde se usó:** fase 0 (elegir la idea) y para las «candidatas» del PRD (frases de protocolo, calma, tiempos…).
- **Para qué:** que las seis personas del equipo aportaran sin tocar el repositorio. El asistente lo lee con la exportación pública en texto (`/export?format=txt`) y nunca inventa su contenido.

### `CLAUDE.md` del proyecto
- **Qué es:** archivo en la raíz que el asistente lee al empezar cada sesión.
- **Contiene:** contexto del reto, equipo, fuentes de verdad, principios de diseño accesible, reglas de trabajo (idioma, privacidad, vocabulario: «sede judicial», «neurodivergencia», nunca «discapacidad»), skills recomendadas y un **registro de decisiones fechado**.
- **Para qué:** que cualquier sesión, de cualquier persona, parta del mismo contexto y no contradiga lo acordado. Es la memoria del proyecto.

## 2. Planificación: los seis documentos
Antes de escribir código (21 de octubre, de 18:00 a 21:00) se redactaron seis documentos en `docs/`, cada uno con una responsabilidad:

| Documento | Pregunta que responde |
|---|---|
| [01 · PRD](01-PRD.md) | ¿Qué problema resolvemos, para quién y qué entra en el alcance? |
| [02 · TRD](02-TRD.md) | ¿Con qué tecnología y con qué decisiones técnicas? |
| [03 · AppFlow](03-AppFlow.md) | ¿Por qué pantallas pasa cada persona y qué ocurre en los casos límite? |
| [04 · UI/UX](04-UI-UX-Design.md) | ¿Cómo se ve, cómo se adapta y cómo se escribe (lenguaje simple)? |
| [05 · Backend Schema](05-Backend-Schema.md) | ¿Qué datos se guardan, dónde y quién puede verlos? |
| [06 · Implementation Plan](06-Implementation-Plan.md) | ¿En qué orden se construye, qué se recorta si falta tiempo y qué riesgos hay? |

- **Leyenda común:** **[D]** decidido · **[P]** propuesta · **[?]** abierto · **[V]** a validar por Derecho. Evita que una propuesta del asistente se tome por una decisión del equipo.
- **Plan por fases con corte mínimo:** el plan definía qué se recortaba primero si faltaba tiempo (apoyos → IA → enlace del abogado → citación). El buscador, el flujo y la barra de progreso no se recortaban.
- **Para qué:** construir el núcleo en una sola tarde (Fases 2–7 en ~50 minutos de implementación) porque las decisiones ya estaban escritas, y poder revisar después si el código cumple lo acordado.
- Tras el Datathon se añadieron los documentos [00](00-Resumen-ejecutivo.md) y [07–11](README.md) para documentar la calidad, el futuro y el despliegue.

## 3. Asistente de programación: Claude Code
- **Qué es:** [Claude Code](https://claude.com/claude-code), el asistente de programación de Anthropic, usado como extensión de **VS Code** en Windows 11. Lee y edita archivos, ejecuta comandos y trabaja con Git bajo supervisión.
- **Dónde se usó:** en todo el repositorio. El código, los documentos y los commits los propuso el asistente; las decisiones de alcance, el contenido legal y la revisión los hizo el equipo.
- **Configuración:**
  - **Repositorio `claude-config`** (personal de Nicolás, en GitHub): instrucciones globales y skills compartidas entre equipos y entornos (Windows y WSL). Un instalador (`install.ps1` / `install.sh`) añade `@~/claude-config/CLAUDE.md` a `~/.claude/CLAUDE.md` y enlaza las skills en `~/.claude/skills/`.
  - **Protocolo de pre-vuelo** (obligatorio en tareas de varios pasos, skill `preparar-tarea`): antes de cada tarea, el asistente reescribe la petición (objetivo, alcance, entregable, criterio de hecho), **recomienda el modelo y el esfuerzo mínimos** suficientes (Haiku → Sonnet → Opus según la complejidad) y decide qué skills usar. Sirve para controlar el coste y que el resultado sea verificable.
  - **Memoria persistente** por proyecto: notas breves que el asistente guarda entre sesiones (por ejemplo, cómo controlar Recordly; ver §7).
  - **Reglas del proyecto** en `CLAUDE.md` (ver §1) y `web/AGENTS.md`, que avisa de que Next.js 16 tiene cambios y obliga a leer su documentación local en `node_modules/next/dist/docs/` antes de usar sus APIs.

## 4. Skills (habilidades del asistente)
Una *skill* es un paquete de instrucciones (un `SKILL.md` y, a veces, scripts) que el asistente carga cuando la tarea lo pide. Se usaron cuatro tipos:

### 4.1 Globales (repositorio `claude-config`)
| Skill | Para qué |
|---|---|
| `preparar-tarea` | Pre-vuelo: prompt optimizado, modelo/esfuerzo y skills (ver §3) |
| `find-skills` | Buscar skills públicas con `npx skills find` y proponer instalarlas (solo con confirmación) |

### 4.2 Del segundo cerebro en Obsidian (`.claude/skills/` de la bóveda)
| Skill | Para qué |
|---|---|
| `obsidian-markdown`, `obsidian-bases`, `json-canvas` | Escribir con la sintaxis de Obsidian (wikilinks, propiedades, vistas `.base`, lienzos) |
| `capturar` | Crear una nota archivada en su carpeta, con su plantilla y enlaces |
| `nota-diaria`, `revision-semanal` | Diario y revisión semanal |
| `procesar-inbox`, `mantener-vault` | Vaciar el inbox y auditar enlaces rotos, notas huérfanas y nombres |

### 4.3 Instaladas en el proyecto (`.agents/skills/`, versiones fijadas en `skills-lock.json`)
Instaladas con la CLI `npx skills add` el 21 de octubre. Cada una se fijó con un hash para que todo el equipo use la misma versión.

| Skill | Origen | Dónde se usó | Para qué |
|---|---|---|---|
| `playwright-cli` (+ `dev`) | `microsoft/playwright-cli` | Recorridos en vista de móvil, vídeo de respaldo del demo | Controlar el navegador para probar la web |
| `web-design-guidelines` | `vercel-labs/agent-skills` | Revisión de interfaz y accesibilidad | Comprobar la UI con buenas prácticas web |
| `design-taste-frontend` | `Leonxlnx/taste-skill` | Criterio visual (jerarquía, color, espaciado) | Evitar una estética genérica. El análisis de seguridad de la CLI la marcó con riesgo medio: se revisó antes de usarla |
| `baoyu-image-gen` | `jimliu/baoyu-skills` | `npm run images:real` (`web/data/realistic/`) | Generar imágenes realistas por paso con APIs de imagen. Necesita claves propias, que nunca se suben. Después se sustituyeron casi todas por fotos (ver §6) |

### 4.4 Propias del proyecto (`.claude/skills/`)
| Skill | Para qué |
|---|---|
| `/sincronizar` | Un solo paso para **documentación → comprobaciones (lint y typecheck) → commit → push → merge a `main` con fast-forward**. Reglas: nunca `--force` ni `--amend`, nunca commits directos en `main`, no inventar decisiones en la documentación |
| `/actualizar-servidor-levantado` | Levanta el servidor del prototipo o, si ya está levantado, lo para, recompila y relanza; muestra el QR para el móvil |

### 4.5 Integradas en Claude Code
| Skill | Para qué |
|---|---|
| `artifact-diagramming` | Usada: diagrama de arquitectura para la presentación |
| `code-review`, `security-review`, `simplify`, `pptx`, `docx`, `pdf`, `dataviz` | Disponibles y recomendadas en `CLAUDE.md` para revisar el código y preparar entregables |

## 5. Desarrollo y calidad
| Herramienta | Dónde | Para qué |
|---|---|---|
| **Next.js 16.4 + React 19.3 + TypeScript 5** | `web/` | Una sola aplicación para las pantallas y la API |
| **`node:sqlite`** (módulo nativo de Node ≥ 22.13) | `web/src/server/db.ts` | Base de datos sin instalar nada |
| **tesseract.js 7 + unpdf** | `web/src/server/ocr.ts` | Leer la citación en el propio servidor, sin terceros |
| **ESLint 9** y `tsc --noEmit` | `npm run lint`, `npm run typecheck` | Estilo y tipos |
| **Vitest 3** | `web/tests/`, `npm test` | 49 tests unitarios: extracción de la citación, integridad del catálogo, traducciones completas y seguridad de los enlaces |
| **Smoke test propio** | `web/scripts/smoke-test.mjs`, `npm run smoke` | 36 comprobaciones de la API de punta a punta contra un servidor arrancado, incluido el OCR real de una imagen |
| **playwright-cli** | Recorridos del prototipo | Pruebas visuales en un Pixel 7 emulado |

## 6. Contenido y recursos visuales
| Recurso | Dónde | Para qué | Licencia / nota |
|---|---|---|---|
| **ARASAAC** (pictogramas) | `npm run pictos` → `web/public/pictos/arasaac/` | Un pictograma por paso y por documento | CC BY-NC-SA 4.0: atribución visible y **solo uso no comercial** |
| **Wikimedia Commons** | `web/public/images/facades/`, logotipos | Foto fija de la fachada de cada sede y logotipos | Autoría y licencia por foto en `courts.json` y `web/data/realistic/credits.json` |
| **Fotos propias del equipo** | Originales en `Assets/` (fuera de Git) → `web/public/images/realistic/` | Fotos por paso (control de seguridad, sala de espera…) | Recortadas a 3:2 y en WebP para el móvil. Pendiente: confirmar autoría y derechos |
| **Generación de imágenes con IA** | `baoyu-image-gen`, `web/data/realistic/` | Primeras imágenes realistas por paso | Marcadas como ilustrativas; sustituidas por fotos |
| **Atkinson Hyperlegible** y **OpenDyslexic** | `@fontsource/opendyslexic` | Tipos de letra más fáciles de leer | SIL OFL 1.1 |
| **Plena inclusión** | Referencia | Reglas de lectura fácil y accesibilidad cognitiva | Referencia, sin reutilizar textos |
| **Citaciones sintéticas** | `web/data/citaciones-sinteticas/` | Probar el OCR y la extracción sin datos reales | Inventadas, en los 4 idiomas |

## 7. Demo y presentación

### QR para el móvil (`npm run share`)
`web/scripts/share.mjs` compila, arranca el servidor y muestra en la terminal una URL de la red local y un **código QR** (`qrcode-terminal`). Con `PUBLIC_URL` genera el QR de un túnel (por ejemplo, `cloudflared`). Solo para el demo: el producto no usa QR.

### Vercel
Despliegue público del demo en https://datathon-olive.vercel.app (Root Directory `web`). Hoy corresponde a la rama `online` (ver [11 · Ramas y despliegue](11-Ramas-y-despliegue.md)).

### Simulador de móvil en Edge
Para las pruebas manuales en vista de móvil se usó la extensión de Edge *Simulador de teléfono móvil – prueba de sitio responsive*.

### Recordly, grabado de forma automática
- **Qué es:** [Recordly](https://github.com/webadderallorg/Recordly) v1.4.0, un grabador de pantalla de código abierto (Electron) que añade zoom automático y efectos de clic a partir de los movimientos del ratón.
- **Instalación:** desde la *release* oficial de GitHub. El instalador no está firmado, así que se comprobó su hash SHA-256 con el publicado.
- **Problema:** Recordly sigue el **cursor real del sistema**. El ratón simulado de Playwright no le llega, así que no hacía zooms ni efectos. Además no tiene línea de comandos ni atajos globales, y su puerto de depuración está bloqueado.
- **Qué se cambió:**
  1. **Control por UI Automation de Windows** (la API de accesibilidad del sistema): un script pulsa los botones «Grabar» y «Detener» de Recordly y elige la fuente.
  2. **Ratón real:** un proceso de PowerShell mueve el cursor de Windows con suavidad (`SetCursorPos` y `mouse_event` de `user32`) y hace clics reales, calibrados de píxeles de la página a píxeles de la pantalla.
  3. **Escenario de móvil:** una página a pantalla completa en Edge con un **marco de iPhone** y la app dentro de un iframe de 390 × 844, el logotipo de SimuLex, un panel lateral grande con el título de cada sección para proyectar y un recuadro con el QR.
  4. **Ajustes de Recordly:** se graba solo la ventana de Edge (sin barra de tareas ni panel) y se quitó el relleno del fondo.
  5. **Guion del recorrido** de ~4 minutos por todas las funciones, con capturas de control durante la grabación.
- **Resultado:** grabaciones de ~4 minutos a 1920 × 1080 con unos 50 clics registrados, que Recordly usa para los zooms. Además, un vídeo de respaldo grabado con Playwright. **Vídeo publicado:** https://youtu.be/t4ye8JS2_Rg
- **Para qué:** tener un demo en vídeo estable para la presentación por si fallaba la red, sin grabarlo a mano.

## 8. Repositorio y entrega
| Herramienta | Dónde | Para qué |
|---|---|---|
| **Git + GitHub** | https://github.com/perezllanosnicolas/Datathon | Ramas por funcionalidad, merge a `main` con fast-forward (`/sincronizar`), commits en inglés con formato convencional (`feat:`, `fix:`, `docs:`, `chore:`) |
| **GitHub Actions** | `.github/workflows/ci.yml` | En cada push: lint, tipos y tests en Node 22 y 24; build y smoke test; imagen Docker en la rama `local` |
| **CodeQL** | `.github/workflows/codeql.yml` | Análisis estático de seguridad en cada push y cada semana |
| **Dependabot** | `.github/dependabot.yml` | Actualizaciones semanales de dependencias (npm) y mensuales de las acciones |
| **Plantillas de issues y PR** | `.github/` | Que cada cambio diga a qué rama va y cumpla las reglas (lenguaje simple, 4 idiomas, sin datos reales) |
| **Docker + Docker Compose** | Rama `local` | Ejecutar el prototipo con un comando, sin instalar Node |
| **Mermaid** (+ `mermaid-cli` para validarlos) | [07 · Diagramas](07-Diagramas.md) | Diagramas como texto que GitHub dibuja solo |

---

## Lecciones para un proyecto real
1. **Decidir por escrito antes de programar** (seis documentos y leyenda [D]/[P]/[?]) hace que un asistente de IA sea útil y no invente alcance.
2. **Un `CLAUDE.md` con un registro de decisiones** sirve de memoria compartida entre personas y sesiones.
3. **Fijar versiones de las skills** (`skills-lock.json`) y revisar su código antes de instalarlas: son código de terceros con acceso al repositorio.
4. **Automatizar el ritual de guardar** (`/sincronizar`) evita commits en `main`, documentación desfasada y pushes forzados.
5. **La IA propone y el equipo valida:** el contenido legal lo revisó Derecho, y lo pendiente queda marcado como [V].
