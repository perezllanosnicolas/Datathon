# 01 · PRD — Documento de requisitos de producto

> Leyenda: **[D]** decidido por el equipo · **[P]** propuesta (pendiente de acuerdo) · **[?]** pregunta abierta · **[V]** a validar por Leyre/Carlos.
> Fuentes: descripción del equipo (2026-10-21) y Google Doc de ideas.

## 1. Problema
Las personas neurodivergentes (TEA, TDAH, dislexia, discalculia, disgrafía) encuentran barreras al acudir a un juzgado: lugar desconocido, estímulos sensoriales, pasos poco claros, lenguaje difícil. La brecha se reduce preparando a la persona y capacitando al personal. Enfoque **no capacitista**: la adaptación es una responsabilidad de la institución, no de la persona. [D]

## 2. Personas de referencia (Reto 3)
- **Luis:** TEA nivel 1, testigo en un procedimiento penal.
- **Juan:** TDAH + ceguera, acusado de estafa leve (art. 249 CP). Requiere compatibilidad con lector de pantalla.

## 3. Propuesta de valor [D]
Herramienta web que se usa **antes** de ir al juzgado o instalación. Explica el trámite paso a paso y, si el juzgado está escaneado, permite recorrerlo en 3D para familiarizarse.

## 4. Alcance
### Dentro (decidido) [D]
1. **Registro con cuestionario de adaptación:** idioma, tamaño de letra; después, filtros extra por neurodivergencia (buscables).
2. **Selección de trámite y de juzgado.**
3. **Diagrama de flujo interactivo**, paso a paso, con: documentación y recursos necesarios al inicio; documentación y recursos que se obtienen al salir; pasos lo más granulares posible (ir a recepción, registrarse, esperar turno…).
4. **Vista inmersiva 3D por paso** si el juzgado está escaneado.
5. **Rol de escaneo (encargado del juzgado):** sube vídeo → modelo 3D; indica la función y los procesos de cada sala; registra salas con **estímulos estridentes** (ej.: altavoz en una esquina de la entrada que emite avisos).

### Candidatas del Google Doc (sin decidir) [P]
- Frases de protocolo para hablar con el personal.
- Estimación de tiempos.
- Técnicas de calma (respiración).
- Qué puede ocurrir y qué se te pedirá.
- Avisos de sobreestimulación en el recorrido y en el 3D.
- Pictogramas / lectura fácil.
- Control de acceso: qué esperar.
- A quién preguntar ante dudas; qué puede pedir la persona (ajustes razonables).
- Acceso por código QR.
- Guía en forma de muñeco.
- Chatbot con RAG ligado al recorrido y a la persona acompañante.
- Ruta a una sala (paso a paso o vídeo automático).
- Módulo de formación para profesionales de la justicia (el reto pide capacitarlos).

### Fuera de alcance por ahora [P]
- Gafas VR / auriculares (resistencia por perfil sin estudiar) [?].
- Datos reales de expedientes o informes clínicos (**solo datos sintéticos**).
- Procesos penal y mercantil: escalado futuro. El Google Doc se centra en civil; el reto cita penal (Luis) y penal (Juan). [?] Elegir el proceso del demo.

## 5. Requisitos no funcionales
- Principios de diseño de `CLAUDE.md` (accesibilidad cognitiva, baja carga sensorial, anticipación, lector de pantalla, control, tipografía legible).
- Web responsive: la web actual del Poder Judicial no lo es.
- Aviso explícito: no sustituye asesoramiento legal.
- Privacidad: separar qué datos ve cada rol; definir qué puede leer la IA.

## 6. Marco legal [V]
Art. 24 CE, Ley 15/2022, RDL 1/2013. El Google Doc cita la Ley 8/2021: confirmar relevancia y contenido.

## 7. Métricas de éxito [P]
Familiaridad percibida antes/después, tiempo hasta completar el trámite sin ayuda, número de ajustes solicitados. Dato de contexto del Doc: entre 150.000 y 300.000 personas neurodivergentes podrían interactuar cada año con la justicia en España (fuente por confirmar) [V].

## 8. Preguntas abiertas
- [?] ¿Qué adaptaciones necesita cada neurodivergencia en la experiencia 3D?
- [?] ¿Preguntar dentro de la experiencia resulta violento?
- [?] ¿Qué trámites y qué juzgado cubre el demo?
- [?] ¿Quién puede ser "encargado de escaneo" y cómo se verifica?
- [?] Análisis de necesidades, viabilidad y costes (vacíos en el Doc).
