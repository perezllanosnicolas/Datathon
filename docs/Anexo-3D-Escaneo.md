# Anexo · Escaneo 3D y experiencia inmersiva (futuro extra)

> **[D]** Esta funcionalidad es un extra futuro, fuera del núcleo del prototipo. Se conserva aquí lo ya pensado para no perderlo.

## Idea
El juzgado se escanea con un vídeo enviado por llamada API a **KIRI Engine**, que genera un objeto 3D. Con él se ofrece una vista inmersiva por paso para familiarizarse.

## Rol de escaneo (encargado del juzgado)
```
Acceso ─► Elegir/crear juzgado ─► Subir vídeo ─► (API KIRI Engine) ─► Modelo 3D listo
      ─► Definir salas: funciones y procesos posibles en cada una
      ─► Marcar salas con estímulos estridentes (ej.: altavoz en una esquina de la entrada)
      ─► Revisar y publicar
```

## Modelo de datos adicional [P]
- `scans`: `id`, `court_id`, `uploaded_by`, `video_file`, `kiri_job_id`, `status`, `model_file` (GLB), `error`.
- `rooms`: `id`, `court_id`, `name`, `description`, `functions`, `model_anchor`, `floor`.
- `room_procedures`: `room_id`, `procedure_id`.
- `court_step_rooms`: `court_id`, `step_id`, `room_id`.
- `stimuli`: `id`, `room_id`, `type` (`sound | light | crowd | smell | other`), `description`, `position`, `intensity`, `when`.
- `courts.scan_status`: `none | processing | ready | error`.

## Notas técnicas [P]
- Visor con three.js y modelos GLB optimizados para móvil.
- Procesado asíncrono: subir vídeo, consultar estado, guardar resultado.
- Alternativa sin 3D en cada paso (ya cubierta por el núcleo).
- Clave de API de KIRI solo en servidor.
- Por comprobar: endpoints, límites de vídeo, precio, formatos y licencia de KIRI Engine.
- Privacidad: grabar sin público; no exponer personas en el vídeo [V].

## Preguntas abiertas
- [ ] ¿Qué adaptaciones necesita cada neurodivergencia en el 3D?
- [ ] ¿Preguntar dentro de la experiencia resulta violento?
- [ ] ¿Quién puede ser encargado de escaneo y cómo se verifica?
- [ ] Rendimiento del 3D en móviles de gama baja.
