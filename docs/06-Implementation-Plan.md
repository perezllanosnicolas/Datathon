# 06 · Implementation Plan — Secuencia de construcción

> Plan **propuesto [P]**. Trabajar en ramas por funcionalidad; no tocar `main` sin acuerdo.
> Núcleo: registro, adaptaciones y diagrama de flujo. El 3D es un anexo futuro.

## Equipo y reparto sugerido [P]
| Área | Quién |
|---|---|
| Contenido jurídico de trámites y revisión legal | Leyre, Carlos |
| Criterios de adaptación y criminología | Cristina |
| IA / chatbot (opcional) | Marianela |
| Integración, despliegue y Street View | Nicolás |
| Frontend / producto y costes | Dani, Cristina |

## Fase 0 — Acuerdos (actual)
- Confirmar alcance del demo: un trámite, un juzgado, un proceso (civil o penal) [?].
- Validar los 6 documentos y cerrar las preguntas abiertas más importantes.
- Decidir modalidad de Street View tras revisar cuotas y términos de Google.
- **Hecho cuando:** decisiones registradas en CLAUDE.md.

## Fase 1 — Contenido y datos sintéticos
- Redactar un trámite completo, paso a paso, con documentos (llevar/recibir); revisión de Leyre y Carlos.
- Un juzgado de ejemplo con su entrada: coordenadas, sentido de la vía, acceso y descripción en texto.
- **Hecho cuando:** un trámite y un juzgado están revisados y cargables.

## Fase 2 — Esqueleto, registro y datos
- Proyecto base mobile-first, autenticación, esquema de datos (05).
- **Hecho cuando:** se puede registrar un usuario y guardar su perfil.

## Fase 3 — Adaptaciones
- Cuestionario de registro y ajustes (idioma, tamaño de letra, filtros por neurodivergencia, modos de movimiento y color).
- **Hecho cuando:** los ajustes cambian la interfaz y persisten.

## Fase 4 — Selección de trámite y diagrama de flujo interactivo
- **Buscador** de trámite y juzgado con filtros (vía principal, sin IA).
- Flujo paso a paso (tras elegir con el buscador).
- Flujo paso a paso con documentos de entrada y salida, duración y avisos sensoriales.
- Resumen final.
- **Hecho cuando:** Luis recorre el flujo completo en móvil y Juan lo hace con lector de pantalla.

## Fase 5 — Street View de la entrada
- Integrar la vista de entrada en los pasos de llegada, con alternativa de texto.
- Gestionar ausencia de cobertura y clave de API restringida.
- **Hecho cuando:** los pasos de llegada muestran la entrada y su descripción.

## Fase 5b — Subida de citación con IA
- Antes: decidir proveedor de IA y tratamiento de datos (RGPD); preparar 3–5 citaciones sintéticas de los trámites del catálogo.
- Subida (PDF/foto), extracción de campos, clasificación contra el catálogo, pantalla de confirmación.
- Caída al buscador cuando la confianza es baja.
- Evaluación: medir aciertos sobre las citaciones sintéticas y casos límite (borrosa, trámite fuera del catálogo).
- **Hecho cuando:** al subir una citación sintética se propone el trámite correcto, la persona lo confirma y se abre su flujo; y si falla, el buscador sigue funcionando.
- Responsable sugerido: Marianela (IA) con revisión de Derecho de los trámites del catálogo.

## Fase 6 — Apoyos (según tiempo)
- Frases de protocolo, respiración, pictogramas, estimaciones de tiempo.
- Chatbot solo si hay tiempo y con contenido público.

## Fase 7 — Calidad y entrega
- Auditoría de accesibilidad (`web-design-guidelines`) y pruebas con `playwright-cli` en viewport móvil.
- Revisión de seguridad y privacidad; aviso de no sustituir asesoramiento legal.
- README con cómo ejecutar el prototipo.
- Presentación: un mensaje por diapositiva; problema → persona (Luis/Juan) → solución → demo → impacto → siguientes pasos (incluye el anexo 3D como visión).
- **Hecho cuando:** demo estable y presentación ensayada.

## Riesgos [P]
| Riesgo | Mitigación |
|---|---|
| Cuotas, coste o términos de Street View | Elegir modalidad ligera; plan B con foto o texto |
| Street View desactualizado o sin cobertura | Mostrar fecha y descripción en texto |
| Contenido legal incorrecto | Revisión de Leyre/Carlos y cita de norma |
| La IA identifica mal el trámite o inventa pasos | La IA solo clasifica dentro de un catálogo revisado; la persona confirma; el buscador es respaldo |
| Datos personales de la citación enviados a un proveedor | Procesar y descartar, enmascarar datos, proveedor con acuerdo de tratamiento; prototipo con citaciones sintéticas |
| Alcance demasiado grande | Un trámite, un juzgado; el resto como siguientes pasos |
| Datos sensibles | Sin datos clínicos; datos sintéticos; consentimiento y borrado |
