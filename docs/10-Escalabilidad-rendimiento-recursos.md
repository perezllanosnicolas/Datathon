# 10 · Escalabilidad, rendimiento y recursos

> Análisis del prototipo **tal como está** (medido el 2026-10-25) y de lo que haría falta en el futuro. Las mediciones son reales. Las proyecciones de demanda son **estimaciones** basadas en el dato del equipo (150.000–300.000 personas neurodivergentes al año en una sede judicial en España, que tampoco es un dato oficial) y se marcan como tales.

## 1. Resumen
1. **El rendimiento no es el problema.** Un solo proceso del prototipo sirve entre **145 y 296 páginas por segundo** y la API **400–690 peticiones por segundo**. La demanda nacional estimada en hora punta es de **~13 peticiones por segundo**: hay un margen de 10 a 20 veces.
2. **Los límites reales son de arquitectura, no de potencia:** la base de datos SQLite no se comparte entre réplicas (en Vercel se pierde), el límite de peticiones vive en la memoria de cada proceso y **el catálogo entero se envía al navegador**, lo que no escala con cientos de trámites y sedes.
3. **El OCR es la única parte cara:** ~0,6 s de CPU por foto y +250 MB de memoria cuando está activo. Con la demanda estimada basta un *worker*, pero hay que aislarlo de la web.
4. **El cuello de botella del futuro es el contenido** (trámites revisados por Derecho y traducidos a cuatro idiomas), no los servidores.
5. Durante este análisis se encontraron y corrigieron **dos fallos** que afectaban al rendimiento y al despliegue (ver §6).

## 2. Cómo se midió
| | |
|---|---|
| Equipo | Portátil AMD Ryzen 7 7840HS (8 núcleos / 16 hilos), 32 GB de RAM, Windows 11 |
| Modos | (a) `next start` con Node 24.22 directamente en Windows; (b) imagen Docker de la rama `local` (Node 22, Debian *slim*) en Docker Desktop (WSL 2) |
| Carga | Script propio: 500 peticiones por ruta con **20 en paralelo**, tras 20 de calentamiento. El cliente corre en la misma máquina, así que **resta CPU al servidor**: las cifras son una cota inferior |
| OCR | Imagen de la citación sintética (`web/tests/fixtures/citacion-testigo-madrid.png`), tres veces seguidas |

## 3. Resultados

### 3.1 Latencia y rendimiento (un proceso)
| Ruta | Qué es | Node en Windows: pet./s · p50 · p95 | Docker: pet./s · p50 · p95 |
|---|---|---|---|
| `/` | Página de inicio (renderizada en el servidor) | **242** · 77 ms · 117 ms | **145** · 132 ms · 172 ms |
| `/buscar` | Buscador (renderizado en el servidor) | **296** · 67 ms · 85 ms | **173** · 113 ms · 136 ms |
| `/images/facades/…webp` | Foto estática | **1.089** · 17 ms · 28 ms | **903** · 21 ms · 28 ms |
| `GET /api/cases/[id]` | API + SQLite + comprobación del secreto | **686** · 28 ms · 40 ms | **396** · 45 ms · 90 ms |

Sin errores en ninguna prueba. Docker Desktop en Windows añade una máquina virtual; en un servidor Linux las cifras de Docker serían como las de la primera columna o mejores.

### 3.2 OCR de la citación
| | Node en Windows | Docker (modelos dentro de la imagen) |
|---|---|---|
| Primera lectura (arranca el *worker* y carga 4 modelos) | 3,0 s (incluye descargar los modelos) | **1,6 s** (sin red) |
| Lecturas siguientes | **~0,5 s** | **~0,6 s** |

Con fotos reales de móvil (más grandes, torcidas, con sombras) se espera más tiempo y menos aciertos. **No se ha medido** con fotos reales: está pendiente en el plan (Fase 6).

### 3.3 Memoria
| Momento | Node en Windows (RSS) | Docker |
|---|---|---|
| Recién arrancado | 85 MB | 54 MB |
| Tras la carga y 3 OCR | 210 MB (pico 399 MB) | 304 MB |

El *worker* de OCR se queda en memoria una vez creado (unos 150–250 MB con los modelos de 4 idiomas).

