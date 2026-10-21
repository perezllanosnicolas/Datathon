# CLAUDE.md — Datathon Brecha Judicial (Reto 3: Justicia inteligente para la neurodiversidad)

## Contexto
- Datathon *Brecha Judicial* (DATAfórum JUSTICIA 2026), **Reto 3** (responsable: Ana Tudela, INECO).
- Objetivo: reducir la brecha judicial de las personas neurodivergentes (TEA, TDAH, dislexia, discalculia, disgrafía): preparar a la persona para el proceso judicial y capacitar a los profesionales de la justicia para adaptarse. Enfoque **no capacitista**.
- Casos de uso del reto: **Luis** (TEA nivel 1, testigo en un procedimiento penal) y **Juan** (TDAH + ceguera, acusado de estafa leve, art. 249 CP).
- Marco legal: art. 24 CE, Ley 15/2022, RDL 1/2013 (accesibilidad universal y ajustes razonables).
- **Fase actual: 0** — alcance definido a alto nivel (ver "Decisiones"); detalles en `docs/`. No asumir como decidido nada marcado [P] o [?] en esos documentos.

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
- **Compatibilidad con lectores de pantalla** (caso de Juan): HTML semántico, etiquetas, texto alternativo, navegación por teclado.
- **Control para la persona:** ritmo propio, posibilidad de pausar, repetir y saltar.
- **Tipografía legible** (apta para dislexia): sans-serif, buen interlineado, alineación a la izquierda, bloques cortos.
- **Presentación del equipo:** un mensaje por diapositiva, pocas palabras, narrativa problema → persona (Luis/Juan) → solución → demo → impacto → siguientes pasos.

## Reglas de trabajo
- Responder en español; nombres de código y commits en inglés.
- **Privacidad:** no usar datos personales reales ni informes clínicos reales; usar datos sintéticos. Aviso explícito de que la herramienta no sustituye asesoramiento legal.
- No afirmar contenido legal sin citar la norma; marcar como "a validar por Leyre/Carlos" lo dudoso.
- No tomar decisiones de alcance por el equipo: proponer opciones con pros y contras y registrar lo acordado abajo.
- Cambios pequeños y commits claros; trabajar en ramas por funcionalidad y no tocar `main` sin acuerdo.
- Mantener un `README.md` actualizado con cómo ejecutar el prototipo.

## Decisiones
- 2026-10-21 — Equipo y repositorio definidos. Fase 0, solución pendiente de elegir.
- 2026-10-21 — Solución definida (detalle en `docs/`): web usada **antes** de ir al juzgado; el juzgado se escanea con vídeo y la API de KIRI Engine genera el 3D; el encargado anota funciones/procesos por sala y estímulos estridentes; el usuario se registra con cuestionario de adaptación (idioma, tamaño de letra, filtros por neurodivergencia), elige trámite y juzgado, y ve un diagrama de flujo interactivo granular (documentos de entrada/salida) con vista inmersiva por paso si el juzgado está escaneado.
- 2026-10-21 — Documentación en 6 documentos: PRD, TRD, AppFlow, UI/UX, Backend Schema, Implementation Plan.
- 2026-10-21 — Instaladas en el proyecto las skills de desarrollo web: taste-skill, web-design-guidelines y playwright-cli (ver "Skills recomendadas").

## Estructura del repo
- `.agents/skills/` — skills instaladas del proyecto; `skills-lock.json` — sus versiones.
- `.claude/` — enlaces de Claude Code a esas skills.
- `docs/` — `01-PRD.md`, `02-TRD.md`, `03-AppFlow.md`, `04-UI-UX-Design.md`, `05-Backend-Schema.md`, `06-Implementation-Plan.md`. Marcas: [D] decidido, [P] propuesta, [?] abierto, [V] a validar por Leyre/Carlos.
- _(resto por completar cuando haya código)_
