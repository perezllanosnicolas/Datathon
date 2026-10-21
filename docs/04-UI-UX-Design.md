# 04 · UI/UX Design — Brief de diseño

> Leyenda: **[D]** decidido · **[P]** propuesta · **[?]** abierto.

## 1. Principios [D] (de CLAUDE.md)
Accesibilidad cognitiva primero · baja carga sensorial · anticipación · lector de pantalla · control para la persona · tipografía legible · lenguaje claro y literal, sin metáforas.

## 2. Personalización [D]
La interfaz se adapta según el cuestionario de registro:
| Ajuste | Opciones |
|---|---|
| Idioma | por definir [?] |
| Tamaño de letra | al menos 3 niveles [P] |
| Filtros por neurodivergencia | buscables y combinables (ver abajo) |

Filtros orientativos [P, a validar con Criminología y expertos]:
- **TEA:** anticipación máxima, avisos sensoriales, lenguaje literal, pocas elecciones por pantalla.
- **TDAH:** pasos cortos, una cosa por pantalla, progreso visible, recordatorios.
- **Dislexia:** fuente legible, mayor interlineado, texto a voz.
- **Discalculia:** horas y cifras con apoyo visual y texto.
- **Disgrafía:** minimizar escritura; formularios con opciones.
- **Ceguera/baja visión:** todo operable con teclado y lector de pantalla; alternativa sin 3D.

## 3. Estilo visual [P]
- Paleta tranquila y de bajo contraste cromático, pero con contraste de texto WCAG AA o superior.
- Modo de color reducido y modo sin movimiento, activables y respetando las preferencias del sistema.
- Sin animaciones intrusivas, parpadeos ni sonidos automáticos.
- Iconos y pictogramas siempre con texto.
- Decidir con el equipo; las skills `design-taste-frontend` y `web-design-guidelines` pueden orientar y revisar. Revisar antes el código de `design-taste-frontend` (alerta de seguridad).

## 4. Tipografía [P]
Sans-serif legible (apta para dislexia), interlineado holgado, alineación a la izquierda, bloques cortos, sin justificar ni mayúsculas continuas. Fuente concreta [?].

## 5. Componentes clave [P]
- **Tarjeta de paso:** título, qué hago, duración, qué llevo, qué me llevo, aviso sensorial.
- **Diagrama de flujo interactivo:** un paso a la vez, mapa de progreso, botones Anterior / Siguiente / Repetir / Saltar.
- **Lista de documentos** con casillas.
- **Visor 3D:** controles visibles con etiqueta, botón "Volver a la entrada", botón "Salir del 3D", indicador de estímulos.
- **Aviso sensorial:** icono + texto (qué estímulo, dónde).
- **Panel de ajustes** accesible en todo momento.
- **Mensajes de error** claros, sin culpar a la persona.

## 6. Accesibilidad técnica [D/P]
HTML semántico, etiquetas y texto alternativo, orden de foco lógico, navegación completa por teclado, `aria-live` para cambios de paso, objetivos táctiles amplios, sin límites de tiempo.

## 7. Tono de contenidos [P]
Frases cortas, verbos concretos, mismo término para lo mismo, lectura fácil opcional. El texto jurídico lo revisan Leyre y Carlos [V].

## 8. Pendiente
- [?] Pruebas con personas neurodivergentes o asociaciones.
- [?] Maquetas (wireframes) por pantalla del AppFlow.
- [?] Identidad del proyecto: nombre y logotipo.