### 3.4 Tamaños
| Elemento | Tamaño |
|---|---|
| Imagen Docker (`simulex:local`) | 493 MB (de ellos, ~12 MB de modelos de OCR) |
| Modelos de OCR (spa 3,4 · eus 5,2 · glg 2,6 · cat 1,1 MB) | 12,3 MB |
| JavaScript del cliente, todas las rutas | 831 KB (**245 KB** comprimido con gzip) |
| — de ellos, el catálogo de trámites enviado al navegador | 98 KB (**26 KB** con gzip) |
| CSS | 24 KB |
| Imágenes (`public/`: fotos, fachadas, pictogramas, logotipos) | 1,5 MB en total; cada paso carga solo la suya |
| Catálogo JSON (3 trámites, 2 sedes, 39 términos) | 122 KB |
| Base de datos por caso | < 1 KB (sin textos largos ni archivos) |
| Compilación (`next build`) | ~10 s (5 s si ya hay caché) |

## 4. ¿Cuánta demanda habría? (estimación)
Supuestos [P], para tener un orden de magnitud:

| Supuesto | Valor |
|---|---|
| Personas al año (cota alta del dato del equipo) | 300.000 |
| Sesiones por persona (preparar, repasar, el mismo día) | 3 |
| Peticiones dinámicas por sesión (páginas + API, sin imágenes) | 25 |
| Días laborables al año / horas de uso concentrado | 250 días / 10 h |
| Factor de hora punta | ×5 |
| Personas que suben la citación | 50 % |

| Resultado | Cálculo | Valor |
|---|---|---|
| Peticiones dinámicas al año | 300.000 × 3 × 25 | 22,5 millones |
| Media en horario de uso | 22,5 M / (250 × 36.000 s) | **2,5 pet./s** |
| Hora punta | × 5 | **~13 pet./s** |
| Citaciones al día | 150.000 / 250 | ~600 (una cada minuto en hora punta) |
| Crecimiento de la base de datos | 300.000 casos × ~1 KB | ~0,3 GB al año (sin política de borrado) |

**Conclusión:** un solo proceso como el del prototipo cubre en rendimiento la demanda estimada de toda España con margen. Lo que impide llevarlo a producción tal cual es la **fiabilidad** (una sola máquina y datos no compartidos), no la velocidad.

## 5. Cuellos de botella y cómo escala cada pieza

| Pieza | Hoy | Qué pasa al crecer | Solución |
|---|---|---|---|
| **Renderizado** | Todas las páginas son dinámicas porque el layout lee la cookie de idioma | Cada visita usa CPU del servidor; no se puede cachear en una CDN | Páginas **estáticas por idioma** (`/es/…`): se sirven desde la CDN con coste casi cero. Ganancia esperada de 10× o más en capacidad y latencia |
| **Catálogo en el navegador** | Los JSON se importan en componentes de cliente: 26 KB con gzip para 3 trámites | **Crece lineal:** ~8,5 KB con gzip por trámite (4 idiomas). Con 50 trámites, ~430 KB; con 200, ~1,7 MB solo de catálogo, además de las sedes (~3 KB cada una) | Enviar **solo el trámite y la sede del caso**; el buscador consulta la API o un índice reducido |
| **Extracción** | Una expresión regular por término, trámite y sede | Coste ∝ trámites × términos × idiomas. Con cientos de trámites, decenas de ms por citación | Índice de términos (Aho-Corasick) construido una vez al arrancar |
| **OCR** | Un *worker* por proceso, dentro de la petición | Las citaciones se atienden en serie (~1,6 por segundo por proceso) y usan la misma CPU que la web | **Cola + workers** aparte que escalan con la longitud de la cola; Tesseract nativo es más rápido que WebAssembly |
| **Base de datos** | SQLite, un archivo (en Vercel, en `/tmp`) | Bien con una sola máquina (miles de escrituras por segundo con WAL); **imposible con varias réplicas**. En Vercel cada instancia tiene la suya y se pierde | **PostgreSQL** gestionado. En la rama `local`, SQLite en un volumen de Docker es suficiente y permanente |
| **Límite de peticiones** | Un `Map` en memoria | Con N réplicas, el límite real es N veces mayor; se reinicia con cada despliegue | **Redis** o el WAF/CDN |
| **Enlace del abogado** | Depende de la base de datos | En Vercel puede «desaparecer» si la petición cae en otra instancia | Llega con PostgreSQL |
| **Imágenes** | En `public/`, dentro de la imagen o del despliegue | Con cientos de sedes, el despliegue crece y cada cambio de foto exige desplegar | Almacenamiento de objetos + CDN; tamaños por pantalla (AVIF/WebP) |
| **Contenido** | JSON editado a mano por el equipo | Cada trámite necesita revisión jurídica y 3 traducciones revisadas | CMS con flujo de revisión y Weblate ([09](09-Stack-ideal-produccion.md)) |

