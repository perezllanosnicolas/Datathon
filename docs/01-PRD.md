# 01 · PRD — Documento de requisitos de producto

> Leyenda: **[D]** decidido por el equipo · **[P]** propuesta (pendiente de acuerdo) · **[?]** pregunta abierta.
> Fuentes: descripción del equipo (2026-10-21, actualizada) y Google Doc de ideas.
> **Estado (2026-10-25):** proyecto **finalista** del Datathon. El núcleo está construido en el prototipo **SimuLex** («Visita virtual accesible al juzgado»; nombre provisional) en `web/`. Cómo arrancarlo: `README.md`. Detalle técnico: [TRD](02-TRD.md).

## 1. Problema
Las personas neurodivergentes (TEA, TDAH, dislexia, discalculia, disgrafía) encuentran barreras al acudir a un juzgado: entorno desconocido, estímulos sensoriales, pasos poco claros, lenguaje difícil. La brecha se reduce preparando a la persona y capacitando al personal. Enfoque **no capacitista**: la adaptación es una responsabilidad de la institución, no de la persona. [D]

## 2. Usuarios
- **Persona neurodivergente** que recibe una citación para un procedimiento **civil** y quiere saber qué le espera. Puede tener más de una necesidad (por ejemplo, TDAH y baja visión, o dislexia): la app debe poder usarse con lector de pantalla y combinar adaptaciones.
- **Abogado/a** de esa persona: acceso limitado por enlace, solo para indicar la documentación que hay que llevar.
- **Editor de contenido** (equipo): da de alta trámites y juzgados.
> Los casos de ejemplo del reto (Luis y Juan) se han retirado del proyecto por decisión del equipo.

## 3. Propuesta de valor [D]
Aplicación **web pensada para móvil** que se usa **antes** de ir al juzgado o instalación. Explica el trámite paso a paso, adaptada a la persona, e incluye cómo es el entorno de llegada.

## 4. Núcleo del sistema [D]
El producto se apoya en tres pilares:
1. **Cuestionario de adaptación**, sin registro: se usa directamente y las preferencias se guardan en el dispositivo.
2. **Adaptaciones** de la interfaz (idioma, tamaño de letra, filtros por neurodivergencia).
3. **Diagrama de flujo interactivo** del trámite.

## 5. Alcance

### Dentro (decidido) [D]
1. **Uso sin registro** [D] y **cuestionario de adaptación:** idioma; después, las adaptaciones (tamaño y tipo de letra, movimiento, color y contraste, leer en voz alta, dictado, tipo de imagen por paso) y, al final, «Más filtros» por neurodivergencia. Sin cuenta, las preferencias y el progreso se guardan en el dispositivo. Un registro opcional podría añadirse en el futuro [?].
2. **Selección de trámite y de juzgado, por dos vías:**
   - **Buscador** que filtra entre los casos posibles (trámite, tipo de proceso, juzgado).
   - **Subir la citación** (documento o foto), si no se quiere buscar: el documento se **pasa a texto** y de ese texto se **extrae el tipo de trámite y el juzgado**. La persona confirma lo detectado.
3. **Diagrama de flujo interactivo**, paso a paso, con: documentación y recursos necesarios al inicio; documentación y recursos que se obtienen al salir; pasos lo más granulares posible (ir a recepción, registrarse, esperar turno…).
4. **Imagen de la fachada** [D] dentro de los pasos de llegada: una **foto fija** de la sede judicial (Wikimedia Commons, con autoría y licencia), junto a un texto que dice cómo es la entrada al edificio, si la vía es de doble sentido, etc. Street View de Google Maps queda como opción futura (ver [TRD §3](02-TRD.md)).
   - **Barra de progreso** [D]: en cada paso indica cuántos pasos has hecho y cuántos te quedan ("Paso 3 de 12 · Te quedan 9").
5. **Enlace de vinculación con el abogado:** la persona envía un enlace a su abogado/a, que indica qué **documentación hay que llevar**; esa lista aparece en la app dentro del trámite.
6. **Formato:** web para dispositivos móviles (mobile-first).

