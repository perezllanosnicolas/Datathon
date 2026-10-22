# 03 · AppFlow — Flujos y navegación

> Leyenda: **[D]** decidido · **[P]** propuesta · **[?]** abierto.
> Pantallas pensadas para móvil, una cosa por pantalla.
> **Estado (2026-10-22):** el flujo está implementado en el prototipo SimuLex. Entre paréntesis, la ruta de cada pantalla en `web/src/app/`. En la interfaz se dice «sede judicial»; en estos documentos se mantiene «juzgado».

## 1. Roles
- **Usuario** (persona neurodivergente o acompañante) [D].
- **Abogado/a** de la persona: acceso limitado por enlace, solo para indicar documentos a llevar [D].
- **Editor de contenido** (da de alta trámites, pasos y datos de cada juzgado, incluida la entrada) [P]. En el prototipo no hay pantalla: se editan los JSON de `web/data/catalog/`.

## 2. Flujo del usuario [D]
```
Inicio (/) ─► Cuestionario (/cuestionario) ─► Elegir (/elegir)
                                                │
                     ┌──────────────────────────┴──────────────────────────┐
                     ▼                                                     ▼
       Subir la citación (/citacion)                          Buscador (/buscar)
       a texto ─► trámite y sede ─► la persona confirma        ─► Confirmar (/confirmar)
                     │                                                     │
                     └──────────────────────────┬──────────────────────────┘
                                                ▼
                              Flujo de pasos (/caso/[id])
                    un paso cada vez · barra de progreso · mapa de pasos
                    Paso N: qué hago · cuánto dura · qué llevo · qué me llevo
                                                │
                                                ▼
                       Resumen y lista de documentos (/caso/[id]/resumen)
```
Al volver, el inicio muestra los casos guardados en el dispositivo para seguir donde se dejó.

### 2.1 Cuestionario de adaptación (sin registro) [D]
1. **No hay registro ni cuenta.** Las preferencias se guardan en el dispositivo.
2. Primero el **idioma** (español, catalán, euskera o gallego).
3. Después las **adaptaciones**: tamaño de letra (6 niveles con un slider), tipo de letra (la de la app, una más fácil de leer u OpenDyslexic), menos movimiento, colores tranquilos, alto contraste, leer en voz alta (activado por defecto), dictado por voz y tipo de imagen por paso (pictogramas, fotos o ninguna). También está la opción «No quiero ninguna adaptación».
4. Al final, **«Más filtros»** por neurodivergencia (TEA, TDAH, dislexia, discalculia, disgrafía, baja visión, otras): al marcar una se activan las adaptaciones que suelen ayudar; al quitarla se desactivan, salvo las que pida otra marcada.
5. No se pide diagnóstico ni informes clínicos: la persona solo elige qué ajustes quiere [D].
6. Todo se puede cambiar después en **Ajustes** (`/ajustes`), con una barra fija «Guardar y volver al inicio» y la opción «Borrar todo».

### 2.2 Trámite y juzgado [D]
Dos vías para llegar al mismo flujo. En «Elegir», **subir la citación va primero**, en un cuadro azul destacado; el buscador va después:
```
          ┌─► A. Subir citación ─► a texto ─► extrae trámite y sede ─► confirmar ─┐
Elegir ───┤                                                                      ├─► Flujo
          └─► B. Buscador con filtros ─► Confirmar trámite y sede ───────────────┘
```
**A. Buscador:** escribir o filtrar por trámite o sede; la lista se reduce al escribir; busca en los cuatro idiomas y sin tener en cuenta las tildes; se elige un resultado.
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
Cada paso muestra [D, implementado]:
- Qué se espera de la persona, en una frase, y qué hay que hacer, con el máximo detalle (ir a recepción, registrarse, esperar el turno…).
- Documentación y recursos **iniciales** (qué llevar) y los que se tendrán **al salir**.
- Duración estimada («¿Cuánto dura?», con mínimo y máximo).
- Aviso de estímulos de la zona en texto (ej.: altavoz de avisos en la entrada).
- Apoyos: frase para hablar con el personal, técnica de calma, a quién preguntar y una nota legal con la norma citada.
- Una imagen del paso (pictograma de ARASAAC o foto, según los ajustes).
- Botón de leer en voz alta, fijo arriba a la derecha junto a la barra de progreso.
- Arriba, bajo la barra de progreso: «Volver al primer paso» y «Saltar este paso».

Tipos de paso: preparar, llegar, entrar, esperar, trámite y salir. Antes de ir al juzgado hay pasos de preparación (por ejemplo, leer la demanda o buscar abogado).