## 6. Fallos encontrados durante este análisis (ya corregidos)
1. **La caché de los modelos del OCR nunca se escribía.** tesseract.js no crea la carpeta `data/tessdata` y, si no existe, se salta la caché sin avisar. Los modelos se descargaban en cada arranque y la promesa de «funciona sin internet después de la primera vez» no se cumplía. Corregido en `web/src/server/ocr.ts` (crea la carpeta). Además, `npm run ocr:models` los descarga por adelantado y la imagen Docker los incluye.
2. **En una compilación *standalone* faltaban dependencias del OCR.** `next.config.ts` incluía en la traza `tesseract.js` y su núcleo, pero no sus dependencias (`bmp-js`, `node-fetch`…). El OCR de imágenes fallaba en Docker y, previsiblemente, también en Vercel (los PDF con texto y los `.txt` funcionaban). Ahora la lista se calcula sola a partir de los `package.json`. El smoke test no lo detectaba porque solo subía `.txt`. Ahora también sube una imagen (`web/tests/fixtures/`) y comprueba el resultado del OCR, así que la CI lo detecta en las tres ramas.

Además, se añadieron cabeceras de seguridad. La más importante es `Referrer-Policy: no-referrer`, porque el token del abogado va en la URL.

## 7. Recursos necesarios

### 7.1 Hoy (prototipo)
| Escenario | Recursos |
|---|---|
| Demo local (rama `local`) | Cualquier portátil con Docker: **1 vCPU y 512 MB de RAM libres** bastan; 1 GB de disco para la imagen |
| Demo en Vercel (rama `online`) | Plan gratuito; funciones de hasta 4,5 MB de cuerpo; `/api/citation` puede durar hasta 120 s |

### 7.2 Piloto en 1–2 sedes [P]
| Componente | Tamaño orientativo |
|---|---|
| Web/API | 2 réplicas × (0,5 vCPU, 512 MB) detrás de una CDN |
| OCR | 1–2 workers × (1 vCPU, 1 GB) |
| PostgreSQL | Instancia pequeña gestionada (2 vCPU, 4 GB) con copias diarias |
| Redis | Instancia mínima (256 MB) |
| Almacenamiento de objetos | < 5 GB (fotos de sedes y pasos) |

### 7.3 Servicio nacional [P]
| Componente | Tamaño orientativo |
|---|---|
| Web/API | 2–4 réplicas × (1 vCPU, 1 GB), autoescalado; páginas estáticas desde la CDN |
| OCR | 2–4 workers × (2 vCPU, 2 GB), escalado según la cola |
| PostgreSQL | 2–4 vCPU, 8 GB, réplica de lectura y copias con recuperación a un punto en el tiempo |
| Asistente de IA (opcional) | **Salamandra-7B:** 1 GPU de 24 GB. **ALIA-40B:** cuantizado Q4, ~23 GB de pesos y ≥ 48 GB de memoria; para servirlo con buena latencia, 1–2 GPU de 48–80 GB. Es, con diferencia, el componente más caro: decidir con datos del piloto |

Con la demanda estimada, el coste de cómputo de la web y del OCR es pequeño. El coste principal de un servicio así son las **personas** (revisión jurídica, traducción, accesibilidad y soporte) y, si se activa, la **GPU** del asistente.

## 8. Recomendaciones, por orden de impacto
1. **PostgreSQL + Redis** → permite varias réplicas y un enlace del abogado fiable.
2. **Catálogo fuera del bundle** (solo el trámite del caso) → el tamaño de la app deja de crecer con el catálogo.
3. **Páginas estáticas por idioma + CDN** → la capacidad deja de depender del servidor.
4. **OCR en cola** + pruebas con fotos reales + PDF escaneados (OCRmyPDF).
5. **Medir en producción** (OpenTelemetry) antes de optimizar más: con estos números no compensa optimizar a ciegas.
6. Ampliar las pruebas del OCR con **fotos de móvil y PDF escaneados sintéticos** (la CI ya prueba una imagen limpia).