### Restricciones [D]
- **Sin documentación clínica:** la herramienta no pide, almacena ni procesa informes clínicos ni diagnósticos. La persona solo indica sus adaptaciones.
- **Sin QR** en el producto (el QR de `npm run share` solo sirve para abrir el demo en el móvil).
- **Sin notificaciones por correo** [D]: los avisos son solo dentro de la app.
- **Hosting del demo** [D]: local (un portátil en la misma Wi-Fi) o, para la presentación, **Vercel** (provisional). Stack: Next.js 16 + TypeScript + SQLite (`node:sqlite`) + tesseract.js (ver [TRD](02-TRD.md)).
- **RGPD aplazado** [D]: la base legal y el aviso de privacidad se definen más adelante; la prioridad ahora es la implementación. Mientras tanto: sin cuentas, sin guardar la citación ni el perfil en el servidor, y solo datos sintéticos.
- **La citación no es documentación clínica**, pero sí contiene datos personales (nombre, número de procedimiento, hechos). Reglas propuestas [P]:
  - Se lee para identificar el trámite y juzgado; **ni el documento ni el texto extraído se guardan**.
  - Lo detectado se empareja con el catálogo de trámites revisados por Derecho; **no se generan pasos nuevos** a partir de la citación, y la persona confirma el resultado.
  - Si no se reconoce algo, se dice y se ofrece el buscador.
  - Prototipo: solo citaciones sintéticas.
- **Enlace del abogado** [P]:
  - El abogado solo añade una **lista de documentos a llevar** (nombre y nota); no sube archivos y **no ve** el perfil de adaptaciones ni la cuenta.
  - El abogado se identifica con **nombre y número de colegiado**, que quedan como **dato declarado, sin verificar** [D]; se muestra a la persona quién añadió cada documento.
  - **La persona no comparte nada directamente con el abogado** [D]: el abogado no ve su perfil, sus adaptaciones ni su cuenta. Solo escribe la lista de documentos.
  - El enlace es válido **48 horas** [D] y la persona puede revocarlo y borrar lo añadido.
- **Lectura de la citación (OCR) en nuestro servidor** [D]: el documento no se envía a terceros.
- Solo datos sintéticos en el prototipo.

### Anexo: futuro extra [D]
Escaneo 3D del juzgado y experiencia inmersiva realista (KIRI Engine, rol de escaneo, estímulos en el modelo). Ver [Anexo-3D-Escaneo.md](Anexo-3D-Escaneo.md). No forma parte del núcleo.

### Candidatas del Google Doc ya incluidas en el prototipo [P, provisional]
- Frases de protocolo para hablar con el personal.
- Estimación de tiempos («¿Cuánto dura?»).
- Técnicas de calma (respiración).
- Qué se espera de la persona en cada paso.
- Avisos de estímulos sensoriales por zona, escritos como texto en el paso.
- Pictogramas de ARASAAC y fotos por paso; glosario de «Palabras difíciles» (39 términos).
- Control de acceso: qué esperar (pasos de tipo «entrar»).
- A quién preguntar ante dudas; nota legal con la norma citada.
- Leer en voz alta y dictado por voz.

### Candidatas del Google Doc (sin decidir) [P]
- Qué puede pedir la persona (ajustes razonables), explicado con la norma.
- Guía en forma de muñeco.
- Asistente con ALIA-40B que responde con el catálogo (sin datos clínicos ni personales); ver arriba.
- Módulo de formación para profesionales de la justicia (el reto pide capacitarlos).

### Fuera de alcance [P]
- Gafas VR / auriculares.
- Procesos penal, mercantil y otros: ampliación futura. **El demo cubre el ámbito civil** [D].

### IA: ALIA-40B [D el modelo, P el uso]
La IA para hablar en los cuatro idiomas es **ALIA-40B**. Se propone como **apoyo opcional** (asistente que responde dudas sobre el trámite con contenido revisado, y ayuda a redactar y simplificar textos); el núcleo funciona sin ella. No da asesoramiento legal. Requiere un equipo con mucha memoria: ver [TRD §2f](02-TRD.md).

