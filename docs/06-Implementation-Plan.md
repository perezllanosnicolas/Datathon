# 06 · Implementation Plan — Secuencia de construcción

> Plan **propuesto [P]**. Las fases dependen de lo que el equipo confirme en PRD y TRD. Trabajar en ramas por funcionalidad; no tocar `main` sin acuerdo.

## Equipo y reparto sugerido [P]
| Área | Quién |
|---|---|
| Contenido jurídico de trámites y revisión legal | Leyre, Carlos |
| Criterios de adaptación y criminología | Cristina |
| IA / chatbot RAG | Marianela |
| Hardware, integración y despliegue | Nicolás |
| Frontend / producto y costes | Dani, Cristina |

## Fase 0 — Acuerdos (actual)
- Confirmar alcance del demo: un trámite, un juzgado, un proceso (civil o penal) [?].
- Validar los 6 documentos y cerrar las preguntas abiertas más importantes.
- Revisar KIRI Engine: límites, precio, formatos.
- **Hecho cuando:** hay decisiones registradas en CLAUDE.md.

## Fase 1 — Contenido y datos
- Redactar un trámite completo, paso a paso, con documentos (llevar/recibir); revisión de Leyre y Carlos.
- Datos sintéticos: un juzgado con salas, procesos y estímulos.
- **Hecho cuando:** un trámite está revisado y cargable.

## Fase 2 — Esqueleto y datos
- Proyecto base, autenticación y roles, esquema de datos (05).
- **Hecho cuando:** se puede registrar un usuario y guardar su perfil.

## Fase 3 — Experiencia del usuario sin 3D
- Cuestionario de adaptación y ajustes (idioma, letra, filtros).
- Elección de trámite y juzgado.
- Flujo interactivo paso a paso con documentos y avisos sensoriales.
- **Hecho cuando:** Luis puede recorrer el flujo completo; Juan lo hace con teclado y lector de pantalla.

## Fase 4 — Escaneo y 3D
- Panel del encargado: subida de vídeo, llamada a KIRI Engine, estado del trabajo.
- Anotación de salas (funciones, procesos) y estímulos.
- Visor 3D accesible, enlazado a cada paso, con alternativa sin 3D.
- **Hecho cuando:** un vídeo real de una sala se convierte en 3D y se ve desde un paso.
- Plan B: modelo de ejemplo precargado.

## Fase 5 — Apoyos (según tiempo)
- Frases de protocolo, respiración, pictogramas, estimación de tiempos.
- Chatbot RAG (solo si hay tiempo y las reglas de acceso están claras).

## Fase 6 — Calidad y entrega
- Auditoría de accesibilidad (`web-design-guidelines`) y pruebas con `playwright-cli`.
- Revisión de seguridad y privacidad; aviso de no sustituir asesoramiento legal.
- README con cómo ejecutar el prototipo.
- Presentación: un mensaje por diapositiva; problema → persona (Luis/Juan) → solución → demo → impacto → siguientes pasos.
- **Hecho cuando:** demo estable y presentación ensayada.

## Riesgos [P]
| Riesgo | Mitigación |
|---|---|
| KIRI Engine lento, caro o con límites | Modelo precargado para el demo |
| 3D inaccesible para parte de los usuarios | Alternativa sin 3D en todos los pasos |
| Contenido legal incorrecto | Revisión de Leyre/Carlos y cita de norma |
| Alcance demasiado grande | Un trámite, un juzgado; el resto como siguientes pasos |
| Datos sensibles | Solo datos sintéticos; consentimiento y borrado |
