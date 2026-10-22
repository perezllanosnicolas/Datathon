# 02 · TRD — Documento de requisitos técnicos

> Leyenda: **[D]** decidido · **[P]** propuesta · **[?]** abierto.

> **Estado (2026-10-22):** el prototipo **SimuLex** está construido en `web/` y mergeado en `main`. Este documento describe lo que hay en el código; lo que sigue siendo propuesta o futuro está marcado.

## 1. Decisiones técnicas tomadas
- **[D]** Aplicación **web mobile-first**.
- **[D]** Fachada de la sede judicial: **foto fija** de Wikimedia Commons (sin clave ni internet). Street View de Google Maps queda como **opción futura** (ver §3).
- **[D]** IA para hablar en español, catalán, gallego y euskera: **ALIA-40B** (ver §2f). **No está en el prototipo:** el núcleo funciona sin IA.
- **[D]** Sin documentación clínica. Sin QR en el producto (el QR de `npm run share` es solo para abrir el demo en el móvil).
- **[D]** El 3D / KIRI Engine pasa a anexo (ver [Anexo-3D-Escaneo.md](Anexo-3D-Escaneo.md)).
- **[D, provisional]** Despliegue del demo en **Vercel** para la presentación; el hosting local sigue disponible (ver §2e).

## 2. Arquitectura implementada
```
Móvil de la persona (navegador, sin cuenta)
   ├─ Pantallas Next.js: cuestionario, ajustes, elegir, buscar, citación,
   │  confirmar, flujo de pasos, resumen, glosario, invitar al abogado/a
   └─ localStorage: perfil de adaptaciones, casos (id + secreto), progreso
          │  (el perfil y el progreso NO se envían al servidor;
          │   solo el idioma va en la cookie bj_lang para <html lang>)
          ▼
Servidor Next.js 16 (un portátil en la Wi-Fi local, o Vercel)
   ├─ POST /api/citation ─► unpdf (PDF con texto) / tesseract.js (foto)
   │                       ─► extract.ts (reglas) ─► catálogo JSON
   ├─ /api/cases/…        ─► SQLite (node:sqlite): casos, enlaces, documentos
   ├─ /api/lawyer/[token] ─► SQLite (lista de documentos del abogado/a)
   ├─ Catálogo JSON en web/data/catalog/ (trámites, sedes, glosario, pictogramas)
   └─ Imágenes en web/public/ (fachadas, fotos por paso, pictogramas ARASAAC, logotipos)
          ▲
Móvil del abogado/a ── /abogado/[token] (enlace de 48 h, solo escribe documentos)

Futuro (no implementado): ALIA-40B · Street View · escaneo 3D (KIRI Engine)
```

### Stack del prototipo [D por delegación del equipo]
| Pieza | Qué se usa | Dónde |
|---|---|---|
| Framework | **Next.js 16.4** (App Router) + **React 19.3** | `web/src/app/` |
| Lenguaje | **TypeScript 5** | todo `web/src/` |
| Base de datos | **SQLite** con el módulo nativo `node:sqlite` (sin paquete ni servidor de base de datos). Requiere **Node.js ≥ 22.13** | `web/src/server/db.ts`, archivo `web/data/app.db` (`/tmp/app.db` en Vercel) |
| Catálogo | **Archivos JSON** con los textos en los 4 idiomas (no tablas de base de datos), editables por Derecho | `web/data/catalog/` |
| OCR | **tesseract.js 7** (modelos `spa+cat+glg+eus`, se descargan la primera vez a `web/data/tessdata/`) y **unpdf** para PDF con texto | `web/src/server/ocr.ts` |
| Extracción | Reglas y palabras clave, **sin modelo generativo**; función pura | `web/src/lib/extract.ts` |
| Idiomas | **Sin biblioteca i18n:** un diccionario TypeScript por idioma (`es` es la referencia de claves) | `web/src/i18n/{es,ca,gl,eu}.ts` |
| Estilos | CSS propio con variables (sin framework de CSS) | `web/src/app/globals.css` |
| Tipos de letra | Atkinson Hyperlegible y **OpenDyslexic** (`@fontsource/opendyslexic`, SIL OFL 1.1) | Ajustes → tipo de letra |
| Voz | Web Speech API del navegador: `speechSynthesis` (leer en voz alta) y `SpeechRecognition` (dictado) | `web/src/components/ui.tsx`, `Dictation.tsx` |
| Pictogramas | **ARASAAC** (CC BY-NC-SA; atribución visible), descargados con `npm run pictos` | `web/public/pictos/` |
| Seguridad | `node:crypto`: secretos aleatorios guardados como hash SHA-256, comparación en tiempo constante, límite de peticiones en memoria | `web/src/server/security.ts` |
| Calidad | ESLint 9 (`eslint-config-next`), `tsc --noEmit`, prueba de la API `npm run smoke` (33 comprobaciones) | `web/scripts/smoke-test.mjs` |