### 2.3a Asistente "Pregúntame" (opcional, ALIA-40B) [P, no implementado]
En cada paso, un botón "Tengo una duda" abre un asistente en el idioma de la persona. Responde en lenguaje simple y solo con el contenido del trámite; si no sabe, lo dice. Muestra un aviso: "No es asesoramiento legal". Si no está disponible, el botón se oculta y el paso se ve igual. No pide datos personales.

### 2.3b Barra de progreso [D, implementada]
En todas las pantallas de paso hay una **barra de progreso** que dice cuántos pasos has hecho y cuántos quedan.
- Texto siempre visible, en lenguaje simple: **"Paso 3 de 12 · Has hecho 2 · Te quedan 9"**.
- Agrupada por fases (Llegada · Espera · Trámite · Salida). Encima, un **mapa de pasos** desplegable: cerrado por defecto y abierto solo la primera vez.
- El progreso se guarda en el dispositivo; al volver, la app lleva al último paso [D].
- Al terminar: "Has completado todos los pasos" y el resumen.
- Si el número de pasos cambia (por ejemplo, el abogado añade documentos), el total se recalcula y la app lo dice [P].
- Si hay pasos opcionales o que se saltan, se cuentan aparte para no dar una cifra equivocada [P].
- Se puede ir atrás sin perder lo hecho; los pasos saltados quedan marcados como "saltado" [P].

### 2.4 Pasos de llegada con la fachada [D]
Los primeros pasos (llegar al edificio, encontrar la entrada) incluyen:
- **Foto fija de la fachada** de la sede judicial (Wikimedia Commons, con autoría y licencia). Street View queda como opción futura.
- Texto con: sentido de la vía, dónde parar o aparcar, qué puerta usar, cómo es el acceso (escalón, rampa).
- Alternativa en texto para quien no puede o no quiere ver la imagen.

### 2.5 Glosario [D]
«Palabras difíciles» (`/glosario`): 39 términos legales explicados, en orden alfabético y con buscador. Se abre desde cualquier pantalla.

## 3. Flujo del editor de contenido [P, no implementado]
En el prototipo, el contenido se edita en los JSON de `web/data/catalog/` (ver [05 §5](05-Backend-Schema.md)). Flujo previsto si se añade un panel:
```
Acceso ─► Crear/editar juzgado (dirección, foto de la fachada, descripción de la entrada)
      ─► Crear/editar trámite y pasos (documentos de entrada y salida)
      ─► Publicar
```

## 4. Estados y casos límite [P]
- Sin foto de la fachada: se muestra solo el texto de la entrada.
- Citación ilegible, borrosa o de un trámite no incluido en el catálogo: se explica y se pasa al buscador.
- Sin resultados en el buscador: sugerir términos alternativos y permitir contactar con ayuda [P].
- El texto extraído apunta a más de un trámite o juzgado: se muestran las opciones y la persona elige.
- Enlace caducado, revocado o ya usado: mensaje claro al abogado; la persona puede generar otro.
- El abogado añade un documento que la persona no quiere: puede borrarlo.
- Sin conexión o conexión lenta: texto primero, imágenes después.
- Se borran los datos del navegador: se pierde el perfil y el progreso; la app ofrece volver a hacer el cuestionario y avisa antes [P].
- Documentos nuevos del abogado: se detectan al abrir la app o la pantalla de documentos; no hay avisos por correo [D].

## 5. Mapa de pantallas
| Pantalla | Ruta | Estado |
|---|---|---|
| Inicio (y casos guardados) | `/` | Hecha |
| Cuestionario | `/cuestionario` | Hecha |
| Ajustes | `/ajustes` | Hecha |
| Elegir: subir citación o buscar | `/elegir` | Hecha |
| Subir citación y confirmar lo detectado | `/citacion` | Hecha |
| Buscar trámite y sede | `/buscar` | Hecha |
| Confirmar trámite y sede | `/confirmar` | Hecha |
| Flujo de pasos (con fachada, mapa y barra de progreso) | `/caso/[id]` | Hecha |
| Resumen y lista de documentos | `/caso/[id]/resumen` | Hecha |
| Invitar a mi abogado/a | `/caso/[id]/abogado` | Hecha |
| (Abogado/a) Añadir documentos | `/abogado/[token]` | Hecha |
| Glosario | `/glosario` | Hecha |
| (Editor) Panel, editar juzgado, editar trámite | — | No implementada |

## 6. Preguntas abiertas
- [ ] ¿Cómo participa el acompañante, si no hay cuentas? (compartir el mismo dispositivo o el mismo caso) [?]
- [ ] ¿Cómo se verifica quién es editor de contenido?

> Escaneo 3D e inmersión: ver [Anexo-3D-Escaneo.md](Anexo-3D-Escaneo.md).
