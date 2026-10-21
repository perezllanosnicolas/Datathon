# 02 · TRD — Documento de requisitos técnicos

> Leyenda: **[D]** decidido · **[P]** propuesta · **[?]** abierto.

## 1. Decisiones técnicas tomadas
- **[D]** Generación del modelo 3D con la **API de KIRI Engine**: se envía un vídeo del juzgado y se obtiene un objeto 3D.
- **[D]** Aplicación web (responsive), usada antes de acudir al juzgado.

## 2. Arquitectura propuesta [P]
```
Navegador (web responsive, accesible)
   ├─ App de usuario: registro, trámites, flujo, visor 3D
   └─ App de escaneo (encargado): subida de vídeo, anotación de salas
          │
      API backend ── Base de datos + almacenamiento de archivos
          │
      Cola de trabajos ── KIRI Engine API (vídeo → 3D)
```
- **Frontend [P]:** React/Next.js + TypeScript, HTML semántico. Visor 3D con three.js (formato glTF/GLB).
- **Backend [P]:** servicio con API REST; base de datos relacional (PostgreSQL); almacenamiento de objetos para vídeos y modelos.
- **Procesado asíncrono [P]:** el modelado tarda; el backend sube el vídeo a KIRI, consulta el estado y guarda el resultado. El encargado ve el estado "procesando / listo / error".
- Las opciones concretas (framework, hosting) se acuerdan en equipo; no están decididas.

## 3. Integración con KIRI Engine
- Pendiente de comprobar en su documentación oficial: endpoints, formatos de salida, límites de vídeo (duración, tamaño), precio y créditos, tiempos de procesado, licencia de uso de los modelos [?].
- La clave de API **nunca** va en el cliente: solo en el servidor (variables de entorno).
- Plan B si falla o es lento: modelo de ejemplo precargado para el demo [P].

## 4. Visor 3D accesible
- Modelo en GLB, optimizado (peso) para móvil [P].
- Navegación por teclado y botones además de gestos; ritmo propio; opción de "volver a la entrada".
- Alternativa **sin 3D** para cada paso: imágenes, texto y descripción para lector de pantalla (necesario para Juan) [P].
- Respetar `prefers-reduced-motion`; sin movimiento automático por defecto.
- Marcadores de **estímulos estridentes** sobre el modelo, con aviso previo.

## 5. Chatbot RAG (opcional) [P]
- Base documental: fichas de trámites revisadas por Derecho; sin datos reales.
- Qué puede leer la IA se define por rol y consentimiento [?].
- Debe citar la norma y marcar lo dudoso; aviso de no sustituir asesoramiento legal.

## 6. Seguridad y privacidad
- Datos sintéticos únicamente en el prototipo.
- Autenticación y roles (ver 05-Backend-Schema). El perfil de neurodivergencia es dato sensible (RGPD, categoría especial): minimizar, pedir consentimiento, permitir borrado [V].
- Subida de vídeo del encargado: validar tipo y tamaño; no exponer datos de personas que salgan en el vídeo (pedir grabar sin público) [V].

## 7. Calidad
- Auditoría de accesibilidad con `web-design-guidelines` y pruebas end-to-end con `playwright-cli`.
- Objetivo WCAG AA mínimo.

## 8. Preguntas abiertas
- [?] Stack final y hosting.
- [?] Límites y coste de KIRI Engine para el demo.
- [?] Idioma(s) soportados y herramienta de traducción.
- [?] Escalabilidad y diagrama de arquitectura (pendiente en el Doc).
