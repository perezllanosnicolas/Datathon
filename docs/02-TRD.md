# 02 · TRD — Documento de requisitos técnicos

> Leyenda: **[D]** decidido · **[P]** propuesta · **[?]** abierto.

## 1. Decisiones técnicas tomadas
- **[D]** Aplicación **web mobile-first**.
- **[D]** Vista **solo de la fachada** del juzgado con **Street View de Google Maps** (una imagen fija, sin recorrer la calle).
- **[D]** IA para hablar en español, catalán, gallego y euskera: **ALIA-40B** (ver §2f).
- **[D]** Sin documentación clínica ni QR.
- **[D]** El 3D / KIRI Engine pasa a anexo (ver [Anexo-3D-Escaneo.md](Anexo-3D-Escaneo.md)).

## 2. Arquitectura propuesta [P]
```
Navegador móvil (web responsive, accesible, sin registro)
   ├─ Cuestionario + ajustes (guardados en el dispositivo)
   ├─ Selector trámite / juzgado
   └─ Flujo interactivo de pasos (+ imagen de la fachada)
          │
      API backend ── Base de datos (SQLite)
          │            ├─ OCR (Tesseract)
          │            └─ ALIA-40B (asistente, opcional) ── servidor de inferencia local
          │
      Google Maps (imagen Street View de la fachada) ── necesita internet
```
- **Frontend [P]:** React/Next.js + TypeScript, HTML semántico, diseño mobile-first.
- **Backend [P]:** API REST + base de datos relacional (SQLite en la demo). Contenido de trámites y juzgados como datos (no incrustado en código).
- **Diagrama de flujo [P]:** componente propio accesible (lista ordenada de pasos con navegación), no un lienzo de arrastrar: funciona con teclado y lector de pantalla. Representación visual como mapa de progreso encima de esa lista.
- **Stack de la demo** [D por delegación del equipo; fácil de cambiar]: Next.js (React) + TypeScript; SQLite como base de datos (un solo archivo, sin instalar un servidor de base de datos); biblioteca i18n para los cuatro idiomas; Tesseract para el OCR en el mismo equipo.
- **Hosting de la demo: local** [D]. Todo se ejecuta en un portátil o equipo del equipo; ver §2e.

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

## 2e. Hosting local para la demo [D]
- **Una sola máquina** con la web, la API, la base de datos y el OCR. Arranque con un comando (o `docker compose`) y datos de ejemplo precargados (semilla) [P].
- **Acceso desde el móvil:** el móvil y el equipo van en la **misma red Wi-Fi** y se abre la dirección IP local del equipo. Preparar una red propia (punto de acceso del móvil o router) para no depender de la red del lugar de la demo [P].
- **Enlace del abogado:** con servidor local, el enlace solo funciona dentro de esa red. Para la demo, el "abogado" se simula con un segundo dispositivo en la misma red. Si se quisiera abrir desde fuera, haría falta un túnel temporal [?]; no es necesario para el demo.
- **HTTPS:** en red local suele usarse HTTP. No hay PWA ni funciones que exijan HTTPS (la cámara se usa con el selector de archivos del móvil, que acepta HTTP) [P]. Si se activa HTTPS local, hay que instalar el certificado en el móvil [?].
- **La imagen de la fachada necesita internet** (Google Maps) y una clave de API. Plan B sin conexión: foto aportada por el juzgado + texto de la entrada [P].
- **ALIA-40B exige un equipo con mucha memoria** (ver §2f): decidir si va en el mismo equipo o en otro de la misma red.
- **Copia de seguridad:** repositorio con la semilla; probar el demo desde cero en otro equipo antes de la presentación [P].
- Si más adelante se publica en un servidor, se revisa HTTPS, copias, logs y el análisis RGPD (aplazado).

## 2b. Selección de trámite: buscador o citación [D la funcionalidad, P el diseño]

