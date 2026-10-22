# 05 · Backend Schema — Datos y autenticación

> Leyenda: **[D]** decidido · **[P]** propuesta · **[?]** abierto.
> **Estado (2026-10-22):** este documento describe lo que hay en el prototipo (`web/`). Lo que no está implementado aparece en §5 «Previsto».
> Datos sintéticos únicamente. **No se almacena documentación clínica ni diagnósticos** [D].
> El perfil de adaptaciones es dato sensible. El análisis RGPD queda **aplazado** [D]; mientras tanto el diseño minimiza datos.

## 1. Dónde vive cada dato [D]
| Dónde | Qué | Archivo |
|---|---|---|
| **Dispositivo** (localStorage del navegador) | Perfil de adaptaciones, casos de la persona (id + secreto), progreso, documentos ya vistos | `web/src/lib/storage.ts` |
| **Cookie** `bj_lang` | Solo el idioma, para que el servidor ponga `<html lang>` | `web/src/lib/storage.ts` |
| **Catálogo JSON** (solo lectura) | Trámites, pasos, documentos, sedes judiciales, glosario, pictogramas | `web/data/catalog/` |
| **SQLite** (`node:sqlite`) | Casos anónimos, enlaces del abogado/a y documentos del caso | `web/src/server/db.ts` |
| **En ningún sitio** | La citación y su texto, nombre de la persona, correo, diagnósticos | — |

La base de datos está en `web/data/app.db` en local y en `/tmp/app.db` en Vercel (no permanente; ver [TRD §2e](02-TRD.md)). Se puede cambiar con la variable `DB_PATH`. Las tablas se crean solas al arrancar.

## 2. Uso sin registro y roles [D]
- **Sin cuentas.** No hay tablas de usuarios.
- **Caso anónimo:** al confirmar trámite y sede se crea un caso en el servidor con un id aleatorio y un **secreto de propietario** que solo guarda el dispositivo. El servidor guarda el **hash SHA-256** del secreto, nunca el secreto. Las rutas del caso piden ese secreto.
- Si se borran los datos del navegador, la persona pierde su perfil, su progreso y el acceso a sus casos.
- **Abogado/a sin cuenta:** accede solo con un token del enlace, limitado a un caso. Solo puede leer el trámite y la sede y crear o editar documentos de ese caso. El token se comprueba en cada llamada (caducidad y revocación).
- **Editor de contenido:** no hay panel ni rol en el prototipo. El equipo edita los JSON del catálogo [P].
- **Límites de peticiones** (en memoria, por cliente y minuto): citación 6, crear caso 20, crear enlace 10, abogado 60 lecturas y 20 escrituras.

## 3. En el dispositivo (localStorage) [D]
| Clave | Contenido |
|---|---|
| `bj.prefs` | `lang` (`es · ca · gl · eu`), `fontSize` (6 niveles, `s`…`xxxl`, 16–36 px), `typeface` (`app · readable · opendyslexic`), `needs[]` (`tea · tdah · dislexia · discalculia · disgrafia · vision · otras`), `reducedMotion`, `calmColors`, `highContrast`, `readAloud` (activado por defecto), `dictation`, `imageMode` (`picto · real · none`), `onboarded` |
| `bj.cases` | Lista de casos: `id`, `secret`, `procedureId`, `courtId`, `source` (`search · citation`), `createdAt` |
| `bj.progress.<caseId>` | `current`, `done[]`, `skipped[]`, `checked[]` (documentos marcados como listos), `updatedAt` |
| `bj.seenDocs.<caseId>` | Ids de documentos del abogado/a ya vistos, para avisar de los nuevos |

`needs` son **preferencias elegidas por la persona**, no un diagnóstico. «Borrar todo» en Ajustes elimina todas las claves `bj.*` y la cookie.

## 4. En el servidor (SQLite) [D]

### user_cases (caso de la persona)
`id`, `owner_token_hash`, `procedure_id`, `court_id`, `source` (`search | citation`), `created_at`.
No guarda nombre, perfil ni adaptaciones.

### lawyer_links (enlace de vinculación)
`id`, `user_case_id`, `token_hash` (el token real solo se entrega una vez), `language` (`es | ca | eu | gl`), `created_at`, `expires_at` (= `created_at` + 48 h), `revoked_at`, `last_used_at`, `lawyer_name`, `lawyer_bar_number`.
El nombre y el número de colegiado son **obligatorios** antes de añadir documentos y son **datos declarados, sin verificar**. Varios usos mientras esté vigente.

