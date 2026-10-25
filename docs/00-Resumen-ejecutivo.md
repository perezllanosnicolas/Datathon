# 00 · Resumen ejecutivo

> Qué es SimuLex, en qué estado está y dónde mirar. Lectura de 5 minutos.

## Qué es
**SimuLex** («Visita virtual accesible a la sede judicial») es una web para móvil que **prepara a una persona neurodivergente** (TEA, TDAH, dislexia, discalculia, disgrafía) **antes de ir a una sede judicial** por un procedimiento civil. Le enseña, paso a paso y adaptado a ella, qué va a pasar, cuánto dura cada parte, qué tiene que llevar, cómo es la entrada del edificio y qué se espera de ella.

Proyecto **finalista** del Datathon *Brecha Judicial* (DATAfórum JUSTICIA 2026), **Reto 3: Justicia inteligente para la neurodiversidad** (responsable: Ana Tudela, Ineco). Equipo: Nicolás, Marianela, Cristina, Dani, Leyre y Carlos (URJC y UDC).

## El problema
Las personas neurodivergentes encuentran barreras al acudir a la justicia: un entorno desconocido y ruidoso, pasos que nadie explica y un lenguaje difícil. El art. 24 CE garantiza la tutela judicial efectiva, y la Ley 15/2022 y el RDL 1/2013 obligan a la accesibilidad universal y a los ajustes razonables. Enfoque **no capacitista**: adaptarse es responsabilidad de la institución.

## La solución en cinco funciones
1. **Cuestionario de adaptación sin registro:** idioma (es, ca, gl, eu), tamaño y tipo de letra (incluida OpenDyslexic), colores tranquilos, menos movimiento, leer en voz alta, dictado y pictogramas o fotos. Se guarda **solo en el móvil**.
2. **Elegir el trámite y la sede** con un buscador o **subiendo una foto de la citación**: el texto se lee en nuestro servidor (sin terceros), se empareja con un catálogo revisado y la persona confirma. La citación no se guarda.
3. **Flujo paso a paso con barra de progreso** («Paso 3 de 9 · Te quedan 7»): duración, avisos sensoriales, frases para hablar con el personal, consejos de calma y la norma citada.
4. **Foto de la fachada y descripción de la entrada**, con alternativa en texto para lectores de pantalla.
5. **Enlace para el abogado/a** (48 h, revocable): indica qué documentos hay que llevar, sin ver el perfil de la persona.

Glosario de 39 «palabras difíciles», lenguaje simple en toda la app y siglas explicadas.

## Estado (2026-10-25)
| | |
|---|---|
| **Funciona** | Núcleo completo (Fases 2–7 del [plan](06-Implementation-Plan.md)) y parte de los apoyos (Fase 9) |
| **Demo** | https://datathon-olive.vercel.app · [vídeo del demo (~4 min)](https://youtu.be/t4ye8JS2_Rg) |
| **Ejecutar** | `docker compose up` (rama `local`) o Vercel (rama `online`): [11 · Ramas y despliegue](11-Ramas-y-despliegue.md) |
| **Calidad** | 49 tests unitarios, smoke test de 36 comprobaciones (con OCR real), CI en Node 22 y 24, imagen Docker probada en CI, CodeQL |
| **Datos** | Solo sintéticos. Sin documentación clínica ni diagnósticos |
| **Contenido** | 3 trámites civiles y 2 sedes de ejemplo. El trámite principal tiene correcciones de Derecho; quedan artículos por revisar ([V]). Catalán, gallego y euskera son **borradores** |
| **No incluido** | Asistente de IA (ALIA-40B, estudiado), Street View, escaneo 3D ([anexo](Anexo-3D-Escaneo.md)), panel de edición, cuentas |

## Decisiones de diseño que conviene conservar
- **Privacidad desde el diseño:** el perfil de adaptaciones (que puede revelar una neurodivergencia) nunca sale del dispositivo; la citación se procesa en memoria y se borra; el servidor solo guarda hashes y el trámite elegido.
- **Sin IA generativa en el camino crítico:** los pasos salen siempre de un catálogo revisado por Derecho; la IA sería un apoyo opcional.
- **Contenido como datos:** trámites, sedes y glosario en JSON por idioma, separados del código.

## Qué haría falta para un piloto
Resumen de [09 · Stack ideal](09-Stack-ideal-produccion.md) y [10 · Escalabilidad](10-Escalabilidad-rendimiento-recursos.md):
1. **PostgreSQL + Redis** en lugar de SQLite, para varias réplicas y un enlace del abogado fiable.
2. **CMS con flujo de revisión jurídica** y gestión de traducciones (el contenido es el verdadero cuello de botella).
3. **Páginas estáticas por idioma + CDN + PWA** que funcione sin conexión en la sede.
4. **OCR en cola** y lectura de PDF escaneados.
5. **ENS, EIPD (RGPD) y auditoría WCAG** con personas usuarias neurodivergentes.

**Rendimiento:** un solo proceso del prototipo sirve 145–296 páginas por segundo; la demanda nacional estimada en hora punta es de ~13 por segundo. El reto para escalar es la fiabilidad y el contenido, no la potencia.

## Puntos abiertos que hay que resolver antes de reutilizarlo
- **Pictogramas de ARASAAC:** licencia CC BY-NC-SA (**no comercial**). Un uso por o para una empresa necesita permiso del Gobierno de Aragón o sustituirlos.
- **Fotos y logotipos:** confirmar la autoría y los derechos de las fotos de los pasos, la foto de la sede de Madrid y el permiso para usar los logotipos oficiales y de las universidades.
- **Revisión jurídica** de los artículos marcados [V] y **revisión nativa** de las traducciones.

## Dónde mirar
| Si quieres… | Lee |
|---|---|
| Entender el producto | [01 · PRD](01-PRD.md), [03 · AppFlow](03-AppFlow.md), [04 · UI/UX](04-UI-UX-Design.md) |
| Revisar la técnica | [02 · TRD](02-TRD.md), [05 · Backend](05-Backend-Schema.md), [07 · Diagramas](07-Diagramas.md) |
| Ver cómo se hizo | [06 · Plan](06-Implementation-Plan.md), [08 · Herramientas](08-Herramientas-usadas-en-el-desarrollo.md) |
| Ver el futuro | [09 · Stack ideal](09-Stack-ideal-produccion.md), [10 · Escalabilidad](10-Escalabilidad-rendimiento-recursos.md) |
| Ejecutarlo | [11 · Ramas y despliegue](11-Ramas-y-despliegue.md) |