### Idiomas [D]
La app está disponible en **español, catalán, euskera y gallego**: interfaz, contenido de trámites y avisos. Esto afecta también a la lectura de la citación (OCR) y al buscador. Ver [TRD §2d](02-TRD.md).

### Referencias externas
- **Plena inclusión** (https://www.plenainclusion.org/): referente en lectura fácil y accesibilidad cognitiva. Se tiene en cuenta como referencia de contenido y de estilo (por ejemplo, https://www.plenainclusion.org/que-es-la-lectura-facil/ y el Centro Español de Accesibilidad Cognitiva, https://www.ceacog.es/). En la portada no aparecen procedimientos judiciales adaptados; falta revisar el Observatorio de jurisprudencia (https://www.plenainclusion.org/l/observatorio-jurisprudencia/) y preguntar a la entidad si tiene material de justicia en lectura fácil [?]. Antes de reutilizar sus textos, pedir permiso o citarlos según su licencia [V].

### Lenguaje simple [D]
Todo el texto de la app se escribe con el **lenguaje más sencillo posible**: palabras de uso diario, frases cortas, una idea por frase, sin tecnicismos jurídicos. Cuando un término legal es necesario (ej.: "citación", "personarse"), se explica en una frase al lado. Detalle y reglas en [UI/UX](04-UI-UX-Design.md#8-lenguaje-simple-d).

## 6. Requisitos no funcionales
- Principios de diseño de `CLAUDE.md` (accesibilidad cognitiva, baja carga sensorial, anticipación, lector de pantalla, control, tipografía legible).
- Mobile-first: la web actual del Poder Judicial no está adaptada al móvil.
- Aviso explícito: no sustituye asesoramiento legal.
- Privacidad: el perfil de adaptaciones es dato sensible; mínimo necesario, consentimiento y borrado [V].

## 7. Marco legal [V]
Art. 24 CE, Ley 15/2022, RDL 1/2013. El Google Doc cita la Ley 8/2021: confirmar relevancia y contenido.

## 8. Métricas de éxito [P]
Familiaridad percibida antes/después, tiempo hasta completar el trámite sin ayuda, número de ajustes usados. Dato de contexto [D]: estimación del equipo de **entre 150.000 y 300.000 personas neurodivergentes que acuden a un juzgado al año en España**. Es una estimación, no un dato oficial: en la presentación decirlo así y explicar cómo se calcula [V].

## 9. Preguntas abiertas
- [ ] El demo es civil [D]: falta que el equipo confirme el trámite y la sede. Provisional: el caso de la casa heredada (división de la cosa común; la persona, con TEA, es la demandada; juicio verbal), más un juicio verbal y un trámite de testigo de ejemplo; sedes de Madrid (Capitán Haya 66) y Ciudad de la Justicia de Barcelona. Pendiente de revisión por Derecho.
- [ ] ¿Qué se extrae de la citación además de trámite, juzgado, fecha y hora (que ya se extraen)? Por ejemplo, el papel de la persona.
- [ ] **Aplazado:** base legal y aviso de privacidad (RGPD) para leer la citación y para el enlace del abogado. Retomar tras la implementación.
- [ ] ¿Qué catálogo de trámites y juzgados cubre el demo? Solo se reconoce lo que está en el catálogo.
- [ ] ¿Qué hace exactamente ALIA-40B en el demo y en qué equipo se ejecuta? (necesita mucha memoria)
- [ ] ¿Quién traduce y revisa los contenidos en catalán, euskera y gallego?
- [ ] ¿Hay material de Plena inclusión (o similar) sobre justicia en lectura fácil que podamos usar?
- [ ] ¿Qué adaptaciones necesita cada neurodivergencia? (validar con Cristina y asociaciones)
- [ ] ¿Quién redacta y revisa el contenido de trámites y de entradas (descripción de la vía, acceso)?
- [ ] Análisis de necesidades, viabilidad y costes (vacíos en el Doc).
