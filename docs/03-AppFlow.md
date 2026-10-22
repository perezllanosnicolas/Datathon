# 03 · AppFlow — Flujos y navegación

> Leyenda: **[D]** decidido · **[P]** propuesta · **[?]** abierto.
> Pantallas pensadas para móvil, una cosa por pantalla.

## 1. Roles
- **Usuario** (persona neurodivergente o acompañante) [D].
- **Abogado/a** de la persona: acceso limitado por enlace, solo para indicar documentos a llevar [D].
- **Editor de contenido** (da de alta trámites, pasos y datos de cada juzgado, incluida la entrada) [P].

## 2. Flujo del usuario [D salvo indicación]
```
Inicio (sin registro) ─► Cuestionario de adaptación ─► Elegir trámite ─► Elegir juzgado
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

### 2.1 Cuestionario de adaptación (sin registro) [D]
1. **No hay registro ni cuenta.** Se puede empezar a usar la herramienta directamente. Las preferencias se guardan en el dispositivo.
2. Cuestionario de adaptación: **idioma** (español, catalán, euskera o gallego) [D] y **tamaño de letra**.
3. Adaptaciones extra: **buscar y aplicar filtros por neurodivergencia** (TEA, TDAH, dislexia, discalculia, disgrafía, otras); también ceguera/baja visión [P].
4. No se pide diagnóstico ni informes clínicos: la persona solo elige qué ajustes quiere [D].
5. Todo se puede cambiar después en Ajustes [P].

### 2.2 Trámite y juzgado [D]
Dos vías para llegar al mismo flujo:
```
                ┌─► A. Buscador con filtros ──────────────┐
Elegir trámite ─┤                                         ├─► Confirmar trámite y juzgado ─► Flujo
                └─► B. Subir citación ─► a texto ─► ───────┘
                         (PDF o foto)    extrae trámite y juzgado
```
**A. Buscador:** escribir o filtrar por tipo de proceso, trámite o juzgado; la lista se reduce al escribir; se elige un resultado.
**B. Citación:**
1. Explicar antes qué se hará con el documento y que se descarta [P].
2. Subir PDF o hacer foto.
3. La app pasa el documento a texto y busca en él el trámite y el juzgado.
4. Ver "Esto es lo que he leído": trámite y juzgado (y fecha, si aparece).
5. **Confirmar o corregir** cada dato. Nada continúa sin confirmación [P].
6. Si no se reconoce algo o la lectura falla: mensaje claro y paso al buscador con lo detectado ya relleno.
En ambas vías, el último paso es una pantalla de confirmación con el trámite y el juzgado.

### 2.2b Vincular con mi abogado/a [D la funcionalidad, P el detalle]
1. En el trámite, botón "Invitar a mi abogado/a".
2. Explicación breve: qué podrá hacer (solo indicar documentos a llevar) y qué no verá (tus datos y ajustes).
3. Generar enlace: copiar o compartir con el menú del móvil (la app no envía correos [D]).
4. Estado visible: "Enlace enviado · válido 48 horas, hasta el… · Revocar". Cuando caduca, se puede crear otro.
5. Cuando el abogado añade documentos, aviso en la app: "Tu abogado/a ha añadido 2 documentos".
6. Los documentos aparecen en el paso de documentos, marcados "Añadido por tu abogado/a" con su nombre y número de colegiado (aviso: "datos no comprobados"). La persona puede aceptar, editar o borrar.

**Flujo del abogado (sin diseño de cuenta aún):**
```
Abre el enlace ─► escribe su nombre y su número de colegiado (obligatorio)
   ─► ve el trámite y el juzgado (sin datos personales)
   ─► añade documentos: nombre + nota + si hay que llevarlo o se recibirá
   ─► guarda ─► ve una confirmación