- **Diagrama de flujo [D]:** componente propio accesible (lista ordenada de pasos con navegación), no un lienzo de arrastrar: funciona con teclado y lector de pantalla. Encima va un mapa de pasos desplegable (`FlowMap`) y la barra de progreso (`ProgressBar`).
- **Contenido como datos [D]:** trámites, sedes y glosario viven en JSON, no en el código. No hay panel de editor: el equipo edita los JSON.
- **Hosting:** local o Vercel; ver §2e.

## 2f. IA en cuatro idiomas: ALIA-40B [D el modelo, P el uso]
**Decisión:** la IA de la herramienta, para español, catalán, gallego y euskera, es **ALIA-40B** (modelo abierto del Barcelona Supercomputing Center, con los cuatro idiomas cooficiales como prioridad, según las fuentes consultadas). Datos comprobados en fuentes secundarias; confirmar en la ficha oficial de Hugging Face (`BSC-LT/ALIA-40b` y la variante `-instruct`): versión vigente, licencia (las fuentes indican Apache 2.0), plantilla de chat (ChatML) y longitud de contexto [?].

### Para qué se usa [P, a decidir por el equipo]
El núcleo (flujo, barra de progreso, adaptaciones, OCR y extracción por reglas) **no depende de la IA**. ALIA se añade como apoyo:
1. **Asistente "Pregúntame"**: responde dudas sobre el trámite en el idioma de la persona, en lenguaje simple, usando **solo** contenido del catálogo revisado por Derecho (RAG, es decir, buscar en el catálogo y responder con eso).
2. **Ayuda a redactar y simplificar** contenido y traducciones para el equipo. Todo texto que vea el usuario pasa antes por revisión humana (hablante del idioma y Derecho).
3. Opcional: apoyo a la extracción de la citación cuando las reglas no bastan [?].

