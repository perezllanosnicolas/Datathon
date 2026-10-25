# Cómo contribuir

## Ramas
- **`main`**: código común y documentación. Todo cambio entra aquí, desde una rama de funcionalidad (`feat/…`, `fix/…`, `docs/…`, `chore/…`) y con merge fast-forward o PR. Nunca se hacen commits directos en `main`.
- **`local`** (Docker) y **`online`** (Vercel): reciben `main` con un merge. Solo se tocan sus archivos propios. Ver [docs/11](docs/11-Ramas-y-despliegue.md).
- Nunca `git push --force` en ramas compartidas.

## Antes de abrir un PR
```bash
cd web
npm run lint && npm run typecheck && npm test
npm run build && npm start   # y en otra terminal:
npm run smoke
```

## Commits
En inglés, con prefijo convencional: `feat:`, `fix:`, `docs:`, `chore:`, `test:`. Una idea por commit.

## Contenido (trámites, sedes, glosario)
- Vive en `web/data/catalog/*.json`, con un campo por idioma (`es` obligatorio; `ca`, `gl`, `eu`).
- **Contenido legal:** cita siempre la norma (artículo y ley). Lo no revisado por Derecho se marca `"reviewStatus": "draft"`.
- **Lenguaje simple** ([docs/04 §8](docs/04-UI-UX-Design.md)): frases cortas, palabras de uso diario, términos legales explicados al lado y siglas con su significado.
- **Vocabulario:** «sede judicial» (no «juzgado»), «neurodivergencia» (nunca «discapacidad»), «idioma» (no «lengua»).
- `npm test` comprueba la integridad del catálogo (ids únicos, textos en español, foto de fachada con crédito y alternativa en texto).

## Textos de la interfaz
`web/src/i18n/es.ts` es la referencia. Cualquier clave nueva se añade en los cuatro archivos. TypeScript y `tests/i18n.test.ts` fallan si falta alguna o si hay una vacía.

## Privacidad
- Solo **datos sintéticos**. No subas citaciones reales, informes clínicos ni datos personales, tampoco en issues.
- No guardes en el servidor nada del perfil de adaptaciones.
- Las claves de API nunca van al repositorio (`.env` está ignorado).

## Decisiones
Las decisiones del equipo se registran con fecha en `CLAUDE.md` («Decisiones») y en `docs/`, con las marcas [D], [P], [?] y [V].
