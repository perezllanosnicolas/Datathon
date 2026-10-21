# 05 · Backend Schema — Datos y autenticación

> Todo el esquema es una **propuesta [P]** derivada del flujo decidido. Revisar en equipo.
> Datos sintéticos únicamente. **No se almacena documentación clínica ni diagnósticos** [D].
> El perfil de adaptaciones es dato sensible. El análisis RGPD queda **aplazado** [D]; mientras tanto el diseño minimiza datos (ver §1).

## 1. Uso sin registro y roles
- **La herramienta se usa sin registro** [D]. No hay cuentas de usuario en el demo.
- **El perfil de adaptaciones y el progreso se guardan en el propio dispositivo** (almacenamiento del navegador), no en el servidor [P]. Así el servidor no guarda nada sobre la neurodivergencia de la persona.
- **Caso anónimo:** el caso (trámite + juzgado + documentos del abogado) se guarda en el servidor con un identificador aleatorio y un secreto de propietario que solo conoce el dispositivo de la persona (se guarda el hash). Sirve para que lleguen los documentos del abogado sin cuenta [P].
- Si se borran los datos del navegador, la persona pierde su perfil y el acceso a ese caso. Avisarlo en la app y permitir "exportar mi configuración" [P].
- Un registro con cuenta, si se añade más adelante, sería **opcional** (por ejemplo, para usar varios dispositivos) [?]. Las tablas `users` y `user_profiles` quedan como previstas, no necesarias para el demo.
- Roles: `editor` (contenido, con acceso protegido), usuario anónimo y abogado/a **sin cuenta**, con acceso solo mediante un enlace con token limitado a un caso. Cada rol ve solo lo necesario.
- Endpoints del enlace: solo permiten leer trámite/juzgado y crear o editar `case_documents` de ese caso; validan caducidad y revocación en cada llamada; límite de peticiones [P].
- Sesiones con token seguro. Claves de servicios externos solo en el servidor.

## 2. Entidades

### users (opcional, no usada en el demo)
`id`, `email`, `password_hash`, `role`, `created_at`, `consent_at`.

### user_profiles (cuestionario de adaptación) — se guarda en el dispositivo en el demo
`user_id` (solo si hay cuenta), `language` (`es | ca | eu | gl`), `font_size`, `reduced_motion`, `reduced_color`, `text_to_speech`, `screen_reader`, `adaptation_filters[]` (TEA, TDAH, dislexia, discalculia, disgrafía, ceguera/baja visión, otros).
Son **preferencias elegidas por la persona**, no un diagnóstico. Editable y borrable.

### courts (juzgado)
`id`, `name`, `address`, `process_types[]`, `published`.

### court_entrances (entrada del edificio, para Street View)
`court_id`, `lat`, `lng`, `heading`, `pitch`, `fov` (ángulo de visión), `street_view_pano_id` (opcional), solo se guardan los parámetros de la vista de fachada, **no la imagen**; `capture_date` (si disponible), `road_direction` (`one_way | two_way | pedestrian | other`), `drop_off_notes`, `access_notes` (escalones, rampa, puerta), `text_description` (alternativa en texto completa), `fallback_photo` (opcional).

### procedures (trámites)
`id`, `name`, `process_type` (civil, penal, mercantil…), `legal_basis` (norma citada), `review_status` (a validar por Derecho).

### procedure_search_terms (para el buscador)
`procedure_id`, `term`, `kind` (`name | synonym | keyword | role`). Permite encontrar trámites por palabras habituales ("declarar", "testigo", "denuncia").

### Citación (no se guarda)
- **Ni el archivo ni el texto extraído se guardan** [P]. Se procesan en memoria y se descartan.
- Solo se conserva el resultado confirmado por la persona: el `procedure_id` y el `court_id` elegidos (en `user_cases`).
- El OCR se hace en nuestro servidor; el archivo temporal se borra al terminar, incluso si hay error.
- Opcional [?]: métrica anónima de aciertos (¿lo detectado coincidió con lo confirmado?), sin texto ni datos personales.

