# 05 · Backend Schema — Datos y autenticación

> Todo el esquema es una **propuesta [P]** derivada del flujo decidido. Revisar en equipo.
> Datos sintéticos únicamente. **No se almacena documentación clínica ni diagnósticos** [D].
> El perfil de adaptaciones sigue siendo dato sensible (RGPD) [V].

## 1. Autenticación y roles [P]
- Registro/acceso con correo y contraseña o enlace mágico [?].
- Roles: `user` y `editor` (contenido). Cada rol ve solo lo necesario.
- Sesiones con token seguro. Claves de servicios externos solo en el servidor.

## 2. Entidades

### users
`id`, `email`, `password_hash`, `role`, `created_at`, `consent_at`.

### user_profiles (cuestionario de adaptación)
`user_id`, `language`, `font_size`, `reduced_motion`, `reduced_color`, `text_to_speech`, `screen_reader`, `adaptation_filters[]` (TEA, TDAH, dislexia, discalculia, disgrafía, ceguera/baja visión, otros).
Son **preferencias elegidas por la persona**, no un diagnóstico. Editable y borrable.

### courts (juzgado)
`id`, `name`, `address`, `process_types[]`, `published`.

### court_entrances (entrada del edificio, para Street View)
`court_id`, `lat`, `lng`, `heading`, `pitch`, `zoom`, `street_view_pano_id` (opcional), `capture_date` (si disponible), `road_direction` (`one_way | two_way | pedestrian | other`), `drop_off_notes`, `access_notes` (escalones, rampa, puerta), `text_description` (alternativa en texto completa), `fallback_photo` (opcional).

### procedures (trámites)
`id`, `name`, `process_type` (civil, penal, mercantil…), `legal_basis` (norma citada), `review_status` (a validar por Derecho).

### procedure_search_terms (para el buscador)
`procedure_id`, `term`, `kind` (`name | synonym | keyword | role`). Permite encontrar trámites por palabras habituales ("declarar", "testigo", "denuncia").

### citation_analyses (resultado de analizar una citación)
`id`, `user_id`, `created_at`, `detected_court`, `detected_process_type`, `detected_date`, `detected_role` (testigo, parte, acusado…), `matched_procedure_id`, `confidence`, `confirmed_by_user` (bool), `corrected_fields`.
- **El archivo de la citación no se guarda** [P]. Se procesa y se descarta.
- Este registro se guarda **solo si la persona lo acepta** y sin nombre ni número de procedimiento; si no, se elimina al terminar la sesión [P, a validar].
- Útil para saber qué tan bien acierta la IA y mejorar el catálogo (sin datos personales).

### procedure_steps
`id`, `procedure_id`, `order`, `title`, `instructions`, `duration_min`, `expected_action`, `step_kind` (`arrival | access | wait | procedure | exit | other`), `shows_entrance` (bool: muestra Street View), `protocol_phrase`, `calm_tip`, `sensory_notes`.

### step_documents
`id`, `step_id`, `name`, `kind` (`bring | receive`), `notes`. Cubre "documentación y recursos iniciales" y "los que tendrás al salir".

### court_steps (particularización por juzgado)
`court_id`, `step_id`, `where_text` (dónde se hace en ese juzgado), `sensory_notes` (ej.: altavoz de avisos en la entrada), `override_instructions`.

### user_progress (opcional) [?]
`user_id`, `procedure_id`, `court_id`, `current_step`, `updated_at`.

## 3. Relaciones principales
```
courts 1─1 court_entrances
procedures 1─n procedure_steps 1─n step_documents
procedures 1─n procedure_search_terms
citation_analyses n─1 procedures   (trámite identificado)
courts n─n procedure_steps   (court_steps)
users 1─1 user_profiles
```

## 4. Preguntas abiertas
- [ ] ¿Qué datos del acompañante se guardan, si los hay?
- [ ] ¿Se permite uso sin cuenta?
- [ ] Retención y borrado de datos del perfil.

> Modelo para el escaneo 3D (rooms, scans, stimuli en 3D): ver [Anexo-3D-Escaneo.md](Anexo-3D-Escaneo.md).
