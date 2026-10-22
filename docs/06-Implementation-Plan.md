# 06 · Implementation Plan — Secuencia de construcción

> Plan **propuesto [P]**. Trabajar en ramas por funcionalidad; no tocar `main` sin acuerdo. Usar `/sincronizar` para guardar, hacer commit, subir a GitHub y actualizar la documentación.
> Núcleo: adaptaciones y diagrama de flujo con barra de progreso, **sin registro**. El 3D es un anexo futuro.
> Prioridad actual: **implementar**. El análisis RGPD queda aplazado [D]. Demo con **hosting local** [D].

## Estado (2026-10-21)
Prototipo de las Fases 2–7 construido en la rama `feat/demo-core` (ver `README.md`). Está probado con `npm run smoke` (API, enlace del abogado y 5 citaciones sintéticas en 4 idiomas) y con un recorrido en navegador móvil (cuestionario → buscador → flujo → resumen; OCR de una foto; abogado desde un segundo dispositivo).
**Pendiente:**
- Fase 0: el equipo elige el trámite y el juzgado. Los de ahora son de ejemplo.
- Fase 1: revisión legal del contenido y revisión de las traducciones ca/gl/eu.
- Fase 5: clave de Google y elegir la orientación (`heading`) de cada fachada.
- Fase 6: probar con fotos reales de móvil y con PDF escaneados (hoy un PDF sin texto no se lee).
- Fases 8–10.

## 1. Visión general

### Qué se construye, en orden
| Fase | Qué | Depende de | Núcleo del demo |
|---|---|---|---|
| 0 | Acuerdos y comprobaciones previas | — | Sí |
| 1 | Contenido y datos de ejemplo | 0 | Sí |
| 2 | Esqueleto del proyecto, datos y arranque local | 0 | Sí |
| 3 | Adaptaciones (cuestionario y ajustes) | 2 | Sí |
| 4 | Buscador + flujo de pasos + barra de progreso | 1, 2, 3 | Sí |
| 5 | Fachada con Street View | 2, 4 | Sí |
| 6 | Citación: imagen → texto → trámite y juzgado | 1, 2, 4 | Sí |
| 7 | Enlace del abogado | 2, 4 | Sí |
| 8 | Asistente con ALIA-40B | 1, 2, 4 | **Extra** |
| 9 | Apoyos (frases, respiración, pictogramas) | 4 | Extra |
| 10 | Calidad y entrega | todas | Sí |

### Mínimo para el demo (corte)
1. Un trámite civil completo y un juzgado de ejemplo, en los cuatro idiomas (Fases 1–4).
2. Cuestionario de adaptación que cambia la interfaz.
3. Flujo paso a paso con barra de progreso.
4. Fachada del juzgado en los pasos de llegada.
5. Subida de citación sintética que detecta trámite y juzgado.
6. Enlace del abogado que añade un documento.

**Si falta tiempo, se recorta en este orden:** Fase 9 → Fase 8 (ALIA) → enlace del abogado (Fase 7) → citación (Fase 6, dejando solo el buscador). El buscador, el flujo y la barra de progreso no se recortan.

### Qué se puede hacer en paralelo
- Contenido (Fase 1: Leyre, Carlos, Cristina) y esqueleto (Fase 2: Nicolás, Dani) arrancan a la vez.
- Prueba de hardware de ALIA-40B (Fase 0) en paralelo a todo, porque decide si la Fase 8 es posible.
- Traducciones a catalán, euskera y gallego en cuanto el texto en español esté revisado.

## 2. Equipo y reparto sugerido [P]
| Área | Quién |
|---|---|
| Contenido jurídico de trámites y revisión legal | Leyre, Carlos |
| Criterios de adaptación y criminología; comprensión de los textos | Cristina |
| IA (ALIA-40B), OCR y extracción de la citación | Marianela |
| Integración, despliegue local y Street View | Nicolás |
| Frontend, producto y costes | Dani, Cristina |
| Traducciones ca / eu / gl | Por decidir [?] |

## Fase 0 — Acuerdos y comprobaciones (actual)
- Alcance del demo [D]: ámbito **civil**. Falta elegir el trámite civil concreto y un juzgado de ejemplo [?].
- Stack y hosting: decididos (ver TRD).
- **Probar ALIA-40B:** qué equipo tiene memoria suficiente (ver [TRD §2f](02-TRD.md)), probar con una consulta real y decidir si se ejecuta en el mismo equipo o en otro de la red [?].
- **Street View (fachada):** crear la clave de API de Google, comprobar si exige cuenta de facturación y leer los términos de uso y de atribución [?].
- Revisar el material de Plena inclusión (lectura fácil, Observatorio de jurisprudencia) y contactar con ellos si procede [?].
- Decidir quién traduce y revisa el catalán, euskera y gallego.
- **Hecho cuando:** las decisiones están en CLAUDE.md y se sabe si ALIA-40B puede ejecutarse en el demo.

