# 02 · TRD — Documento de requisitos técnicos

> Leyenda: **[D]** decidido · **[P]** propuesta · **[?]** abierto.

## 1. Decisiones técnicas tomadas
- **[D]** Aplicación **web mobile-first**.
- **[D]** Vista de la entrada del juzgado con **Street View de Google Maps**.
- **[D]** Sin documentación clínica ni QR.
- **[D]** El 3D / KIRI Engine pasa a anexo (ver [Anexo-3D-Escaneo.md](Anexo-3D-Escaneo.md)).

## 2. Arquitectura propuesta [P]
```
Navegador móvil (PWA / web responsive, accesible)
   ├─ Registro + cuestionario + ajustes
   ├─ Selector trámite / juzgado
   └─ Flujo interactivo de pasos (+ Street View de la entrada)
          │
      API backend ── Base de datos
          │
      Google Maps (Street View) ── solo cliente o llamada controlada
```
- **Frontend [P]:** React/Next.js + TypeScript, HTML semántico, diseño mobile-first.
- **Backend [P]:** API REST + base de datos relacional (PostgreSQL). Contenido de trámites y juzgados como datos (no incrustado en código).
- **Diagrama de flujo [P]:** componente propio accesible (lista ordenada de pasos con navegación), no un lienzo de arrastrar: funciona con teclado y lector de pantalla. Representación visual como mapa de progreso encima de esa lista.
- Framework y hosting: por acordar [?].

## 2b. Selección de trámite: buscador y citación con IA [D la funcionalidad, P el diseño]

### Buscador
- Búsqueda con filtros (tipo de proceso, trámite, juzgado) sobre el catálogo de la base de datos. Texto tolerante a errores y sinónimos (ej.: "juicio", "declarar", "testigo") [P].
- Válido sin IA: es la vía de respaldo siempre disponible.

### Subida de la citación + IA
```
Subir citación (PDF / foto) ─► extraer texto (OCR si es imagen)
   ─► IA extrae campos: órgano, tipo de proceso, fecha/hora, condición de la persona
   ─► IA clasifica la citación en el catálogo de trámites
   ─► Se muestra el resultado y la persona lo CONFIRMA o lo corrige
   ─► Se carga el flujo del trámite y juzgado
```
- **La IA no genera los pasos desde cero** [P]: relaciona la citación con trámites del catálogo, escritos y revisados por Derecho. Los pasos que ve la persona son siempre contenido revisado. Evita alucinaciones en un contexto legal.
- Salida estructurada (JSON con campos y nivel de confianza); si la confianza es baja o falta algún dato, se pide confirmar o se ofrece el buscador.
- Modelo: capaz de leer documentos y con salida estructurada [?]. Opciones y coste por decidir.
- El documento **se procesa y se descarta**; no se guarda salvo consentimiento [P].
- **Datos personales:** el documento puede contener nombre y número de procedimiento. Antes de enviarlo a un proveedor externo: acuerdo de tratamiento de datos, región de la UE, sin entrenamiento con los datos, o enmascarar los datos personales antes del envío [V].
- Límites del archivo: tipos permitidos (PDF, JPG, PNG), tamaño máximo, antivirus/validación; calidad de foto móvil (aviso si está borrosa) [P].
- Prototipo: citaciones sintéticas únicamente.
- Aviso visible: la IA puede equivocarse; no sustituye asesoramiento legal.

## 3. Street View de Google Maps
- Opciones [P]: (a) Maps Embed API en modo Street View (iframe), (b) Street View Static API (imagen), (c) Maps JavaScript API (panorama interactivo). **Comprobar en la documentación de Google:** claves de API, cuotas, precio y términos de uso antes de elegir [?].
- La clave de API se restringe por dominio y por API; nunca se sube al repositorio.
- Por juzgado se guarda: coordenadas, orientación (heading), zoom y una **descripción en texto** de la entrada (sentido de la vía, dónde parar, puerta de acceso). Esa información la redacta una persona; Street View no la da.
- **Accesibilidad:** Street View es visual. Cada vista debe tener una alternativa de texto equivalente (necesario para Juan) y no ser el único modo de obtener la información.
- Imagen de Street View puede estar desactualizada: mostrar fecha de captura si está disponible y avisarlo [P].
- Alternativa si no hay cobertura o falla: foto aportada por el juzgado o solo texto [P].

## 4. Móvil
- Mobile-first, objetivos táctiles amplios, sin hover como único acceso.
- PWA (instalable, carga rápida, algo de uso sin conexión de pasos ya vistos) [P]; decidir si compensa [?].
- Probar en pantallas pequeñas y en lector de pantalla del móvil (TalkBack, VoiceOver).

## 5. Seguridad y privacidad
- Datos sintéticos en el prototipo.
- **No se recoge documentación clínica.** El perfil guarda solo preferencias de adaptación. Aun así es dato sensible (RGPD): minimizar, consentimiento explícito, derecho de borrado [V].
- Autenticación y roles (ver 05-Backend-Schema).
- Chatbot RAG opcional: solo con contenido público de trámites, sin datos personales [P].

## 6. Calidad
- Auditoría con `web-design-guidelines`; pruebas end-to-end con `playwright-cli`; WCAG AA mínimo.

## 7. Preguntas abiertas
- [ ] Stack final y hosting.
- [ ] Proveedor de IA, modelo, coste y tratamiento de datos de la citación.
- [ ] OCR: del propio modelo o servicio aparte.
- [ ] Modalidad de Street View y coste.
- [ ] Idioma(s) soportados y traducción del contenido.
- [ ] ¿Cuenta obligatoria o se puede probar sin registro?
