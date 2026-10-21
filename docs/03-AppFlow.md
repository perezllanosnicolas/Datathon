# 03 · AppFlow — Flujos y navegación

> Leyenda: **[D]** decidido · **[P]** propuesta · **[?]** abierto.

## 1. Roles
- **Usuario** (persona neurodivergente o acompañante) [D].
- **Encargado de escaneo** del juzgado/instalación [D].
- **Administración** (valida juzgados y trámites) [P].

## 2. Flujo del usuario [D salvo indicación]
```
Inicio ─► Registro ─► Cuestionario de adaptación ─► Elegir trámite ─► Elegir juzgado
                                                                          │
                                         ┌────────────────────────────────┘
                                         ▼
                              Diagrama de flujo interactivo
                         (un paso cada vez; avanzar / repetir / saltar)
                                         │
                      Paso N: qué hago · cuánto dura · qué llevo · qué me llevo
                                         │
                       ¿Juzgado escaneado? ── Sí ─► Vista inmersiva 3D del paso
                                         │ No ─► Imágenes / texto / pictogramas
                                         ▼
                                   Resumen final (lista de documentos)
```

### 2.1 Registro y cuestionario
1. Cuenta (datos mínimos).
2. Cuestionario de adaptación: **idioma**, **tamaño de letra**.
3. Adaptaciones extra: **buscar y aplicar filtros por neurodivergencia** (TEA, TDAH, dislexia, discalculia, disgrafía, otras) [D]; también ceguera/baja visión (caso Juan) [P].
4. Todo se puede cambiar después en Ajustes [P].

### 2.2 Trámite y juzgado
- Elegir tipo de trámite y juzgado. Si el juzgado no está escaneado, se indica antes de continuar [P].

### 2.3 Diagrama de flujo interactivo
Cada paso muestra [D]:
- Qué hay que hacer, con el máximo detalle (ir a recepción, registrarse, esperar el turno…).
- Documentación y recursos **iniciales** (qué llevar).
- Documentación y recursos que se tendrán **al salir**.
- Duración estimada [P] y qué se espera de la persona [P].
- Aviso de estímulos estridentes de esa zona (ej.: altavoz de la entrada) [D].
- Apoyos: frase de protocolo, respiración, a quién preguntar [P].

### 2.4 Vista inmersiva
- Se abre desde un paso y muestra la sala correspondiente [D].
- Controles: moverse, volver a la entrada, pausar, salir [P].
- Ruta a una sala, paso a paso o en vídeo automático [P].

## 3. Flujo del encargado de escaneo [D]
```
Acceso ─► Elegir/crear juzgado ─► Subir vídeo ─► (API KIRI Engine) ─► Modelo 3D listo
      ─► Definir salas: funciones y procesos posibles en cada una
      ─► Marcar salas con estímulos estridentes (qué, dónde, cuándo)
      ─► Revisar y publicar
```

## 4. Estados y casos límite [P]
- Modelo en proceso o con error: el usuario ve la versión sin 3D.
- Sin conexión o conexión lenta: opción de versión ligera.
- Usuario sin cuenta: ¿puede ver una demo? [?]
- Acceso por QR a un trámite o sala concretos [?].

## 5. Mapa de pantallas
Inicio · Registro · Cuestionario · Ajustes · Elegir trámite · Elegir juzgado · Flujo · Detalle de paso · Visor 3D · Resumen · (Encargado) Panel · Subida · Anotar salas · Publicar.

## 6. Preguntas abiertas
- [?] ¿El acompañante tiene cuenta propia?
- [?] ¿Se guarda el progreso del usuario?
- [?] ¿Dónde se permite preguntar (chatbot) sin resultar violento?
