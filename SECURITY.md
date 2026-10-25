# Seguridad

## Informar de una vulnerabilidad
No abras un issue público. Usa **[Report a vulnerability](https://github.com/perezllanosnicolas/Datathon/security/advisories/new)** (aviso privado de GitHub) e indica cómo reproducirla. Responderemos en cuanto podamos; es un prototipo académico sin equipo de guardia.

## Alcance
Es un **prototipo con datos sintéticos**, no un servicio en producción. Aun así, el diseño trata de proteger:

| Dato | Medida |
|---|---|
| Perfil de adaptaciones (puede revelar una neurodivergencia) | Solo en el navegador; nunca se envía al servidor |
| Citación (nombre, número de procedimiento) | Se procesa en memoria, se borra el búfer y no se registra su texto. OCR en el propio servidor, sin terceros |
| Secreto del caso y token del abogado | Aleatorios de 256 bits; en la base de datos solo su hash SHA-256; comparación en tiempo constante |
| Enlace del abogado | Caduca a las 48 h, revocable, solo permite escribir la lista de documentos de ese caso |
| URL con el token | `Referrer-Policy: no-referrer` para que no se filtre a otros sitios |
| Subidas | Tipo comprobado por los primeros bytes, máximo 8 MB, 6 por minuto |
| Peticiones | Límite por cliente y minuto (en memoria: no vale con varias instancias) |

## Limitaciones conocidas
- Límite de peticiones en memoria y SQLite local: no aptos para varias réplicas (ver [docs/10](docs/10-Escalabilidad-rendimiento-recursos.md)).
- El nombre y el número de colegiado del abogado son **datos declarados, sin verificar**.
- En la rama `local` se sirve por HTTP en la red local.
- Sin análisis RGPD ni adecuación al ENS todavía (ver [docs/09](docs/09-Stack-ideal-produccion.md)).

## Comprobaciones automáticas
CodeQL en cada push y cada semana; Dependabot para las dependencias; tests de seguridad de los tokens en `web/tests/security.test.ts`.
