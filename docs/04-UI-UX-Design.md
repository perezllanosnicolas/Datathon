# 04 · UI/UX Design — Brief de diseño

> Leyenda: **[D]** decidido · **[P]** propuesta · **[?]** abierto.

## 1. Principios [D] (de CLAUDE.md)
Accesibilidad cognitiva primero · baja carga sensorial · anticipación · lector de pantalla · control para la persona · tipografía legible · lenguaje claro y literal, sin metáforas.

## 2. Móvil primero [D]
- Diseño pensado para pantalla pequeña y uso con una mano.
- Una acción principal por pantalla; botón principal abajo, al alcance del pulgar [P].
- Objetivos táctiles de al menos 44×44 px [P].
- Sin gestos obligatorios: todo con botones visibles.

## 3. Personalización [D, implementada]
En el cuestionario y en Ajustes se eligen primero las **adaptaciones** y al final aparece «Más filtros» (neurodivergencias).

| Ajuste | Opciones en el prototipo |
|---|---|
| Idioma | español, catalán, euskera, gallego |
| Tamaño de letra | slider de 6 niveles, de «Pequeña» a «Máxima» (16–36 px) |
| Tipo de letra | la de la app · «Letra más fácil de leer» (Atkinson Hyperlegible) · OpenDyslexic |
| Movimiento | menos movimiento (además respeta la preferencia del sistema) |
| Color | colores tranquilos · alto contraste |
| Voz | leer en voz alta (activado por defecto) · dictado por voz en los campos de texto |
| Imágenes por paso | pictogramas de ARASAAC · fotos · ninguna |
| Sin adaptaciones | «No quiero ninguna adaptación» |
| Más filtros (neurodivergencia) | TEA (Trastorno del Espectro Autista), TDAH, dislexia, discalculia, disgrafía, baja visión, otras. Combinables. Al marcar una se activan sus adaptaciones; al quitarla se desactivan, salvo las que pida otra marcada |

Filtros orientativos [P, validar con Cristina y asociaciones]:
- **TEA:** anticipación máxima, avisos sensoriales, lenguaje literal, pocas elecciones por pantalla.
- **TDAH:** pasos cortos, una cosa por pantalla, progreso visible, recordatorios.
- **Dislexia:** fuente legible, mayor interlineado, texto a voz.
- **Discalculia:** horas y cifras con apoyo visual y texto.
- **Disgrafía:** minimizar escritura; opciones en vez de texto libre.
- **Ceguera/baja visión:** operable con lector de pantalla y teclado; alternativa en texto de toda imagen. El lector de pantalla debe leer en el idioma correcto: marcar el idioma de cada página y de los textos mezclados (`lang="es|ca|eu|gl"`) [P].

La persona elige sus ajustes; la app no pide ni guarda diagnósticos [D].

## 4. Estilo visual [D, provisional]
- **Marca:** SimuLex, con la pieza de puzle en verde azulado (`#0f7d7c`) en la cabecera, el pie y el icono de la pestaña (`web/src/app/icon.svg`).
- **Roles del color:** verde = bueno, siguiente o hecho (botón principal, pasos hechos, opción elegida); azul = información y acción destacada (por ejemplo, subir la citación); ámbar = aviso. El color nunca va solo: siempre hay texto o icono.
- Paleta tranquila y con contraste de texto WCAG AA o superior; modos «colores tranquilos» y «alto contraste».
- Modo sin movimiento, que respeta también la preferencia del sistema.
- Sin animaciones intrusivas, parpadeos ni sonidos automáticos (la lectura en voz alta empieza solo al pulsar).
- Iconos y pictogramas siempre con texto. Las fotos por paso son ilustrativas.
- **Pie de página:** nombre de la app, aviso de que **no es una web oficial**, logotipos (Ministerio, URJC, UDC) y créditos de fotos y pictogramas. Falta el permiso de uso de los logotipos [?].
- `design-taste-frontend` y `web-design-guidelines` pueden orientar y revisar. Revisar antes el código de `design-taste-frontend` (alerta de seguridad).

## 5. Tipografía [D, provisional]
Sans-serif legible, interlineado holgado, alineación a la izquierda, bloques cortos, sin justificar ni mayúsculas continuas. La persona puede cambiar a Atkinson Hyperlegible u OpenDyslexic (ver §3).

## 6. Componentes clave [P]
- **Tarjeta de paso:** título, qué hago, duración, qué llevo, qué me llevo, aviso sensorial.
- **Barra de progreso [D]:** fija en la parte superior de cada paso. Muestra una barra y, siempre, el texto "Paso 3 de 12 · Te quedan 9". Reglas [P]:
  - El texto es lo principal; la barra es apoyo visual (no depende solo del color: lleva marcas o relleno con contraste ≥ 3:1).
  - Accesible: elemento `progress` o `role="progressbar"` con `aria-valuenow`, `aria-valuemin`, `aria-valuemax` y `aria-valuetext` ("Paso 3 de 12, quedan 9"); se anuncia al cambiar de paso.
  - Sin animaciones; con "sin movimiento" el relleno cambia de golpe. Fuente al menos de tamaño normal y con el tamaño de letra elegido.
  - Por fases (Llegada · Espera · Trámite · Salida) con la fase actual destacada.
  - Encima hay un mapa de pasos desplegable (`FlowMap`) con los pasos hechos, el actual y los pendientes.
  - El botón de leer en voz alta va fijo arriba a la derecha, junto a la barra (solo icono; pulsar lee, volver a pulsar para).
