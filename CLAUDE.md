# CLAUDE.md — Datathon Brecha Judicial (Reto 3: Justicia inteligente para la neurodiversidad)

## Contexto
- Datathon *Brecha Judicial* (DATAfórum JUSTICIA 2026), **Reto 3** (responsable: Ana Tudela, INECO).
- Objetivo: reducir la brecha judicial de las personas neurodivergentes (TEA, TDAH, dislexia, discalculia, disgrafía): preparar a la persona para el proceso judicial y capacitar a los profesionales de la justicia para adaptarse. Enfoque **no capacitista**.
- Los casos de ejemplo del reto (Luis y Juan) se han retirado del proyecto. **El demo es del ámbito civil.**
- Marco legal: art. 24 CE, Ley 15/2022, RDL 1/2013 (accesibilidad universal y ajustes razonables).
- **Fase actual: 2–7 (prototipo del núcleo construido en la rama `feat/demo-core`)**; detalles en `docs/`. No asumir como decidido nada marcado [P] o [?] en esos documentos. Cómo arrancarlo: `README.md`.

## Equipo
Nicolás (Ingeniería de Computadores), Marianela (IA), Cristina (Informática + Criminología), Dani (Informática + ADE), Leyre y Carlos (Derecho).

## Fuentes de verdad
- **Ideas y debate:** Google Doc compartido → https://docs.google.com/document/d/1E_l_noJw12htOWVmz6xXf_O1P5Tk6Q15mclCArV0nq8/edit (ID: `1E_l_noJw12htOWVmz6xXf_O1P5Tk6Q15mclCArV0nq8`) (leerlo siempre antes de proponer ideas o decisiones; ver "Acceso al Google Doc").
- **Código:** este repositorio (https://github.com/perezllanosnicolas/Datathon).
- **Notas del vault personal de Nicolás** (Obsidian, fuera de este repo): proyecto `Datathon` y resumen del reto.

## Acceso al Google Doc
1. Si hay conector de Google Drive/Docs disponible, usarlo (lectura en vivo).
2. Si no, y el documento está compartido como "cualquiera con el enlace puede ver", leer la exportación con WebFetch: `https://docs.google.com/document/d/<ID>/export?format=txt` (o `format=md`). Es una instantánea al momento de la lectura: volver a leer si se necesita lo último. Google responde con un 307 a `googleusercontent.com`: repetir WebFetch con esa URL de redirección. WebFetch devuelve un resumen, no el texto literal; si hace falta el texto exacto, pedir un prompt que lo reproduzca por secciones o pegarlo.
3. Si ninguna funciona, pedir al usuario que pegue el contenido. Nunca inventar el contenido del documento.

## Skills recomendadas

### Ya disponibles (sesión de Nicolás)
| Skill | Para qué |
|---|---|
| `anthropic-skills:pptx` | Crear/editar la presentación final como .pptx |
| `anthropic-skills:docx`, `anthropic-skills:pdf` | Memoria, one-pager y documentos de entrega |
| `anthropic-skills:docs`, `anthropic-skills:google-workspace` | Editar/crear Google Docs, Sheets y Slides |
| `artifact-design`, `artifact-diagramming` | Páginas y diagramas (arquitectura, flujo del usuario) |
| `dataviz` | Gráficos y datos del reto con buen diseño |
| `anthropic-skills:deep-research` | Investigación de contexto, legislación y referentes |
| `code-review`, `simplify`, `security-review` | Calidad del código antes de la entrega (datos sensibles: ver reglas) |

### Instaladas en el proyecto (2026-10-21, en `.agents/skills/`, enlazadas a Claude Code; versiones en `skills-lock.json`)
| Skill | Origen | Para qué |
|---|---|---|
| `design-taste-frontend` | `Leonxlnx/taste-skill` | Criterio de diseño de frontend. Snyk marca "Med Risk" (1 alerta): revisar el código antes de fiarse |
| `web-design-guidelines` | `vercel-labs/agent-skills` | Revisión de UI y accesibilidad (0 alertas) |
| `playwright-cli` y `dev` | `microsoft/playwright-cli` | Automatizar el navegador y probar la web del prototipo |
| `baoyu-image-gen` | `.claude/skills/baoyu-image-gen/` (carpeta real) | Generar imágenes con IA (`npm run images:real`). Necesita claves de API propias: no subirlas |
| `/sincronizar` | Propia (`.claude/skills/sincronizar/`) | Actualizar documentación, commit y push a GitHub. Solo la invoca una persona; nunca fuerza ni sube a `main` sin que se indique |

`VoltAgent/awesome-design-md` **no es una skill** (no tiene `SKILL.md`): es una colección de `DESIGN.md` de marcas, útil solo como referencia de diseño; no instalada.

### Por instalar (cada una con `npx skills add <paquete>`, solo previa confirmación del usuario)
**Diseño de presentaciones**
- `anthropics/skills@pptx` — base para .pptx (239K installs; oficial).
- `lewislulu/html-ppt-skill@html-ppt` — presentaciones en HTML (20K).
- `jimliu/baoyu-skills@baoyu-slide-deck` — estructura narrativa de slides (31K).
- `affaan-m/ecc@investor-materials` — materiales de pitch (10K).

**Diseño de interfaz y buenas prácticas**
- `anthropics/skills@frontend-design` — frontends cuidados, sin estética genérica (1M; oficial).
- `nextlevelbuilder/ui-ux-pro-max-skill@ui-ux-pro-max` — UX, paletas, tipografía (407K).
- `pbakaus/impeccable@impeccable` — pulido y refinamiento de diseño (348K).

> Instalaciones y popularidad verificadas con `npx skills find` el 2026-10-21; no se ha revisado el código de cada skill. Revisar antes de instalar las que no sean de `anthropics` o `vercel-labs`.

## Principios de diseño (esta solución se dirige a personas neurodivergentes)
- **Accesibilidad cognitiva primero:** lenguaje claro y literal, frases cortas, sin ambigüedad ni metáforas; ofrecer lectura fácil.
- **Poca carga sensorial:** sin animaciones intrusivas, sin parpadeos, contraste suficiente (WCAG AA mínimo), modo reducido de movimiento y de color.
- **Anticipación:** mostrar siempre qué va a pasar, cuánto dura y qué se espera de la persona.
- **Compatibilidad con lectores de pantalla** (personas con ceguera o baja visión): HTML semántico, etiquetas, texto alternativo, navegación por teclado.
- **Control para la persona:** ritmo propio, posibilidad de pausar, repetir y saltar.
- **Tipografía legible** (apta para dislexia): sans-serif, buen interlineado, alineación a la izquierda, bloques cortos.
- **Presentación del equipo:** un mensaje por diapositiva, pocas palabras, narrativa problema → persona (caso civil inventado) → solución → demo → impacto → siguientes pasos.

## Reglas de trabajo
- Responder en español; nombres de código y commits en inglés.
- **Privacidad:** no usar datos personales reales ni informes clínicos reales; usar datos sintéticos. La app no recoge documentación clínica ni diagnósticos. Aviso explícito de que la herramienta no sustituye asesoramiento legal.
- No afirmar contenido legal sin citar la norma; marcar como "a validar por Leyre/Carlos" lo dudoso.
- No tomar decisiones de alcance por el equipo: proponer opciones con pros y contras y registrar lo acordado abajo.
- Cambios pequeños y commits claros; trabajar en ramas por funcionalidad y no tocar `main` sin acuerdo.
- Mantener un `README.md` actualizado con cómo ejecutar el prototipo.

## Decisiones
- 2026-10-21 — Equipo y repositorio definidos. Fase 0, solución pendiente de elegir.
- 2026-10-21 — Solución definida (detalle en `docs/`): web usada **antes** de ir al juzgado; el juzgado se escanea con vídeo y la API de KIRI Engine genera el 3D; el encargado anota funciones/procesos por sala y estímulos estridentes; el usuario se registra con cuestionario de adaptación (idioma, tamaño de letra, filtros por neurodivergencia), elige trámite y juzgado, y ve un diagrama de flujo interactivo granular (documentos de entrada/salida) con vista inmersiva por paso si el juzgado está escaneado.
- 2026-10-21 — Ajuste de alcance: el **núcleo** es registro + adaptaciones + diagrama de flujo interactivo. El escaneo 3D (KIRI Engine) y la experiencia inmersiva pasan a **anexo/futuro extra**. Sin QR. Formato: **web mobile-first**. **Sin documentación clínica** (solo preferencias de adaptación elegidas por la persona). Los pasos de llegada incluyen **Street View de Google Maps** de la entrada (sentido de la vía, acceso) con alternativa en texto.
- 2026-10-21 — La selección de trámite y juzgado se hace por **buscador con filtros** o, si no se quiere buscar, **subiendo documento/foto de la citación**: se pasa a texto y de ese texto se extrae el tipo de trámite y el juzgado (sustituye la idea anterior de IA que identificaba los pasos). (Propuesto, pendiente de validar: se empareja con un catálogo revisado por Derecho, la persona confirma, y ni el documento ni el texto se guardan.)
- 2026-10-21 — **Enlace de vinculación para el abogado/a:** la persona lo envía y el abogado indica qué documentación hay que llevar; aparece en la app en los pasos. El abogado se identifica con **nombre y número de colegiado**. (Propuesto: solo texto, sin ver el perfil de adaptaciones, enlace con caducidad y revocable.)
- 2026-10-21 — El **OCR de la citación se ejecuta en el servidor propio** donde se aloja el servicio (sin terceros).
- 2026-10-21 — **Alcance del demo: ámbito civil.** Se retiran los casos Luis y Juan.
- 2026-10-21 — **Barra de progreso** en el flujo: indica cuántos pasos has hecho y cuántos quedan. **Uso sin registro** (perfil y progreso en el dispositivo). **Sin notificaciones por correo.** **Hosting local para la demo.** **Stack libre** (propuesto: Next.js + TypeScript + SQLite + Tesseract; ver `docs/02-TRD.md`). **Análisis RGPD aplazado**: ahora se prioriza la implementación.
- 2026-10-21 — **Street View solo de la fachada** (imagen fija con la Street View Static API de Google Maps; sí es viable). **IA en español, catalán, gallego y euskera: ALIA-40B** como apoyo opcional (asistente con contenido revisado); necesita un equipo con mucha memoria, a comprobar antes de comprometerse (`docs/02-TRD.md` §2f). Plan de implementación reescrito por fases con corte mínimo del demo.
- 2026-10-21 — Creada la skill de proyecto **`/sincronizar`** (`.claude/skills/sincronizar/`): actualiza la documentación, hace commit y sube a GitHub.
- 2026-10-21 — **Idiomas: español, catalán, euskera y gallego.**
- 2026-10-21 — **Enlace del abogado:** vigente **48 horas**; el número de colegiado queda como **dato declarado (sin verificar)**; la persona **no comparte nada directamente** con el abogado (este solo escribe la lista de documentos).
- 2026-10-21 — Dato de contexto: estimación del equipo de 150.000–300.000 personas neurodivergentes que acuden a un juzgado al año en España (estimación, no dato oficial).
- 2026-10-21 — Referencia externa: **Plena inclusión** (lectura fácil y accesibilidad cognitiva) https://www.plenainclusion.org/
- 2026-10-21 — **Lenguaje lo más simple posible** en toda la app (frases cortas, palabras de uso diario, términos legales explicados); reglas en `docs/04-UI-UX-Design.md` §8.
- 2026-10-21 — Documentación en 6 documentos: PRD, TRD, AppFlow, UI/UX, Backend Schema, Implementation Plan.
- 2026-10-21 — Instaladas en el proyecto las skills de desarrollo web: taste-skill, web-design-guidelines y playwright-cli (ver "Skills recomendadas").
- 2026-10-21 — **Prototipo del núcleo** en `web/` (rama `feat/demo-core`): Next.js 16 + TypeScript, SQLite (`node:sqlite`) y OCR con tesseract.js en el servidor. Incluye cuestionario, ajustes, buscador, citación, flujo con barra de progreso, fachada y enlace del abogado. **Provisional, pendiente de que decida el equipo:** el trámite de ejemplo (juicio verbal; segundo trámite: testigo, solo en español) y los juzgados de ejemplo (Madrid, Capitán Haya 66, y Ciudad de la Justicia de Barcelona). Las descripciones de la entrada son sintéticas. Los textos legales están marcados "a validar por Leyre/Carlos" y las traducciones ca/gl/eu son borradores. El catálogo es JSON en `web/data/catalog/` (no una tabla `translations` en la base de datos), para que lo pueda editar el equipo de Derecho [P]. Nombre provisional: "Paso a paso al juzgado" [?].
- 2026-10-22 — **Mejoras del prototipo (rama `feat/demo-core`)**, provisionales hasta que decida el equipo: pictogramas de ARASAAC (CC BY-NC-SA; hay que mantener la atribución visible) descargados con `npm run pictos`; mapa del flujo (`FlowMap`), imágenes por paso (`StepImage`), dictado por voz (`Dictation`) y campo de texto accesible (`TextField`); imágenes realistas generadas con IA (`npm run images:real`, skill `baoyu-image-gen`) que deben marcarse como ilustrativas [P]. Se ejecutan `lint` y `typecheck` sin errores.
- 2026-10-22 — **QR para abrir el prototipo en el móvil:** `npm run share` (en `web/`) arranca el servidor y muestra una URL y un código QR de la red Wi-Fi local; con `PUBLIC_URL` genera el QR de un túnel. Es solo para el demo, no una función de la app (sigue "sin QR" en el producto).

## Estructura del repo
- `.agents/skills/` — skills instaladas del proyecto; `skills-lock.json` — sus versiones.
- `.claude/` — enlaces de Claude Code a esas skills.
- `docs/` — `01-PRD.md`, `02-TRD.md`, `03-AppFlow.md`, `04-UI-UX-Design.md`, `05-Backend-Schema.md`, `06-Implementation-Plan.md`, `Anexo-3D-Escaneo.md` (futuro). Marcas: [D] decidido, [P] propuesta, [?] abierto, [V] a validar por Leyre/Carlos.
- `README.md` — cómo arrancar el prototipo y qué incluye.
- `web/` — prototipo Next.js: `data/catalog/` (trámites, juzgados y glosario en 4 idiomas), `data/citaciones-sinteticas/`, `scripts/smoke-test.mjs` (prueba de la API), `src/app/` (pantallas y API), `src/components/`, `src/i18n/` (textos de la interfaz), `src/lib/` (catálogo, extracción, almacenamiento en el dispositivo), `src/server/` (SQLite, tokens, OCR). Además: `data/realistic/` (prompts y lista de imágenes realistas), `public/pictos/` (pictogramas ARASAAC), `public/images/`, `scripts/fetch-pictograms.mjs`, `scripts/list-realistic.mjs` y `scripts/share.mjs` (URL + QR para el móvil). Next.js 16 tiene cambios: leer `web/node_modules/next/dist/docs/` antes de tocar APIs de Next (ver `web/AGENTS.md`).