### case_documents (documentos de un caso)
`id`, `user_case_id`, `name`, `kind` (`bring | receive`), `notes`, `added_by` (`catalog | lawyer | user`), `lawyer_link_id`, `status` (`pending | accepted | edited | rejected`), `created_at`, `updated_at`.
Solo texto: no se suben archivos. En la app se muestran separados de los documentos del catálogo.

### Relaciones
```
user_cases 1─n lawyer_links     (ON DELETE CASCADE)
user_cases 1─n case_documents   (ON DELETE CASCADE)
lawyer_links 1─n case_documents (ON DELETE SET NULL)
```
`procedure_id` y `court_id` apuntan a ids del catálogo JSON (no hay clave foránea).

### Citación (no se guarda) [D]
El archivo y el texto se procesan en memoria y se descartan; el búfer se borra al terminar, también si falla. Solo se conserva el resultado que la persona confirma: `procedure_id` y `court_id` en `user_cases`.

## 5. Catálogo JSON [D, provisional]
Cada texto visible es un objeto por idioma: `{ "es": "…", "ca": "…", "gl": "…", "eu": "…" }`. El español es obligatorio y es el respaldo. Se elige JSON en vez de tablas para que el equipo de Derecho pueda editarlo.

### procedures.json → `procedures[]`
`id`, `processType` (`civil`), `reviewStatus` (`draft | reviewed`), `name`, `summary`, `legalBasis`, `searchTerms` (por idioma), `steps[]`.
Cada paso: `id`, `slot`, `kind` (`prepare | arrival | access | wait | procedure | exit`), `showsEntrance`, `durationMin` (`[mín, máx]`), `title`, `expected`, `instructions[]`, `sensory`, `calmTip`, `protocolPhrase`, `whoToAsk`, `legalNote`, `documents[]` (`id`, `kind` `bring | receive`, `name`, `notes`).
Las fases de la barra de progreso salen de `kind`: llegada (`prepare`, `arrival`, `access`) · espera · trámite · salida.

Trámites de ejemplo (todos en `draft`, provisionales):
| id | Pasos | Nota |
|---|---|---|
| `division-cosa-comun-demandado` | 10 | Caso del demo (casa heredada; la persona es la demandada). Pendiente de revisión por Derecho |
| `juicio-verbal-vista` | 9 | Juicio verbal de ejemplo |
| `testigo-juicio-civil` | 7 | Declarar como testigo |

### courts.json → `courts[]`
`id`, `reviewStatus`, `processTypes[]`, `city`, `name`, `address`, `searchTerms[]`, `entrance` y `stepNotes`.
- `entrance`: `photo` (`src`, `credit`, `source`: foto de Wikimedia Commons), `roadDirection` (`one_way | two_way | pedestrian | other`), `dropOff`, `access`, `textDescription` (alternativa en texto completa).
- `stepNotes`: notas propias de la sede por `slot` de paso (dónde se hace, avisos sensoriales). Sustituye a la tabla `court_steps` prevista.

Sedes de ejemplo: `madrid-primera-instancia` (Capitán Haya 66) y `bcn-ciutat-justicia` (Ciudad de la Justicia, L'Hospitalet de Llobregat).

### glossary.json → `terms[]`
`id`, `term`, `definition`. 39 términos.

### pictograms.json
Pictograma de ARASAAC para cada `slot` de paso y cada documento, y el texto de atribución en los 4 idiomas. Se descargan con `npm run pictos` a `web/public/pictos/arasaac/` (CC BY-NC-SA 4.0: uso no comercial y con atribución).

## 6. Previsto, no implementado [P]
- **Cuentas opcionales** (`users`, `user_profiles`) para usar varios dispositivos [?].
- **Panel de editor** con rol `editor` para dar de alta trámites y sedes [?].
- **Tabla `translations`** con `review_status` por texto: hoy el estado de revisión es por trámite o sede (`reviewStatus`).
- **Street View** (`heading`, `pitch`, `fov`, `capture_date` por sede): hoy hay foto fija.
- Métrica anónima de aciertos de la citación (sin texto ni datos personales) [?].

## 7. Preguntas abiertas
- [ ] ¿Qué datos del acompañante se guardan, si los hay?
- [ ] Cómo recuperar el caso si se borran los datos del navegador (exportar o copiar un código) [?].
- [ ] Retención y borrado de casos y enlaces caducados en el servidor.
- [ ] Base de datos externa para Vercel si el enlace del abogado tiene que ser fiable.

> Modelo para el escaneo 3D (rooms, scans, stimuli en 3D): ver [Anexo-3D-Escaneo.md](Anexo-3D-Escaneo.md).