- **Diagrama de flujo interactivo:** un paso a la vez, barra y mapa de pasos arriba; «Volver al primer paso» y «Saltar este paso» bajo la barra; Anterior / Siguiente abajo.
- **Fachada (foto fija de la sede judicial) [D]:** una imagen fija con texto debajo (sentido de la vía, puerta, acceso). Sin giro ni movimiento. Texto alternativo completo y crédito de la foto (autoría y licencia de Wikimedia Commons). Si en el futuro se usa Street View, habrá que mostrar «Imagen de Google Street View» y la fecha [V].
- **Siglas:** cuando aparece una sigla (TDAH, DNI, NIE, artículos de la LEC) se escribe su significado entre paréntesis, en los 4 idiomas. Los títulos que son preguntas llevan signos de interrogación («¿Qué haces?», «¿Cuánto dura?»).
- **Asistente "Tengo una duda" (ALIA-40B, opcional) [P, no implementado]:** ventana simple, pregunta corta, respuesta corta en lenguaje simple y en el idioma elegido, aviso "No es asesoramiento legal". Sin animaciones de escritura que cansen: la respuesta aparece entera. Indicar claramente que es una IA y que puede equivocarse. Botón "Hablar con una persona" que muestra a quién preguntar.
- **Buscador:** campo grande con etiqueta visible, filtros como botones, resultados en lista corta, mensaje claro si no hay resultados. Sin autocompletado que salte ni cambie la pantalla.
- **Subida de citación:** explicación previa (qué se hace y que se descarta), botón "Hacer foto" y botón "Elegir archivo", indicador de progreso en texto, y pantalla "Esto es lo que he entendido" con cada dato editable y un botón "Es correcto / Corregir". Nunca avanza sola.
- **Estado de la lectura:** texto claro ("Estoy leyendo tu citación"), sin animaciones que parpadeen; aviso de que puede equivocarse. Si falla, mensaje y botón "Buscar yo el trámite".
- **Invitar a mi abogado/a:** botón en la pantalla de documentos; explicación corta de qué verá y qué no; enlace con botones "Copiar" y "Compartir"; estado "Enviado · caduca el… · Revocar".
- **Documentos del abogado:** etiqueta "Añadido por tu abogado/a" (texto, no solo color), botones Aceptar / Editar / Borrar; aviso al llegar nuevos documentos.
- **Pantalla del abogado:** muy simple, en una columna; primero nombre y número de colegiado, después formulario de documento (nombre y nota); sin acceso a más datos; confirmación clara al guardar.
- **Lista de documentos** con casillas (llevar / recibir).
- **Aviso sensorial:** icono + texto.
- **Panel de ajustes** accesible desde cualquier pantalla.
- **Mensajes de error** claros, sin culpar a la persona.

## 7. Accesibilidad técnica [D/P]
HTML semántico, etiquetas y texto alternativo (descripción completa de cada foto de fachada y de cada imagen de paso), orden de foco lógico, `aria-live` al cambiar de paso, sin límites de tiempo, navegación por teclado y lector de pantalla móvil.

## 8. Lenguaje simple [D]
Todo el texto de la app usa el lenguaje más sencillo posible. Se aplica a trámites, pasos, avisos, errores, ajustes y a la pantalla del abogado. Reglas [P, ajustar con Cristina y el equipo de Derecho]:
- **Frases cortas:** una idea por frase, unas 15 palabras como máximo.
- **Palabras de uso diario.** Evitar tecnicismos, siglas y metáforas. Si hay que usar un término legal, escribirlo y explicarlo al lado en una frase: *"Citación: aviso que dice cuándo y dónde tienes que ir."*
- **Verbos concretos y voz activa:** "Lleva tu DNI", no "Deberá ser aportado el documento nacional de identidad".
- **Un mismo término para la misma cosa.** En la interfaz se dice siempre **«sede judicial»** (ca «seu judicial», gl «sede xudicial», eu «epaitegi-egoitza»); no alternar con "juzgado" ni "tribunal". Se dice «idioma» (no «lengua») y «neurodivergencia» (nunca «discapacidad»).
- **Números y horas claros:** "a las 10:00", "unos 20 minutos".
- **Qué se espera de la persona** al principio de cada paso, en una frase.
- **Mensajes de error sin culpa:** qué ha pasado y qué hacer ahora.
- **Orden:** primero lo más importante; listas cortas mejor que párrafos.
- **Glosario** accesible desde cualquier pantalla con los términos legales explicados [P]. En el prototipo tiene buscador con filtro y orden alfabético [P].
- **Comprobación:** revisar los textos con un índice de legibilidad para español (ej.: Fernández-Huerta o INFLESZ) y, sobre todo, con personas reales y asociaciones [?]. Seguir las pautas de lectura fácil (UNE 153101 EX) como referencia [V]. Tomar como referencia de estilo los materiales de **Plena inclusión** (https://www.plenainclusion.org/que-es-la-lectura-facil/) y del Centro Español de Accesibilidad Cognitiva (https://www.ceacog.es/) [P]. Las reglas valen en los cuatro idiomas de la app.
- Los textos de la **citación** y las listas del **abogado** se muestran tal cual, pero la app añade al lado una explicación simple del término cuando es posible [P].
- Si simplificar cambia el sentido legal, manda el sentido legal y se explica mejor.

## 9. Pendiente
- [ ] Wireframes móviles por pantalla del AppFlow.
- [ ] Pruebas con personas neurodivergentes o asociaciones.
- [x] Nombre y logotipo: **SimuLex** con la pieza de puzle (provisional, a confirmar por el equipo).
- [ ] Permiso de uso de los logotipos oficiales y de las universidades; archivo de mejor calidad del logotipo de la UDC.
- [ ] Confirmar autoría y derechos de las fotos de `Assets/`.
- [ ] Auditoría con `web-design-guidelines` y prueba con lector de pantalla en el móvil.
