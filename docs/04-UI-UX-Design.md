# 04 · UI/UX Design — Brief de diseño

> Leyenda: **[D]** decidido · **[P]** propuesta · **[?]** abierto.

## 1. Principios [D] (de CLAUDE.md)
Accesibilidad cognitiva primero · baja carga sensorial · anticipación · lector de pantalla · control para la persona · tipografía legible · lenguaje claro y literal, sin metáforas.

## 2. Móvil primero [D]
- Diseño pensado para pantalla pequeña y uso con una mano.
- Una acción principal por pantalla; botón principal abajo, al alcance del pulgar [P].
- Objetivos táctiles de al menos 44×44 px [P].
- Sin gestos obligatorios: todo con botones visibles.

## 3. Personalización [D]
| Ajuste | Opciones |
|---|---|
| Idioma | por definir [?] |
| Tamaño de letra | al menos 3 niveles [P] |
| Filtros por neurodivergencia | buscables y combinables |

Filtros orientativos [P, validar con Cristina y asociaciones]:
- **TEA:** anticipación máxima, avisos sensoriales, lenguaje literal, pocas elecciones por pantalla.
- **TDAH:** pasos cortos, una cosa por pantalla, progreso visible, recordatorios.
- **Dislexia:** fuente legible, mayor interlineado, texto a voz.
- **Discalculia:** horas y cifras con apoyo visual y texto.
- **Disgrafía:** minimizar escritura; opciones en vez de texto libre.
- **Ceguera/baja visión:** operable con lector de pantalla y teclado; alternativa en texto de toda imagen.

La persona elige sus ajustes; la app no pide ni guarda diagnósticos [D].

## 4. Estilo visual [P]
- Paleta tranquila y con contraste de texto WCAG AA o superior.
- Modo de color reducido y modo sin movimiento, respetando las preferencias del sistema.
- Sin animaciones intrusivas, parpadeos ni sonidos automáticos.
- Iconos y pictogramas siempre con texto.
- `design-taste-frontend` y `web-design-guidelines` pueden orientar y revisar. Revisar antes el código de `design-taste-frontend` (alerta de seguridad).

## 5. Tipografía [P]
Sans-serif legible (apta para dislexia), interlineado holgado, alineación a la izquierda, bloques cortos, sin justificar ni mayúsculas continuas. Fuente concreta [?].

## 6. Componentes clave [P]
- **Tarjeta de paso:** título, qué hago, duración, qué llevo, qué me llevo, aviso sensorial.
- **Diagrama de flujo interactivo:** un paso a la vez, mapa de progreso arriba, botones Anterior / Siguiente / Repetir / Saltar.
- **Vista de entrada (Street View):** imagen con texto debajo (sentido de la vía, puerta, acceso) y botón "Ver solo texto". Que no se mueva sola.
- **Buscador:** campo grande con etiqueta visible, filtros como botones, resultados en lista corta, mensaje claro si no hay resultados. Sin autocompletado que salte ni cambie la pantalla.
- **Subida de citación:** explicación previa (qué se hace y que se descarta), botón "Hacer foto" y botón "Elegir archivo", indicador de progreso en texto, y pantalla "Esto es lo que he entendido" con cada dato editable y un botón "Es correcto / Corregir". Nunca avanza sola.
- **Estado de la IA:** texto claro ("Estoy leyendo tu citación"), sin animaciones que parpadeen; aviso de que puede equivocarse.
- **Lista de documentos** con casillas (llevar / recibir).
- **Aviso sensorial:** icono + texto.
- **Panel de ajustes** accesible desde cualquier pantalla.
- **Mensajes de error** claros, sin culpar a la persona.

## 7. Accesibilidad técnica [D/P]
HTML semántico, etiquetas y texto alternativo (descripción completa de cada vista de Street View), orden de foco lógico, `aria-live` al cambiar de paso, sin límites de tiempo, navegación por teclado y lector de pantalla móvil.

## 8. Tono de contenidos [P]
Frases cortas, verbos concretos, mismo término para lo mismo, lectura fácil opcional. El texto jurídico lo revisan Leyre y Carlos [V].

## 9. Pendiente
- [ ] Wireframes móviles por pantalla del AppFlow.
- [ ] Pruebas con personas neurodivergentes o asociaciones.
- [ ] Nombre y logotipo.