### Buscador
- Búsqueda con filtros (tipo de proceso, trámite, juzgado) sobre el catálogo de la base de datos. Texto tolerante a errores y sinónimos (ej.: "juicio", "declarar", "testigo") [P].
- Es la vía principal y el respaldo siempre disponible.

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
- **Paso 1 (a texto):** PDF con texto, extraer directamente; foto o PDF escaneado, OCR. **El OCR se ejecuta en el servidor propio donde se aloja el servicio** [D]: no en el navegador y no en un servicio de terceros. Motor de código abierto instalable en ese servidor (ej.: Tesseract con el idioma español) [P]. Comparar calidad con fotos de móvil y, si hace falta, preprocesar la imagen (enderezar, contraste). Dimensionar el servidor: el OCR consume CPU y la subida llega por red móvil [P].
- **Paso 2 (extraer):** buscar en el texto el órgano judicial (nombre y localidad), el tipo de procedimiento y, si aparece, fecha y hora. Primera aproximación **sin modelo generativo**: expresiones regulares y palabras clave contra el catálogo (los términos de `procedure_search_terms` y los nombres de juzgado) [P]. Un modelo de lenguaje solo como apoyo y si el equipo lo decide [?].
- **Paso 3 (emparejar):** el resultado siempre es una entrada del catálogo (revisado por Derecho). **Nunca se generan pasos nuevos a partir del texto** [P].
- Si no se reconoce el trámite, el juzgado o ambos: se dice qué falta y se ofrece el buscador, con lo detectado ya relleno.
- El documento **se procesa y se descarta**; el texto extraído no se guarda [P].
- **Datos personales:** la citación contiene nombre y número de procedimiento. Al hacerse el OCR en nuestro servidor, el documento no sale a terceros [D]. Aun así: conexión cifrada (HTTPS) en la subida, archivo en memoria o disco temporal que se borra al terminar (también si falla), sin registros (logs) con el contenido del texto [P]. La base legal y el aviso de privacidad (RGPD) se definen con Leyre y Carlos **más adelante** [D]; de momento prima la implementación y el demo usa solo citaciones sintéticas.
- Límites del archivo: tipos permitidos (PDF, JPG, PNG), tamaño máximo, validación; aviso si la foto está borrosa o cortada [P].
- Prototipo: citaciones sintéticas únicamente.
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
- **Seguridad del enlace** [P]: token largo y aleatorio, guardado como hash; **vigente 48 horas desde su creación** [D], con varios usos dentro de ese plazo (el abogado puede volver y editar mientras esté vigente); revocable por la persona en cualquier momento; límite de intentos; sin datos personales en la URL.
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
- **Interfaz:** biblioteca de internacionalización (i18n) con un archivo de textos por idioma (`es`, `ca`, `eu`, `gl`). El idioma se elige en la primera pantalla y se puede cambiar en Ajustes [P].
- **Contenido** (trámites, pasos, documentos, descripción de entradas, avisos): cada texto se guarda en los cuatro idiomas (tabla de traducciones o campos por idioma). Si falta una traducción, mostrar el español con un aviso claro, nunca una página vacía [P].
- **Revisión:** cada traducción la revisa una persona con dominio del idioma y, para el contenido legal, el equipo de Derecho. No usar traducción automática sin revisar para texto legal.
- **Lectura simple en cada idioma:** las reglas de [UI/UX §8](04-UI-UX-Design.md#8-lenguaje-simple-d) se aplican en las cuatro, no solo en español.
- **OCR:** el motor debe tener modelos para español, catalán, euskera y gallego (por ejemplo, Tesseract los tiene) y detectar el idioma de la citación; las citaciones pueden ser bilingües [P]. Probar con ejemplos reales sintéticos en cada lengua.
- **Emparejado con el catálogo:** los términos de `procedure_search_terms` y los nombres de juzgado se guardan en los cuatro idiomas, para reconocer una citación aunque venga en catalán, euskera o gallego.
- **Buscador:** busca en el idioma elegido y también en los demás [P].
- **Pantalla del abogado:** en el idioma del enlace, que elige la persona al crearlo [P].
- Fechas y horas en formato local de cada idioma.

## 3. Fachada con Street View de Google Maps [D: solo fachada]
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
- Sin PWA en el demo (exige HTTPS y el hosting es local) [P]. Carga rápida y ligera.
- Probar en pantallas pequeñas y en lector de pantalla del móvil (TalkBack, VoiceOver).

## 5. Seguridad y privacidad
- Datos sintéticos en el prototipo.
- **No se recoge documentación clínica.** El perfil guarda solo preferencias de adaptación. Es dato sensible: **no se envía al servidor** (se guarda en el dispositivo, ver 05) y el análisis RGPD queda aplazado [D].
- Autenticación y roles (ver 05-Backend-Schema).
- Asistente con ALIA-40B (opcional, ver §2f): solo con contenido revisado del catálogo, sin datos personales ni la citación [P].

## 6. Calidad
- Auditoría con `web-design-guidelines`; pruebas end-to-end con `playwright-cli`; WCAG AA mínimo.

## 7. Preguntas abiertas
- [ ] OCR en el servidor propio: motor concreto, calidad con fotos de móvil y recursos del servidor.
- [ ] ¿Extracción de la citación solo por reglas o con apoyo de ALIA-40B?
- [ ] Enlace de 48 h: ¿se puede generar otro cuando caduca? ¿Cuántos enlaces activos por caso?
- [ ] Street View de fachada: confirmar en la documentación de Google la cuenta de facturación, términos y atribución; elegir Static (recomendada) o Embed.
- [ ] ALIA-40B: ¿qué equipo lo ejecuta (opciones A–D de §2f)? ¿Qué papel exacto tiene (asistente, redacción, apoyo a la extracción)?
- [ ] ALIA-40B: versión exacta, licencia y origen del archivo cuantizado (ficha oficial de Hugging Face).
- [ ] Quién traduce y revisa el contenido en catalán, euskera y gallego; herramienta de gestión de traducciones.
- [ ] Cómo recuperar el caso si se pierden los datos del navegador (sin cuenta).
- [ ] Conexión del demo: red propia, y plan B de Street View sin internet.
