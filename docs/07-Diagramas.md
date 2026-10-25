# 07 · Diagramas — El proyecto en imágenes

> Todos los diagramas están escritos en [Mermaid](https://mermaid.js.org/): GitHub los dibuja solos y se editan como texto. Leyenda: **[D]** decidido · **[P]** propuesta · **[?]** abierto.

Índice:
1. [Cronología real del Datathon (Gantt)](#1-cronología-real-del-datathon-gantt)
2. [Hoja de ruta propuesta tras el Datathon (Gantt) [P]](#2-hoja-de-ruta-propuesta-tras-el-datathon-gantt-p)
3. [Arquitectura del prototipo](#3-arquitectura-del-prototipo)
4. [Dónde vive cada dato (privacidad)](#4-dónde-vive-cada-dato-privacidad)
5. [Recorrido de la persona por las pantallas](#5-recorrido-de-la-persona-por-las-pantallas)
6. [Secuencia: subir la citación](#6-secuencia-subir-la-citación)
7. [Secuencia: enlace del abogado/a](#7-secuencia-enlace-del-abogadoa)
8. [Modelo de datos (SQLite)](#8-modelo-de-datos-sqlite)
9. [Ramas y despliegue: local y online](#9-ramas-y-despliegue-local-y-online)
10. [Integración continua](#10-integración-continua)
11. [Mapa de la documentación](#11-mapa-de-la-documentación)

---

## 1. Cronología real del Datathon (Gantt)
Reconstruida a partir de los commits del repositorio (hora local). Cada barra agrupa los commits de una misma línea de trabajo.

```mermaid
gantt
    title SimuLex · del reto al prototipo (21–23 oct 2026)
    dateFormat YYYY-MM-DD HH:mm
    axisFormat %d %Hh
    todayMarker off

    section Fase 0 · Idea
    Lectura del reto y Google Doc del equipo     :done, idea, 2026-10-21 14:00, 4h
    Repositorio inicial                          :milestone, m0, 2026-10-21 18:01, 0d

    section Planificación
    Seis documentos (PRD, TRD, AppFlow, UI/UX, Backend, Plan) :done, plan, 2026-10-21 18:01, 174m
    Skill /sincronizar                           :done, sync, 2026-10-21 20:30, 25m

    section Núcleo (Fases 2–7)
    Esqueleto Next.js, adaptaciones, buscador, flujo, OCR, abogado :done, core, 2026-10-21 20:55, 50m
    Pruebas en vista de móvil (playwright-cli)   :done, shots, 2026-10-21 21:45, 5m

    section Apoyos (Fase 9)
    Pictogramas ARASAAC, mapa del flujo, imágenes, dictado :done, sup, 2026-10-21 22:00, 6h
    QR para el móvil (npm run share)             :done, qr, 2026-10-22 10:00, 45m

    section Iteración de UX
    Filtros, ajustes, slider de letra, colores, siglas, glosario :done, ux, 2026-10-22 10:45, 150m
    SimuLex, «sede judicial», fachadas, voz, fotos por paso :done, brand, 2026-10-22 13:15, 110m

    section Derecho y despliegue
    Corrección jurídica del trámite de la casa heredada :done, law, 2026-10-22 15:05, 80m
    Despliegue en Vercel y logotipo de la pieza de puzle :done, vercel, 2026-10-22 15:05, 83m

    section Cierre
    Documentación al día con el código           :done, docs, 2026-10-22 16:30, 5h
    Grabación del demo con Recordly              :done, rec, 2026-10-22 18:00, 4h
    Letra grande sin romper la maquetación       :done, font, 2026-10-22 21:34, 67m
    Ajustes, deshacer adaptaciones al quitar una neurodivergencia :done, fix, 2026-10-23 16:30, 1h
```

> Las horas de inicio de «Lectura del reto», «Apoyos» y «Grabación» son aproximadas: solo se conoce la hora del commit en que terminaron.

## 2. Hoja de ruta propuesta tras el Datathon (Gantt) [P]
Propuesta para debatir en el equipo. **Las fechas son orientativas** (se cuentan desde que se acuerde empezar) y dependen del equipo y de los permisos. Detalle de cada bloque en [09 · Stack ideal](09-Stack-ideal-produccion.md) y [10 · Escalabilidad](10-Escalabilidad-rendimiento-recursos.md).

```mermaid
gantt
    title Del prototipo a un piloto (propuesta, semanas desde el inicio)
    dateFormat YYYY-MM-DD
    axisFormat S%W
    todayMarker off

    section 0 · Acuerdos
    Revisión del prototipo y del alcance               :a0, 2026-11-02, 2w
    Acuerdo de alcance y permisos                      :milestone, a1, after a0, 0d

    section 1 · Contenido
    Revisión jurídica de trámites (Derecho)            :c1, after a1, 4w
    Revisión de traducciones ca/gl/eu (nativos)        :c2, after a1, 4w
    Validación con asociaciones (lectura fácil, TEA, TDAH) :c3, after a1, 6w

    section 2 · Plataforma
    Base de datos gestionada y almacenamiento de objetos :p1, after a1, 3w
    Panel de edición del catálogo (CMS con roles)      :p2, after p1, 4w
    OCR en cola de trabajos y PDF escaneados           :p3, after p1, 3w
    Observabilidad, copias y RGPD (EIPD)               :p4, after p1, 4w

    section 3 · Calidad
    Pruebas e2e y auditoría WCAG 2.2 AA                :q1, after p2, 3w
    Prueba con usuarios neurodivergentes               :q2, after c3, 3w

    section 4 · Piloto
    Piloto en 1–2 sedes judiciales                     :crit, pil, after q1, 8w
    Asistente ALIA (si el piloto lo justifica)         :ai, after pil, 6w
```

## 3. Arquitectura del prototipo
Una sola aplicación Next.js sirve las pantallas y la API. No hay servicios externos en tiempo de ejecución (salvo la primera descarga de los modelos del OCR).

```mermaid
flowchart TB
    subgraph C["Clientes"]
        direction LR
        UI["📱 Persona (sin cuenta)<br/>pantallas React<br/>+ localStorage: perfil · casos · progreso"]
        LUI["📱 Abogado/a<br/>/abogado/[token]<br/>enlace de 48 h"]
    end

    subgraph S["🖥️ Servidor Next.js 16 · un solo proceso (Docker local o Vercel)"]
        direction TB
        subgraph E["Entrada"]
            direction LR
            RSC["Pantallas<br/>Server Components<br/>idioma por cookie"]
            API["API de casos y enlaces<br/>/api/cases · /api/lawyer"]
            CIT["/api/citation<br/>foto o PDF en memoria"]
        end
        subgraph L["Lógica"]
            direction LR
            SEC["security.ts<br/>hash SHA-256 · 48 h · límites"]
            OCR["ocr.ts<br/>unpdf · tesseract.js"]
            EXT["extract.ts<br/>reglas, sin IA generativa"]
        end
        subgraph D["Datos"]
            direction LR
            DB[("SQLite<br/>casos · enlaces · documentos")]
            CAT[["Catálogo JSON<br/>trámites · sedes · glosario"]]
            PUB[["Archivos estáticos<br/>fachadas · fotos · pictogramas"]]
        end
        API --> SEC --> DB
        CIT --> OCR --> EXT --> CAT
        RSC --> CAT
    end

    UI --> RSC
    UI --> API
    UI --> CIT
    UI --> PUB
    LUI --> API

    FUT["Futuro, no implementado:<br/>ALIA-40B · Street View · escaneo 3D"]:::future
    S -.-> FUT
    classDef future stroke-dasharray: 5 5
```

## 4. Dónde vive cada dato (privacidad)
El dato más sensible (las adaptaciones, que pueden revelar una neurodivergencia) **nunca sale del dispositivo**. La citación se procesa en memoria y se borra.

```mermaid
flowchart TB
    subgraph D["Dispositivo de la persona"]
        P["Perfil de adaptaciones<br/>(needs, letra, color, voz…)"]
        C["Casos: id + secreto"]
        G["Progreso y documentos vistos"]
    end
    subgraph S["Servidor"]
        K["Cookie bj_lang<br/>(solo el idioma)"]
        U["user_cases<br/>trámite · sede · hash del secreto"]
        L["lawyer_links<br/>hash del token · 48 h · nombre y nº de colegiado declarados"]
        X["case_documents<br/>solo texto"]
    end
    N["En ningún sitio:<br/>citación y su texto · nombre de la persona<br/>correo · diagnósticos"]:::none

    P -. "no se envía" .-x S
    C -- "secreto en cabecera" --> U
    U --- L --- X
    classDef none fill:#fde8e8,stroke:#b42318,color:#111
```

## 5. Recorrido de la persona por las pantallas

```mermaid
flowchart TD
    A["/ Inicio"] --> Q{"¿Primera vez?"}
    Q -- "sí" --> QZ["/cuestionario<br/>idioma → adaptaciones → más filtros"]
    Q -- "no" --> E
    QZ --> E["/elegir"]
    E -- "subir citación (va primero)" --> CI["/citacion<br/>foto o PDF"]
    E -- "buscar" --> B["/buscar<br/>trámite y sede, 4 idiomas"]
    CI -- "detectado" --> CF["/confirmar<br/>«Esto es lo que he entendido»"]
    CI -- "no reconocido" --> B
    B --> CF
    CF -- "crea caso anónimo" --> F["/caso/[id]<br/>paso a paso + barra de progreso"]
    F -- "pasos de llegada" --> FA["Foto de la fachada<br/>+ alternativa en texto"]
    F --> AB["/caso/[id]/abogado<br/>crear o revocar enlace"]
    F --> R["/caso/[id]/resumen<br/>lista de documentos e impresión"]
    A -.-> AJ["/ajustes"]
    A -.-> GL["/glosario<br/>39 palabras difíciles"]
```

## 6. Secuencia: subir la citación

```mermaid
sequenceDiagram
    autonumber
    actor P as Persona
    participant N as Navegador
    participant API as /api/citation
    participant O as ocr.ts
    participant X as extract.ts
    participant C as Catálogo JSON

    P->>N: Elige foto o PDF
    N->>N: Si la foto pesa > 3,5 MB, la reduce (límite de Vercel)
    N->>API: POST multipart (archivo)
    API->>API: Límite: 6 por minuto · máx. 8 MB · tipo por bytes
    API->>O: toText(buffer)
    alt PDF con texto
        O->>O: unpdf
    else Imagen
        O->>O: tesseract.js (modelos en caché)
    end
    O-->>API: texto
    API->>API: buffer.fill(0) (se borra también si falla)
    API->>X: extract(texto)
    X->>C: searchTerms y nombres de sede (4 idiomas)
    X-->>API: candidatos + fecha + hora
    API-->>N: solo ids del catálogo, fecha y hora
    N->>P: «Esto es lo que he entendido» → confirma o corrige
```

## 7. Secuencia: enlace del abogado/a

```mermaid
sequenceDiagram
    autonumber
    actor P as Persona
    participant A as App de la persona
    participant S as Servidor
    actor L as Abogado/a

    A->>S: POST /api/cases/{id}/links (x-case-secret)
    S-->>A: token (una sola vez) · se guarda su hash · caduca en 48 h
    P->>L: Comparte el enlace (menú del móvil o copiar)
    L->>S: GET /api/lawyer/{token}
    S-->>L: trámite y sede (sin perfil ni datos personales)
    L->>S: POST documento + nombre y nº de colegiado (declarados)
    P->>A: Abre la app
    A->>S: GET /api/cases/{id}
    S-->>A: documentos nuevos «Añadido por tu abogado/a»
    P->>A: Acepta, edita o borra
    opt Cuando quiera
        P->>S: DELETE enlace → revocado al momento
    end
```

## 8. Modelo de datos (SQLite)
`procedure_id` y `court_id` apuntan a ids del catálogo JSON (no hay clave foránea). Detalle en [05 · Backend Schema](05-Backend-Schema.md).

```mermaid
erDiagram
    user_cases ||--o{ lawyer_links : "ON DELETE CASCADE"
    user_cases ||--o{ case_documents : "ON DELETE CASCADE"
    lawyer_links |o--o{ case_documents : "ON DELETE SET NULL"

    user_cases {
        text id PK
        text owner_token_hash "SHA-256"
        text procedure_id "id del catálogo"
        text court_id "id del catálogo"
        text source "search | citation"
        text created_at
    }
    lawyer_links {
        text id PK
        text user_case_id FK
        text token_hash UK "SHA-256"
        text language "es | ca | gl | eu"
        text expires_at "created_at + 48 h"
        text revoked_at
        text lawyer_name "declarado"
        text lawyer_bar_number "declarado"
    }
    case_documents {
        text id PK
        text user_case_id FK
        text name
        text kind "bring | receive"
        text added_by "catalog | lawyer | user"
        text lawyer_link_id FK
        text status "pending | accepted | edited | rejected"
    }
```

## 9. Ramas y despliegue: local y online
`main` tiene el código común, la documentación y la CI. `local` y `online` solo añaden lo propio de cada forma de ejecutarlo. Los cambios de código entran siempre por `main`. Guía completa en [11 · Ramas y despliegue](11-Ramas-y-despliegue.md).

```mermaid
gitGraph
    commit id: "prototipo (Datathon)"
    commit id: "tests + CI + docs"
    branch local
    checkout local
    commit id: "Dockerfile + compose"
    checkout main
    branch online
    checkout online
    commit id: "vercel.json"
    checkout main
    commit id: "fix común"
    checkout local
    merge main
    checkout online
    merge main
```

```mermaid
flowchart LR
    subgraph L["Rama local · Docker"]
        DC["docker compose up"] --> IMG["Imagen node:22-slim<br/>Next standalone<br/>modelos OCR incluidos"]
        IMG --> VOL[("Volumen simulex-data<br/>SQLite permanente")]
        IMG --> LAN["http://IP-local:3000<br/>móviles en la misma Wi-Fi"]
    end
    subgraph O["Rama online · Vercel"]
        GH["push a online"] --> VB["Build en Vercel<br/>Root Directory = web"]
        VB --> FN["Funciones serverless<br/>SQLite en /tmp (efímera)"]
        FN --> URL["https://… .vercel.app"]
    end
```

## 10. Integración continua
Los mismos workflows corren en las tres ramas. El trabajo de Docker solo se activa donde existe `web/Dockerfile` (rama `local`).

```mermaid
flowchart LR
    PUSH["push / pull request"] --> Q["quality<br/>Node 22 y 24<br/>lint · typecheck · vitest"]
    Q --> E["e2e-api<br/>next build · next start<br/>smoke-test (36 comprobaciones)"]
    Q --> DK{"¿existe<br/>web/Dockerfile?"}
    DK -- "sí (local)" --> D["docker<br/>compose up --wait<br/>smoke-test contra el contenedor"]
    DK -- "no" --> SKIP["se omite"]
    PUSH --> CQ["CodeQL<br/>análisis estático"]
    WEEK["semanal"] --> DB["Dependabot<br/>npm y actions"]
```

## 11. Mapa de la documentación

```mermaid
flowchart TB
    R["README.md<br/>arrancar en 5 minutos"] --> I["docs/README.md<br/>índice y orden de lectura"]
    I --> X["00 · Resumen ejecutivo"]
    I --> PR["Producto<br/>01 PRD · 03 AppFlow · 04 UI/UX"]
    I --> TE["Técnica<br/>02 TRD · 05 Backend · 07 Diagramas"]
    I --> GE["Gestión<br/>06 Plan · 08 Herramientas"]
    I --> FU["Futuro<br/>09 Stack ideal · 10 Escalabilidad · 11 Ramas · Anexo 3D"]
```
