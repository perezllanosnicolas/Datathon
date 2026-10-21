# 03 · AppFlow — Flujos y navegación

> Leyenda: **[D]** decidido · **[P]** propuesta · **[?]** abierto.
> Pantallas pensadas para móvil, una cosa por pantalla.

## 1. Roles
- **Usuario** (persona neurodivergente o acompañante) [D].
- **Editor de contenido** (da de alta trámites, pasos y datos de cada juzgado, incluida la entrada) [P].

## 2. Flujo del usuario [D salvo indicación]
```
Inicio ─► Registro ─► Cuestionario de adaptación ─► Elegir trámite ─► Elegir juzgado
                                                                          │
                                                                          ▼
                                                      Diagrama de flujo interactivo
                                              (un paso cada vez; avanzar / repetir / saltar)
                                                                          │
                                       Paso N: qué hago · cuánto dura · qué llevo · qué me llevo
                                                                          │
                                                                          ▼
                                                    Resumen final (lista de documentos)
```

### 2.1 Registro y cuestionario
1. Cuenta (datos mínimos).
2. Cuestionario de adaptación: **idioma** y **tamaño de letra**.
3. Adaptaciones extra: **buscar y aplicar filtros por neurodivergencia** (TEA, TDAH, dislexia, discalculia, disgrafía, otras); también ceguera/baja visión (caso Juan) [P].
4. No se pide diagnóstico ni informes clínicos: la persona solo elige qué ajustes quiere [D].
5. Todo se puede cambiar después en Ajustes [P].

### 2.2 Trámite y juzgado [D]
Dos vías para llegar al mismo flujo:
```
                ┌─► A. Buscador con filtros ──────────────┐
Elegir trámite ─┤                                         ├─► Confirmar trámite y juzgado ─► Flujo
                └─► B. Subir citación ─► IA identifica ───┘
                         (PDF o foto)    trámite y pasos
```
**A. Buscador:** escribir o filtrar por tipo de proceso, trámite o juzgado; la lista se reduce al escribir; se elige un resultado.
**B. Citación:**
1. Explicar antes qué se hará con el documento y que se descarta [P].
2. Subir PDF o hacer foto.
3. Ver "Esto es lo que he entendido": trámite, juzgado, fecha, tu papel (testigo, parte…).
4. **Confirmar o corregir** cada dato. Nada continúa sin confirmación [P].
5. Si la IA no está segura o falla: mensaje claro y paso al buscador.
En ambas vías, el último paso es una pantalla de confirmación con el trámite y el juzgado.

### 2.3 Diagrama de flujo interactivo
Cada paso muestra [D]:
- Qué hay que hacer, con el máximo detalle (ir a recepción, registrarse, esperar el turno…).
- Documentación y recursos **iniciales** (qué llevar).
- Documentación y recursos que se tendrán **al salir**.
- Duración estimada y qué se espera de la persona [P].
- Aviso de estímulos de la zona en texto (ej.: altavoz de avisos en la entrada) [P].
- Apoyos: frase de protocolo, respiración, a quién preguntar [P].

### 2.4 Pasos de llegada con Street View [D]
Los primeros pasos (llegar al edificio, encontrar la entrada) incluyen:
- Vista **Street View** de la entrada.
- Texto con: sentido de la vía (doble sentido o no), dónde parar o aparcar, qué puerta usar, cómo es el acceso (escalón, rampa) [P].
- Alternativa solo texto para quien no puede o no quiere ver la imagen [P].

## 3. Flujo del editor de contenido [P]
```
Acceso ─► Crear/editar juzgado (dirección, coordenadas Street View, descripción de la entrada)
      ─► Crear/editar trámite y pasos (documentos de entrada y salida)
      ─► Revisión legal (Leyre / Carlos) ─► Publicar
```

## 4. Estados y casos límite [P]
- Sin cobertura de Street View: se muestra solo texto o foto.
- Citación ilegible, borrosa o de un trámite no incluido en el catálogo: se explica y se pasa al buscador.
- Sin resultados en el buscador: sugerir términos alternativos y permitir contactar con ayuda [P].
- La IA y la persona no coinciden: manda siempre lo que la persona confirma.
- Sin conexión o conexión lenta: texto primero, imágenes después.
- Usuario sin cuenta: ¿puede ver una demo? [?]

## 5. Mapa de pantallas
Inicio · Registro · Cuestionario · Ajustes · Buscar trámite/juzgado · Subir citación · Confirmar lo detectado · Confirmar trámite y juzgado · Flujo (mapa de progreso) · Detalle de paso · Vista de entrada (Street View) · Resumen · (Editor) Panel · Editar juzgado · Editar trámite.

## 6. Preguntas abiertas
- [ ] ¿El acompañante tiene cuenta propia?
- [ ] ¿Se guarda el progreso del usuario?
- [ ] ¿Cómo se verifica quién es editor de contenido?

> Escaneo 3D e inmersión: ver [Anexo-3D-Escaneo.md](Anexo-3D-Escaneo.md).