### Reglas de uso [P]
- No da asesoramiento legal ni decide por la persona; aviso visible.
- Responde solo con lo que hay en el catálogo; si no lo sabe, lo dice y remite al personal del juzgado o a su abogado.
- Sin datos personales en las consultas: no se envía la citación ni el perfil. Con inferencia local, nada sale del equipo.
- Respuestas cortas, con las reglas de [lenguaje simple](04-UI-UX-Design.md#8-lenguaje-simple-d); temperatura baja.
- Si la IA tarda o falla: se muestra el contenido ya escrito del paso (el asistente es un extra).

### Requisito de hardware: aviso importante
ALIA-40B tiene unos 40 000 millones de parámetros (las fuentes lo sitúan en la escala de 46B). Una cuantización comunitaria Q4_K_M ocupa unos **23 GB** y se recomiendan **48 GB de RAM** (fuente de terceros, no oficial). Un portátil normal **no lo mueve con fluidez**. Opciones [?]:
| Opción | Ventajas | Inconvenientes |
|---|---|---|
| A. Equipo propio con memoria suficiente (GPU con ≥ 24 GB de VRAM, o Mac con ≥ 48 GB de memoria unificada) | Coherente con hosting local; nada sale | Hace falta tener ese equipo |
| B. Dos equipos: la web en el portátil y ALIA en un equipo potente de la misma red | Reparte la carga | Más cosas que preparar el día del demo |
| C. Inferencia en un servicio externo | No requiere hardware | Rompe el "todo local"; envía consultas fuera; coste y dependencia de internet |
| D. Modelo más pequeño de la misma familia (por ejemplo, Salamandra 7B) como plan B | Cabe en un portátil | Peor calidad; confirmar disponibilidad y licencia |
- **Primera acción:** comprobar qué equipos tiene el equipo y probar ALIA con una consulta real antes de comprometerse [?].
- Ejecución: llama.cpp u Ollama con formato GGUF (cuantizado), o vLLM si hay GPU potente [P]. Las cuantizaciones GGUF de la comunidad son de terceros: verificar su origen o cuantizar nosotros [V].
- Medir: tiempo de la primera respuesta, velocidad y calidad en los cuatro idiomas con preguntas sintéticas; revisión por hablantes nativos.
- Plan B de demo: respuestas pregrabadas y contenido ya escrito si la IA falla.

## 2e. Hosting del demo: local y Vercel
### Local [D]
- **Una sola máquina** con la web, la API, la base de datos y el OCR. Sin semilla en la base de datos: el catálogo se lee de los JSON y las tablas se crean solas al arrancar.
- Comandos (en `web/`): `npm run dev` (desarrollo), `npm run demo` (compila y sirve en `0.0.0.0:3000`), `npm run share` (arranca y muestra una URL y un **QR** de la red local; con `PUBLIC_URL` genera el QR de un túnel). Ver `README.md`.
- **Acceso desde el móvil:** el móvil y el equipo van en la **misma red Wi-Fi**. Mejor una red propia (punto de acceso del móvil). `next.config.ts` permite abrir el servidor de desarrollo desde IP locales (`allowedDevOrigins`).
- **Enlace del abogado:** con servidor local, el enlace solo funciona dentro de esa red. El "abogado" se simula con un segundo dispositivo en la misma red, o con un túnel temporal.
- **HTTPS:** en red local se usa HTTP. No hay PWA ni funciones que exijan HTTPS (la cámara se usa con el selector de archivos del móvil). El botón de copiar el enlace tiene alternativa si el portapapeles no está disponible por HTTP.
- **Sin internet:** todo funciona salvo la primera descarga de los modelos del OCR. Conviene subir una citación de prueba antes del demo.

### Vercel [D, provisional]
- Root Directory = `web`; sin variables de entorno.
- El disco solo es escribible en `/tmp`: la base de datos va en `/tmp/app.db` y los modelos del OCR en `/tmp/tessdata` (detectado con la variable `VERCEL`). La base de datos **no es permanente ni se comparte entre instancias**: un caso o un enlace del abogado puede desaparecer tras un rato sin uso.
- Vercel limita el cuerpo de la petición a 4,5 MB: las fotos de más de 3,5 MB se reducen en el navegador antes de subirlas. Un PDF de más de 4,5 MB no se puede subir.
- `next.config.ts` incluye los archivos de `tesseract.js` en la traza (`outputFileTracingIncludes`) porque los carga en tiempo de ejecución.
- Si el enlace del abogado tiene que ser fiable entre dispositivos, habría que pasar a una base de datos externa [?].

### Otros
- **ALIA-40B exige un equipo con mucha memoria** (ver §2f): decidir si va en el mismo equipo o en otro de la misma red.
- **Copia de seguridad:** el repositorio basta (el contenido está en JSON). Probar el demo desde cero en otro equipo antes de la presentación [P].
- Si se publica en un servidor real, se revisa HTTPS, copias, logs y el análisis RGPD (aplazado).

## 2b. Selección de trámite: buscador o citación [D la funcionalidad, P el diseño]

### Buscador
- Búsqueda con filtros (trámite y sede judicial) sobre el catálogo JSON, tolerante a tildes y mayúsculas, con sinónimos (`searchTerms`: "juicio", "declarar", "testigo") y en los cuatro idiomas a la vez [D].
- Es el respaldo siempre disponible. En la pantalla «Elegir», subir la citación va primero y el buscador después.

### Subida de la citación: de imagen a texto y de texto a trámite y juzgado [D]
Si la persona no quiere buscar, sube un documento o una foto de la citación.
```
Subir citación (PDF / foto)
   ─► 1. Pasar a texto (extracción de texto del PDF u OCR si es imagen)
   ─► 2. Extraer del texto: tipo de trámite + juzgado
   ─► 3. Emparejar con el catálogo de trámites y juzgados
   ─► 4. Mostrar lo detectado; la persona CONFIRMA o corrige
   ─► 5. Se carga el flujo del trámite y juzgado
```
- **Paso 1 (a texto) [D, implementado]:** PDF con texto → `unpdf`; foto (JPG/PNG) → **tesseract.js** con `spa+cat+glg+eus`; también se aceptan `.txt` para probar. El tipo se comprueba por el contenido del archivo, no por la extensión. **El OCR se ejecuta en el servidor propio** [D]: no en el navegador y no en un servicio de terceros. Un **PDF escaneado (sin texto) no se lee todavía** [?]. Falta comparar la calidad con fotos reales de móvil y decidir si se preprocesa la imagen [?].
- **Paso 2 (extraer) [D, implementado]:** `extract.ts` busca el trámite, la sede judicial y, si aparecen, fecha y hora, con reglas y palabras clave contra el catálogo (`searchTerms` y nombres de sede en los 4 idiomas; las palabras de papel, como "testigo", pesan más). **Sin modelo generativo.** Un modelo de lenguaje solo como apoyo y si el equipo lo decide [?].
- **Paso 3 (emparejar) [D]:** el resultado siempre es una entrada del catálogo. **Nunca se generan pasos nuevos a partir del texto.** Al navegador solo vuelven los ids del catálogo y la fecha y hora.
- Si no se reconoce el trámite, la sede o ambos: se dice qué falta y se ofrece el buscador, con lo detectado ya relleno.
- El documento **se procesa en memoria y se descarta**: no se escribe en disco, el búfer se borra al terminar (también si falla) y el texto no se registra [D].
- **Datos personales:** la citación contiene nombre y número de procedimiento. Al hacerse el OCR en nuestro servidor, el documento no sale a terceros [D]. En local se usa HTTP; en Vercel, HTTPS. La base legal y el aviso de privacidad (RGPD) se definen con Leyre y Carlos **más adelante** [D].
- **Límites [D]:** PDF, JPG, PNG o TXT; máximo 8 MB (4,5 MB en Vercel, con reducción de fotos en el navegador); 6 subidas por minuto y cliente; si el texto leído es demasiado corto, se avisa de que no se ha podido leer.
- Prototipo: citaciones sintéticas únicamente (`web/data/citaciones-sinteticas/`, 6 archivos en los 4 idiomas, uno fuera del catálogo).
- Aviso visible: la lectura automática puede equivocarse; no sustituye asesoramiento legal.

## 2c. Enlace de vinculación con el abogado [D la funcionalidad, P el diseño]
La persona puede enviar un enlace a su abogado/a. El abogado indica qué documentación hay que llevar, y esa lista aparece en la app de la persona, en los pasos del trámite.

```
Persona crea enlace ─► lo comparte ella misma (la app abre el menú de compartir del móvil o copia el enlace; la app no envía correos)
   ─► Abogado abre el enlace ─► añade documentos (nombre + nota)
   ─► La persona los ve marcados "Añadido por tu abogado/a" ─► aparecen en la lista de documentos
```
- **Alcance del enlace** [P]: solo permite **añadir y editar la lista de documentos** de ese trámite. El abogado **no ve** el perfil de adaptaciones (que puede revelar una neurodivergencia), ni la cuenta, ni otros trámites.
- **Solo texto:** se indica nombre y nota del documento a llevar; **no se suben archivos** (evita documentación clínica y de terceros) [P].
- **Seguridad del enlace** [D, implementado]: token largo y aleatorio, guardado como hash SHA-256; **vigente 48 horas desde su creación**, con varios usos dentro de ese plazo (el abogado puede volver y editar mientras esté vigente); revocable por la persona en cualquier momento; límite de peticiones (60 lecturas y 20 escrituras por minuto); sin datos personales en la URL.
- **Identidad del abogado** [D]: sin cuenta, pero **se identifica con su nombre y número de colegiado** antes de poder añadir documentos. Se guardan en el enlace y se muestran a la persona ("Añadido por Nombre Apellidos, colegiado nº …").
  - El nombre y el número de colegiado son **datos declarados**: la app no los verifica [D]. Hay que decirlo claramente en la app ("datos no comprobados").
  - Validación mínima de formato (obligatorios, solo números/letras razonables) y límites de peticiones [P].
  - El enlace sigue siendo secreto, con caducidad y revocable.
  - La app debe mostrar de forma visible quién ha añadido cada documento y que la persona puede borrarlo.
- **La persona no comparte nada directamente con el abogado** [D]: el enlace no incluye datos personales ni perfil; el abogado solo ve el trámite y el juzgado.
- La persona puede **aceptar, editar o borrar** cada documento añadido; los cambios nuevos del abogado se avisan en la app [P].
- Los documentos del abogado se muestran separados de los del catálogo base.
- Aviso: la lista del abogado prevalece sobre la lista genérica para ese caso. La herramienta no sustituye asesoramiento legal.
- **Sin notificaciones por correo** [D]. Los avisos son solo dentro de la app: al abrirla (o al volver a la pantalla de documentos) la app consulta si hay documentos nuevos y lo indica en pantalla. No se pide ni se guarda ningún correo.

## 2d. Idiomas: español, catalán, euskera y gallego [D]
- **Interfaz [D, implementado]:** sin biblioteca externa; un archivo TypeScript de textos por idioma (`web/src/i18n/es.ts`, `ca.ts`, `gl.ts`, `eu.ts`), con el español como referencia de claves. El idioma se elige en la primera pantalla y se puede cambiar en Ajustes. Se guarda en el dispositivo y en la cookie `bj_lang` para que el servidor ponga `<html lang>`.
- **Contenido [D, implementado]:** cada texto del catálogo JSON lleva un campo por idioma (`{ "es": …, "ca": …, "gl": …, "eu": … }`). Si falta una traducción, se muestra el español con un aviso, nunca una página vacía. Las traducciones ca/gl/eu son **borradores** pendientes de revisión.
- **Revisión:** cada traducción la revisa una persona con dominio del idioma y, para el contenido legal, el equipo de Derecho. No usar traducción automática sin revisar para texto legal.
- **Lectura simple en cada idioma:** las reglas de [UI/UX §8](04-UI-UX-Design.md#8-lenguaje-simple-d) se aplican en las cuatro, no solo en español.
- **OCR:** el motor debe tener modelos para español, catalán, euskera y gallego (por ejemplo, Tesseract los tiene) y detectar el idioma de la citación; las citaciones pueden ser bilingües [P]. Probar con ejemplos reales sintéticos en cada lengua.
- **Emparejado con el catálogo:** los `searchTerms` de cada trámite y los nombres de sede se guardan en los cuatro idiomas, para reconocer una citación aunque venga en catalán, euskera o gallego.
- **Buscador:** busca en el idioma elegido y también en los demás [P].
- **Pantalla del abogado:** en el idioma del enlace, que elige la persona al crearlo [P].
- Fechas y horas en formato local de cada idioma.

## 3. Fachada: foto fija ahora, Street View como opción futura
> **Actualización 2026-10-22 [D]:** el prototipo ya no usa Street View. Cada sede judicial lleva una **foto fija** de la fachada (de Wikimedia Commons, en `web/public/images/facades/`, con autoría y licencia en `courts.json`). No hace falta clave ni internet. Street View queda como opción futura; lo que sigue describe esa opción.

**¿Se puede hacer con Google Maps? Sí.** Para una sola imagen de la fachada, Google ofrece la **Street View Static API**: se le pide una imagen indicando el lugar, el tamaño, la orientación (heading), la inclinación (pitch) y el ángulo de visión (fov). No hace falta un panorama interactivo.
- **Recomendado [P]: Street View Static API** (una imagen fija por juzgado). Ventajas: encaja con "solo fachada", la persona no se pierde navegando por la calle, pesa poco y es más fácil de hacer accesible.
- **Alternativa [P]:** Maps Embed API en modo Street View (iframe). Es interactiva (la persona puede girar y moverse), así que no queda limitada a la fachada.
- **Precio (consultado en la página de precios de Google, a verificar en la oficial):** Static Street View incluye 10 000 peticiones gratuitas y después cobra por cada 1 000; Embed aparece como ilimitada y gratuita; la consulta de metadatos de Street View también es ilimitada. Para una demo, el uso queda muy por debajo del tope gratuito [?].
- **A comprobar en la documentación de Google antes de construir** [?]: si hace falta una cuenta de facturación aunque no se pague, términos de uso (no guardar ni descargar las imágenes de forma permanente, mantener visible la atribución "Google") y límites de la clave.
- **Cómo se elige la fachada:** el editor de contenido fija coordenadas (o dirección), `heading`, `pitch` y `fov`, y ve una vista previa hasta que se vea bien la puerta y la fachada. Se guardan esos valores, no la imagen [P].
- **Cobertura:** antes de mostrar, consultar los **metadatos** de Street View (indica si hay imagen y su fecha) para no mostrar una imagen vacía [P].
- La clave de API se restringe por dominio y por API; nunca se sube al repositorio. Si se llama desde el navegador, la clave queda visible: restringirla; o pedir la imagen desde el servidor y entregarla al navegador [P].
- Por juzgado se guarda: coordenadas, orientación, inclinación, ángulo de visión y una **descripción en texto** de la entrada (sentido de la vía, dónde parar, puerta de acceso). Esa información la redacta una persona; Street View no la da.
- **Accesibilidad:** Street View es visual. Cada vista debe tener una alternativa de texto equivalente (necesario para quien use lector de pantalla) y no ser el único modo de obtener la información.
- Imagen de Street View puede estar desactualizada: mostrar fecha de captura si está disponible y avisarlo [P].
- Alternativa si no hay cobertura o falla: foto aportada por el juzgado o solo texto [P].

## 4. Móvil
- Mobile-first, objetivos táctiles amplios, sin hover como único acceso.
- Sin PWA en el demo [P]. Carga rápida y ligera: las fotos por paso van en WebP recortadas a 3:2 (`web/public/images/realistic/`).
- Probar en pantallas pequeñas y en lector de pantalla del móvil (TalkBack, VoiceOver).

## 5. Seguridad y privacidad
- Datos sintéticos en el prototipo.
- **No se recoge documentación clínica.** El perfil guarda solo preferencias de adaptación. Es dato sensible: **no se envía al servidor** (se guarda en el dispositivo, ver 05) y el análisis RGPD queda aplazado [D].
- Autenticación y roles (ver 05-Backend-Schema).
- Asistente con ALIA-40B (opcional, ver §2f): solo con contenido revisado del catálogo, sin datos personales ni la citación [P].

## 6. Calidad
- Hecho: `npm run lint` y `npm run typecheck` sin errores; `npm run smoke` prueba la API de punta a punta (citaciones sintéticas, casos y enlace del abogado).
- Pendiente: auditoría con `web-design-guidelines`; pruebas end-to-end con `playwright-cli`; WCAG AA mínimo.

## 7. Preguntas abiertas
- [x] Motor del OCR: tesseract.js + unpdf en el servidor (implementado).
- [ ] Calidad del OCR con fotos reales de móvil y lectura de PDF escaneados (hoy no se leen).
- [ ] Base de datos externa si el enlace del abogado tiene que funcionar de forma fiable en Vercel.
- [ ] ¿Extracción de la citación solo por reglas o con apoyo de ALIA-40B?
- [ ] Enlace de 48 h: ¿se puede generar otro cuando caduca? ¿Cuántos enlaces activos por caso?
- [ ] Street View (opción futura): confirmar en la documentación de Google la cuenta de facturación, términos y atribución; elegir Static (recomendada) o Embed.
- [ ] ALIA-40B: ¿qué equipo lo ejecuta (opciones A–D de §2f)? ¿Qué papel exacto tiene (asistente, redacción, apoyo a la extracción)?
- [ ] ALIA-40B: versión exacta, licencia y origen del archivo cuantizado (ficha oficial de Hugging Face).
- [ ] Quién traduce y revisa el contenido en catalán, euskera y gallego; herramienta de gestión de traducciones.
- [ ] Cómo recuperar el caso si se pierden los datos del navegador (sin cuenta).
- [ ] Conexión del demo: Vercel o red propia; tener el hosting local preparado como plan B.