## Fase 1 — Contenido y datos sintéticos
- Redactar un trámite civil completo, paso a paso, con documentos (llevar/recibir) y avisos sensoriales.
- Un juzgado de ejemplo con su fachada: coordenadas, orientación, sentido de la vía, acceso y descripción en texto.
- 3–5 citaciones sintéticas (en varios idiomas) para la Fase 6.
- Traducir el trámite a los otros tres idiomas y revisarlo.
- **Hecho cuando:** un trámite y un juzgado están revisados, traducidos y listos para cargarse.

> **Transversal, cuatro idiomas [D]:** cada pantalla y cada contenido se entrega en español, catalán, euskera y gallego (ver [TRD §2d](02-TRD.md)). Para el demo, mínimo: interfaz completa en los cuatro idiomas y un trámite traducido y revisado en cada uno.

> **Transversal, lenguaje simple [D]:** todos los textos de cada fase siguen las reglas de [UI/UX §8](04-UI-UX-Design.md#8-lenguaje-simple-d) y los revisa Cristina (comprensión).

## Fase 2 — Esqueleto y datos (hosting local)
- Proyecto base mobile-first con el stack del TRD (Next.js + TypeScript + SQLite), base de datos con datos de ejemplo (semilla), i18n con los cuatro idiomas.
- Arranque con un comando en una sola máquina; acceso desde el móvil por la red local ([TRD §2e](02-TRD.md)).
- Caso anónimo con secreto del dispositivo (sin cuentas).
- README con cómo arrancar.
- **Hecho cuando:** otro miembro del equipo arranca el proyecto desde cero en su equipo y lo abre desde el móvil.

## Fase 3 — Adaptaciones
- Cuestionario de adaptación (sin registro; se guarda en el dispositivo) y ajustes (idioma, tamaño de letra, filtros por neurodivergencia, modos de movimiento y color).
- **Hecho cuando:** los ajustes cambian la interfaz, persisten y se conservan al recargar.

## Fase 4 — Buscador, flujo y barra de progreso
- **Buscador** de trámite y juzgado con filtros (vía principal).
- Flujo paso a paso con documentos de entrada y salida, duración y avisos sensoriales.
- **Barra de progreso** accesible ("Paso X de N · Te quedan M"), por fases, guardada en el dispositivo.
- Resumen final.
- **Hecho cuando:** una persona recorre el flujo completo en móvil, y otra lo hace con lector de pantalla, en los cuatro idiomas.

## Fase 5 — Fachada con Street View
> **Actualización 2026-10-22 [D]:** el prototipo ya no usa Street View. Cada sede judicial lleva una **foto fija** de la fachada (de Wikimedia Commons, en `web/public/images/facades/`, con autoría y licencia en `courts.json`). No hace falta clave ni internet. Street View queda como opción futura; lo que sigue describe esa opción.

- Integrar la imagen fija de la fachada (Street View Static API) en los pasos de llegada, con alternativa de texto, atribución y fecha ([TRD §3](02-TRD.md)).
- Comprobar cobertura con los metadatos; plan B con foto o solo texto.
- Vista previa para elegir orientación en el panel del editor.
- Clave de API restringida y fuera del repositorio.
- **Hecho cuando:** los pasos de llegada muestran la fachada y su descripción, y sin internet se ve la alternativa.

## Fase 6 — Citación: de imagen a texto y a trámite/juzgado
- Antes: instalar el motor OCR en el equipo del demo y comprobar su velocidad (el análisis RGPD queda aplazado).
- Subida (PDF/foto) → texto (OCR) → extracción de trámite y juzgado con reglas y palabras clave contra el catálogo → pantalla de confirmación.
- Caída al buscador si no se reconoce algo, con lo detectado ya relleno.
- Evaluación: medir aciertos sobre las citaciones sintéticas y casos límite (borrosa, cortada, trámite fuera del catálogo, otro idioma).
- **Hecho cuando:** al subir una citación sintética se detectan el trámite y el juzgado correctos, la persona los confirma y se abre su flujo; y si falla, el buscador sigue funcionando.
- Responsable sugerido: Marianela, con revisión de Derecho del catálogo.

## Fase 7 — Enlace del abogado
- Crear, compartir y revocar enlace; válido 48 horas; endpoints limitados al caso.
- Pantalla del abogado para añadir documentos, con nombre y número de colegiado obligatorios.
- En la app: documentos marcados "Añadido por tu abogado/a" con aceptar / editar / borrar; aviso de novedades al abrir la app (sin correo).
- Pruebas de seguridad: enlace caducado, revocado, adivinación del token, acceso a otros casos, abuso por exceso de peticiones.
- **Hecho cuando:** un enlace de prueba permite a un "abogado" (segundo dispositivo) añadir un documento que aparece en el flujo de la persona, y que el abogado no puede ver nada más.
- Revisión de Leyre/Carlos sobre confidencialidad.

## Fase 8 — Asistente con ALIA-40B (extra)
- Solo si la Fase 0 confirma que se puede ejecutar en un equipo disponible.
- Servidor de inferencia local con ALIA-40B cuantizado (llama.cpp / Ollama / vLLM) y una API interna del asistente.
- Búsqueda en el catálogo revisado (RAG) y respuestas en lenguaje simple, en el idioma de la persona; sin datos personales.
- Aviso "No es asesoramiento legal"; si no sabe, remite al personal del juzgado o al abogado.
- Evaluar con 20–30 preguntas sintéticas por idioma: acierto, tiempo de respuesta y revisión por hablantes nativos y Derecho.
- Si la IA tarda o falla, el botón se oculta y el paso se ve igual.
- **Hecho cuando:** el asistente responde bien, en los cuatro idiomas, preguntas sobre el trámite del demo en un tiempo aceptable, o se decide dejarlo como línea futura con un vídeo grabado.
- Responsable sugerido: Marianela.

## Fase 9 — Apoyos (según tiempo)
- Frases de protocolo, respiración, pictogramas, estimaciones de tiempo.

## Fase 10 — Calidad y entrega
- Auditoría de accesibilidad (`web-design-guidelines`) y pruebas con `playwright-cli` en viewport móvil.
- Revisión de seguridad; aviso de no sustituir asesoramiento legal.
- Ensayo del demo **desde cero en otro equipo**, con la red propia y sin internet (plan B).
- Guion del demo y vídeo de respaldo.
- Presentación: un mensaje por diapositiva; problema → persona (un caso civil inventado, con datos sintéticos) → solución → demo → impacto → siguientes pasos (incluye el anexo 3D como visión).
- **Hecho cuando:** demo estable y presentación ensayada.

## 3. Primeros pasos inmediatos
1. Elegir el trámite civil y el juzgado de ejemplo (decisión del equipo).
2. Nicolás: comprobar qué equipo puede ejecutar ALIA-40B y crear la clave de Google Maps.
3. Leyre y Carlos: empezar a redactar el trámite (Fase 1).
4. Dani y Nicolás: crear el esqueleto del proyecto (Fase 2) en una rama `feat/skeleton`.
5. Decidir quién traduce y revisa el catalán, euskera y gallego.

## 4. Riesgos [P]
| Riesgo | Mitigación |
|---|---|
| ALIA-40B no cabe en el equipo del demo (necesita decenas de GB de memoria) | Probar pronto; usar un segundo equipo potente en la misma red; modelo más pequeño de la familia como plan B; el asistente es un extra y el núcleo no depende de él |
| ALIA-40B lento o con respuestas incorrectas en idioma o en derecho | Responder solo con el catálogo revisado; aviso de que puede equivocarse; contenido escrito de respaldo; vídeo grabado |
| Cuotas, coste o términos de Street View | Imagen fija de fachada (Static API); el uso del demo queda muy por debajo del tope gratuito; plan B con foto o texto |
| Street View desactualizado o sin cobertura | Comprobar metadatos, mostrar fecha y descripción en texto |
| Contenido legal incorrecto | Revisión de Leyre/Carlos y cita de norma |
| OCR falla con fotos de móvil o la extracción se equivoca | Solo se empareja con el catálogo; la persona confirma; el buscador es respaldo |
| OCR peor en catalán, euskera o gallego | Probar los modelos de cada idioma con citaciones sintéticas; respaldo al buscador |
| Datos personales de la citación | OCR en nuestro servidor, sin terceros; borrar el archivo al terminar; sin logs con el texto; prototipo con citaciones sintéticas; RGPD aplazado |
| El demo local falla (red, equipo, internet) | Red propia, semilla de datos, ensayo desde cero en otro equipo, plan B con foto y texto de la entrada, vídeo grabado del demo |
| El abogado no puede abrir el enlace (servidor local) | Simularlo con un segundo dispositivo en la misma red |
| Se pierden los datos del navegador (sin cuenta) | Avisar y volver a hacer el cuestionario |
| Servidor sobrecargado por el OCR | Límite de tamaño y de peticiones; cola de trabajos; probar con fotos reales de móvil |
| Número de colegiado falso o inexistente | Dato declarado [D]: se muestra como "no comprobado"; la persona decide; enlace de solo 48 h y solo texto |
| Enlace del abogado filtrado o usado por otra persona | Token aleatorio con caducidad y revocación; solo texto; sin acceso al perfil ni a otros casos |
| El abogado añade información errónea | La persona acepta, edita o borra; aviso de que no sustituye asesoramiento legal |
| Traducciones incorrectas o incompletas en ca / eu / gl | Revisión por hablantes y por Derecho; aviso y español de respaldo; limitar el demo a un trámite revisado en cada lengua |
| Simplificar el texto cambia el sentido legal | Revisión de Leyre y Carlos; si hay conflicto, manda el sentido legal y se explica mejor |
| Alcance demasiado grande | Corte mínimo del demo (§1); un trámite, un juzgado; el resto como siguientes pasos |
| Datos sensibles | Sin datos clínicos; datos sintéticos; perfil solo en el dispositivo |