```

### 2.3 Diagrama de flujo interactivo
Cada paso muestra [D]:
- Qué hay que hacer, con el máximo detalle (ir a recepción, registrarse, esperar el turno…).
- Documentación y recursos **iniciales** (qué llevar).
- Documentación y recursos que se tendrán **al salir**.
- Duración estimada y qué se espera de la persona [P].
- Aviso de estímulos de la zona en texto (ej.: altavoz de avisos en la entrada) [P].
- Apoyos: frase de protocolo, respiración, a quién preguntar [P].

### 2.3a Asistente "Pregúntame" (opcional, ALIA-40B) [P]
En cada paso, un botón "Tengo una duda" abre un asistente en el idioma de la persona. Responde en lenguaje simple y solo con el contenido del trámite; si no sabe, lo dice. Muestra un aviso: "No es asesoramiento legal". Si no está disponible, el botón se oculta y el paso se ve igual. No pide datos personales.

### 2.3b Barra de progreso [D]
En todas las pantallas de paso hay una **barra de progreso** que dice cuántos pasos has hecho y cuántos quedan.
- Texto siempre visible, en lenguaje simple: **"Paso 3 de 12 · Has hecho 2 · Te quedan 9"**.
- Se puede agrupar por fases (Llegada · Espera · Trámite · Salida) con el total de cada una [P].
- El progreso se guarda en el dispositivo; al volver, la app lleva al último paso [D].
- Al terminar: "Has completado todos los pasos" y el resumen.
- Si el número de pasos cambia (por ejemplo, el abogado añade documentos), el total se recalcula y la app lo dice [P].
- Si hay pasos opcionales o que se saltan, se cuentan aparte para no dar una cifra equivocada [P].
- Se puede ir atrás sin perder lo hecho; los pasos saltados quedan marcados como "saltado" [P].

### 2.4 Pasos de llegada con la fachada [D]
Los primeros pasos (llegar al edificio, encontrar la entrada) incluyen:
- **Imagen de la fachada** (Street View, solo la fachada, imagen fija).
- Texto con: sentido de la vía (doble sentido o no), dónde parar o aparcar, qué puerta usar, cómo es el acceso (escalón, rampa) [P].
- Alternativa solo texto para quien no puede o no quiere ver la imagen [P].

## 3. Flujo del editor de contenido [P]
```
Acceso ─► Crear/editar juzgado (dirección, coordenadas Street View, descripción de la entrada)
      ─► Crear/editar trámite y pasos (documentos de entrada y salida)
      ─► Publicar
```

## 4. Estados y casos límite [P]
- Sin cobertura de Street View: se muestra solo texto o foto.
- Citación ilegible, borrosa o de un trámite no incluido en el catálogo: se explica y se pasa al buscador.
- Sin resultados en el buscador: sugerir términos alternativos y permitir contactar con ayuda [P].
- El texto extraído apunta a más de un trámite o juzgado: se muestran las opciones y la persona elige.
- Enlace caducado, revocado o ya usado: mensaje claro al abogado; la persona puede generar otro.
- El abogado añade un documento que la persona no quiere: puede borrarlo.
- Sin conexión o conexión lenta: texto primero, imágenes después.
- Se borran los datos del navegador: se pierde el perfil y el progreso; la app ofrece volver a hacer el cuestionario y avisa antes (y permite exportar) [P].
- Documentos nuevos del abogado: se detectan al abrir la app o la pantalla de documentos; no hay avisos por correo [D].

## 5. Mapa de pantallas
Inicio · Cuestionario · Ajustes · Buscar trámite/juzgado · Subir citación · Confirmar lo detectado · Invitar a mi abogado/a · (Abogado) Añadir documentos · Confirmar trámite y juzgado · Flujo (mapa de progreso) · Detalle de paso · Vista de entrada (Street View) · Resumen · (Editor) Panel · Editar juzgado · Editar trámite.

## 6. Preguntas abiertas
- [ ] ¿Cómo participa el acompañante, si no hay cuentas? (compartir el mismo dispositivo o el mismo caso) [?]
- [ ] ¿Cómo se verifica quién es editor de contenido?

> Escaneo 3D e inmersión: ver [Anexo-3D-Escaneo.md](Anexo-3D-Escaneo.md).