### user_cases (caso de la persona)
`id`, `owner_token_hash` (secreto del dispositivo de la persona), `user_id` (opcional, solo si hay cuenta), `procedure_id`, `court_id`, `source` (`search | citation`), `created_at`.
No guarda nombre, perfil ni adaptaciones.

### lawyer_links (enlace de vinculación)
`id`, `user_case_id`, `token_hash` (el token real solo se envía una vez), `created_at`, `expires_at`, `revoked_at`, `last_used_at`, `lawyer_name` y `lawyer_bar_number` (número de colegiado), rellenados por el abogado al abrir el enlace y **obligatorios** antes de poder añadir documentos [D]. Son **datos declarados, sin verificar** [D].
`expires_at` = `created_at` + 48 horas [D]. El enlace admite varios usos mientras esté vigente. `language` del enlace (`es | ca | eu | gl`).
Permite solo añadir/editar documentos de ese caso. No da acceso a `user_profiles` ni a otros casos.

### case_documents (documentos de un caso)
`id`, `user_case_id`, `name`, `kind` (`bring | receive`), `notes`, `added_by` (`catalog | lawyer | user`), `lawyer_link_id` (si lo añadió el abogado), `status` (`pending | accepted | edited | rejected`), `created_at`.
Son solo texto (nombre y nota); no se suben archivos. En la app se combinan con los `step_documents` del catálogo y se muestran separados.

### procedure_steps
`id`, `procedure_id`, `order`, `title`, `instructions`, `duration_min`, `expected_action`, `step_kind` (`arrival | access | wait | procedure | exit | other`), `shows_entrance` (bool: muestra Street View), `protocol_phrase`, `calm_tip`, `sensory_notes`.

### step_documents
`id`, `step_id`, `name`, `kind` (`bring | receive`), `notes`. Cubre "documentación y recursos iniciales" y "los que tendrás al salir".

### court_steps (particularización por juzgado)
`court_id`, `step_id`, `where_text` (dónde se hace en ese juzgado), `sensory_notes` (ej.: altavoz de avisos en la entrada), `override_instructions`.

### progreso del recorrido (en el dispositivo) [D]
La barra de progreso y el paso actual se guardan en el dispositivo, por caso (`user_case_id`, `current_step`, `completed_steps[]`, `updated_at`). No se guardan en el servidor salvo que haya cuenta.
Referencia de campos si se guardase en servidor (con cuenta): `user_id`, `procedure_id`, `court_id`, `current_step`, `updated_at`.

### translations (textos en cuatro idiomas) [P]
`entity` (`procedure | procedure_step | step_document | court | court_entrance | search_term`), `entity_id`, `field`, `language` (`es | ca | eu | gl`), `text`, `review_status` (`draft | reviewed`), `reviewed_by`.
Los campos de texto de las tablas anteriores (nombres, instrucciones, notas, descripciones) se guardan aquí por idioma. Si falta una traducción, la app muestra el español con aviso. Los términos de búsqueda y nombres de juzgado también van en los cuatro idiomas para reconocer citaciones en cualquier lengua.

## 3. Relaciones principales
```
courts 1─1 court_entrances
procedures 1─n procedure_steps 1─n step_documents
procedures 1─n procedure_search_terms
users 1─n user_cases n─1 procedures, courts
user_cases 1─n lawyer_links
user_cases 1─n case_documents
courts n─n procedure_steps   (court_steps)
users 1─1 user_profiles
```

## 4. Preguntas abiertas
- [ ] ¿Qué datos del acompañante se guardan, si los hay?
- [ ] Cómo recuperar el caso si se borran los datos del navegador (exportar / copiar un código) [?].
- [ ] Retención y borrado de datos del perfil.

> Modelo para el escaneo 3D (rooms, scans, stimuli en 3D): ver [Anexo-3D-Escaneo.md](Anexo-3D-Escaneo.md).
