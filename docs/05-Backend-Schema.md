# 05 · Backend Schema — Datos y autenticación

> Todo el esquema es una **propuesta [P]** derivada del flujo decidido. Revisar en equipo.
> Datos sintéticos únicamente. El perfil de neurodivergencia es dato sensible (RGPD) [V].

## 1. Autenticación y roles [P]
- Registro/acceso con correo y contraseña o enlace mágico [?].
- Sesiones con token seguro; la clave de KIRI Engine solo en servidor.
- Roles: `user`, `scanner` (encargado), `admin`. Cada rol ve solo lo necesario; la IA solo accede a lo permitido por rol y consentimiento.

## 2. Entidades

### users
`id`, `email`, `password_hash`, `role`, `created_at`, `consent_sensitive_data` (bool), `consent_at`.

### user_profiles (cuestionario de adaptación)
`user_id`, `language`, `font_size`, `reduced_motion`, `reduced_color`, `text_to_speech`, `screen_reader`, `neurodivergence_filters[]` (TEA, TDAH, dislexia, discalculia, disgrafía, otros). Todo editable y borrable por la persona.

### courts (juzgado/instalación)
`id`, `name`, `address`, `type`, `scan_status` (`none | processing | ready | error`), `published`.

### scans
`id`, `court_id`, `uploaded_by`, `video_file`, `kiri_job_id`, `status`, `model_file` (GLB), `error`, `created_at`.

### rooms (salas)
`id`, `court_id`, `name`, `description`, `functions`, `model_anchor` (posición/cámara en el 3D), `floor`.

### procedures (trámites)
`id`, `name`, `process_type` (civil, penal, mercantil…), `legal_basis` (norma citada), `review_status` (a validar por Derecho).

### procedure_steps
`id`, `procedure_id`, `order`, `title`, `instructions`, `duration_min`, `expected_action`, `room_function_required`, `protocol_phrase`, `calm_tip`.

### step_documents
`id`, `step_id`, `name`, `kind` (`bring` | `receive`), `notes`. Cubre "documentación y recursos iniciales" y "los que tendrás al salir".

### room_procedures
`room_id`, `procedure_id`: qué procesos se pueden hacer en cada sala.

### court_step_rooms
`court_id`, `step_id`, `room_id`: dónde ocurre cada paso en ese juzgado concreto (enlaza flujo y 3D).

### stimuli (estímulos estridentes)
`id`, `room_id`, `type` (`sound | light | crowd | smell | other`), `description` (ej.: altavoz en una esquina de la entrada por donde salen los avisos), `position` (en el 3D), `intensity`, `when` (siempre / en picos).

### user_progress (opcional) [?]
`user_id`, `procedure_id`, `court_id`, `current_step`, `updated_at`.

## 3. Relaciones principales
```
courts 1─n rooms 1─n stimuli
courts 1─n scans
procedures 1─n procedure_steps 1─n step_documents
rooms n─n procedures        (room_procedures)
courts+steps ─► rooms       (court_step_rooms)
users 1─1 user_profiles
```

## 4. Almacenamiento de archivos
Vídeos de entrada y modelos GLB en almacenamiento de objetos, con URL firmada y caducidad. Política de borrado del vídeo original tras generar el modelo [?].

## 5. Preguntas abiertas
- [?] ¿Qué datos de la persona acompañante se guardan?
- [?] ¿Se permite uso sin cuenta?
- [?] Retención y borrado de datos del perfil.
- [?] ¿Qué datos puede leer el chatbot?
