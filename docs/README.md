# Documentación de SimuLex

> Empieza por el **[resumen ejecutivo](00-Resumen-ejecutivo.md)** (5 minutos). Para ejecutar el prototipo, ve a **[11 · Ramas y despliegue](11-Ramas-y-despliegue.md)**.

## Orden de lectura

| # | Documento | Qué responde | Tipo |
|---|---|---|---|
| 00 | [Resumen ejecutivo](00-Resumen-ejecutivo.md) | Qué es, en qué estado está y qué falta | Visión general |
| 01 | [PRD · Requisitos de producto](01-PRD.md) | Problema, personas usuarias, alcance y restricciones | Producto |
| 02 | [TRD · Requisitos técnicos](02-TRD.md) | Stack, arquitectura, OCR, enlace del abogado, idiomas, hosting | Técnica |
| 03 | [AppFlow · Flujos y navegación](03-AppFlow.md) | Pantallas, recorridos y casos límite | Producto |
| 04 | [UI/UX · Diseño](04-UI-UX-Design.md) | Adaptaciones, estilo, tipografía y **lenguaje simple** | Producto |
| 05 | [Backend Schema · Datos](05-Backend-Schema.md) | Qué dato vive dónde, tablas y catálogo JSON | Técnica |
| 06 | [Plan de implementación](06-Implementation-Plan.md) | Fases, estado, reparto y riesgos | Gestión |
| 07 | [Diagramas](07-Diagramas.md) | Gantt, arquitectura, secuencias, datos, ramas y CI | Técnica |
| 08 | [Herramientas usadas en el desarrollo](08-Herramientas-usadas-en-el-desarrollo.md) | Obsidian, skills, planificación, Claude Code, Recordly… | Gestión |
| 09 | [Stack ideal para producción](09-Stack-ideal-produccion.md) | Qué cambiaría si no fuera una demo | Futuro |
| 10 | [Escalabilidad, rendimiento y recursos](10-Escalabilidad-rendimiento-recursos.md) | Mediciones reales, cuellos de botella y dimensionamiento | Futuro |
| 11 | [Ramas y despliegue](11-Ramas-y-despliegue.md) | Versión local (Docker) y online (Vercel) | Operación |
| A | [Anexo · Escaneo 3D](Anexo-3D-Escaneo.md) | Experiencia inmersiva con KIRI Engine (futuro) | Futuro |

Los documentos 01–06 son la **planificación inicial** del Datathon (21 de octubre), actualizada al estado del código. Los documentos 00 y 07–11 se añadieron después del Datathon. Vídeo del demo: https://youtu.be/t4ye8JS2_Rg.

## Leyenda
| Marca | Significado |
|---|---|
| **[D]** | Decidido por el equipo |
| **[P]** | Propuesta pendiente de acuerdo |
| **[?]** | Pregunta abierta |
| **[V]** | Pendiente de validar por Derecho (Leyre y Carlos) |

## Otros documentos del repositorio
- [`README.md`](../README.md): arranque rápido.
- [`CONTRIBUTING.md`](../CONTRIBUTING.md): cómo proponer cambios (ramas, comprobaciones, contenido y lenguaje).
- [`SECURITY.md`](../SECURITY.md): cómo informar de una vulnerabilidad y qué datos trata la app.
- [`CHANGELOG.md`](../CHANGELOG.md): versiones.
- [`CLAUDE.md`](../CLAUDE.md): contexto, reglas y **registro de decisiones fechado** (lo lee el asistente de IA en cada sesión; ver [08 §1](08-Herramientas-usadas-en-el-desarrollo.md#1-gestión-del-conocimiento)).
