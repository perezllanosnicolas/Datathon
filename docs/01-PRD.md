# 01 · PRD — Documento de requisitos de producto

> Leyenda: **[D]** decidido por el equipo · **[P]** propuesta (pendiente de acuerdo) · **[?]** pregunta abierta · **[V]** a validar por Leyre/Carlos.
> Fuentes: descripción del equipo (2026-10-21, actualizada) y Google Doc de ideas.

## 1. Problema
Las personas neurodivergentes (TEA, TDAH, dislexia, discalculia, disgrafía) encuentran barreras al acudir a un juzgado: entorno desconocido, estímulos sensoriales, pasos poco claros, lenguaje difícil. La brecha se reduce preparando a la persona y capacitando al personal. Enfoque **no capacitista**: la adaptación es una responsabilidad de la institución, no de la persona. [D]

## 2. Personas de referencia (Reto 3)
- **Luis:** TEA nivel 1, testigo en un procedimiento penal.
- **Juan:** TDAH + ceguera, acusado de estafa leve (art. 249 CP). Requiere compatibilidad con lector de pantalla.

## 3. Propuesta de valor [D]
Aplicación **web pensada para móvil** que se usa **antes** de ir al juzgado o instalación. Explica el trámite paso a paso, adaptada a la persona, e incluye cómo es el entorno de llegada.

## 4. Núcleo del sistema [D]
El producto se apoya en tres pilares:
1. **Registro** con cuestionario de adaptación.
2. **Adaptaciones** de la interfaz (idioma, tamaño de letra, filtros por neurodivergencia).
3. **Diagrama de flujo interactivo** del trámite.

## 5. Alcance

### Dentro (decidido) [D]
1. **Registro y cuestionario:** idioma y tamaño de letra; después, filtros extra buscables por neurodivergencia.
2. **Selección de trámite y de juzgado, por dos vías:**
   - **Buscador** que filtra entre los casos posibles (trámite, tipo de proceso, juzgado).
   - **Subir la citación:** un sistema con **IA** lee el documento e identifica los pasos que hay que realizar en el trámite.
3. **Diagrama de flujo interactivo**, paso a paso, con: documentación y recursos necesarios al inicio; documentación y recursos que se obtienen al salir; pasos lo más granulares posible (ir a recepción, registrarse, esperar turno…).
4. **Vista de la entrada con Street View de Google Maps** dentro de los pasos de llegada: cómo es la entrada al edificio, si la vía es de doble sentido, etc.
5. **Formato:** web para dispositivos móviles (mobile-first).

### Restricciones [D]
- **Sin documentación clínica:** la herramienta no pide, almacena ni procesa informes clínicos ni diagnósticos. La persona solo indica sus adaptaciones.
- **Sin QR.**
- **La citación no es documentación clínica**, pero sí contiene datos personales (nombre, número de procedimiento, hechos). Reglas propuestas [P, a validar por Leyre/Carlos]:
  - Se lee para identificar el trámite y **no se guarda** el documento; se guardan solo los campos necesarios, y solo si la persona lo acepta.
  - La IA **no inventa pasos**: clasifica la citación dentro del catálogo de trámites ya revisados por Derecho, y la persona confirma el resultado.
  - Si la IA no está segura, lo dice y ofrece el buscador.
  - Prototipo: solo citaciones sintéticas.
- Solo datos sintéticos en el prototipo.

### Anexo: futuro extra [D]
Escaneo 3D del juzgado y experiencia inmersiva realista (KIRI Engine, rol de escaneo, estímulos en el modelo). Ver [Anexo-3D-Escaneo.md](Anexo-3D-Escaneo.md). No forma parte del núcleo.

### Candidatas del Google Doc (sin decidir) [P]
- Frases de protocolo para hablar con el personal.
- Estimación de tiempos.
- Técnicas de calma (respiración).
- Qué puede ocurrir y qué se te pedirá.
- Avisos de estímulos sensoriales por zona, escritos como texto en el paso (ej.: altavoz de avisos en la entrada).
- Pictogramas / lectura fácil.
- Control de acceso: qué esperar.
- A quién preguntar ante dudas; qué puede pedir la persona (ajustes razonables).
- Guía en forma de muñeco.
- Chatbot con RAG (sin datos clínicos).
- Módulo de formación para profesionales de la justicia (el reto pide capacitarlos).

### Fuera de alcance [P]
- Gafas VR / auriculares.
- Procesos penal y mercantil como ampliación. El Google Doc se centra en civil; Luis y Juan son casos penales. [?] Elegir el proceso del demo.

## 6. Requisitos no funcionales
- Principios de diseño de `CLAUDE.md` (accesibilidad cognitiva, baja carga sensorial, anticipación, lector de pantalla, control, tipografía legible).
- Mobile-first: la web actual del Poder Judicial no está adaptada al móvil.
- Aviso explícito: no sustituye asesoramiento legal.
- Privacidad: el perfil de adaptaciones es dato sensible; mínimo necesario, consentimiento y borrado [V].

## 7. Marco legal [V]
Art. 24 CE, Ley 15/2022, RDL 1/2013. El Google Doc cita la Ley 8/2021: confirmar relevancia y contenido.

## 8. Métricas de éxito [P]
Familiaridad percibida antes/después, tiempo hasta completar el trámite sin ayuda, número de ajustes usados. Dato de contexto del Doc: entre 150.000 y 300.000 personas neurodivergentes podrían interactuar cada año con la justicia en España (fuente por confirmar) [V].

## 9. Preguntas abiertas
- [ ] ¿Qué trámite y qué juzgado cubre el demo?
- [ ] ¿Qué datos extrae la IA de la citación (órgano, tipo de proceso, fecha, condición de la persona: testigo, parte, acusado…)?
- [ ] ¿Qué proveedor de IA se usa y dónde se procesa el documento (RGPD, datos personales)?
- [ ] ¿Qué catálogo de trámites cubre el demo? La IA solo reconoce lo que está en el catálogo.
- [ ] ¿Qué adaptaciones necesita cada neurodivergencia? (validar con Cristina y asociaciones)
- [ ] ¿Quién redacta y revisa el contenido de trámites y de entradas (descripción de la vía, acceso)?
- [ ] Análisis de necesidades, viabilidad y costes (vacíos en el Doc).
