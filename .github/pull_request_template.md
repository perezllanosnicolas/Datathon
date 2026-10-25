## Qué cambia
<!-- Una o dos frases. -->

## Por qué
<!-- Enlace a la decisión, issue o documento de docs/ si lo hay. -->

## Rama de destino
- [ ] `main` (código común; después se mergea a `local` y `online`)
- [ ] `local` (solo Docker)
- [ ] `online` (solo Vercel)

## Comprobaciones
- [ ] `npm run lint`, `npm run typecheck` y `npm test` pasan en `web/`
- [ ] Si toca la API: `npm run smoke` pasa contra un servidor arrancado
- [ ] Si cambia contenido legal: cita la norma y lo ha revisado Derecho
- [ ] Si cambia textos: lenguaje simple ([UI/UX §8](../docs/04-UI-UX-Design.md)) y los cuatro idiomas (es, ca, gl, eu)
- [ ] Sin datos personales reales ni documentación clínica
- [ ] Documentación actualizada (`docs/`, `README.md`, `CHANGELOG.md`)
