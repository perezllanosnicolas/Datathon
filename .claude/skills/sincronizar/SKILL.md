---
name: sincronizar
description: Sincroniza el trabajo del proyecto Datathon. Actualiza la documentación (docs/ y CLAUDE.md), guarda los cambios, hace el commit en el repositorio y lo sube a GitHub. Usar solo cuando el usuario escriba /sincronizar o pida guardar, comitear y subir los cambios.
argument-hint: "[mensaje del commit opcional | main]"
disable-model-invocation: true
---

# /sincronizar

Deja el repositorio al día en un solo paso: **documentación → comprobaciones → commit → push**. Responde siempre en español; los mensajes de commit y los nombres de rama van en inglés.

Argumentos (`$ARGUMENTS`):
- Vacío: deduce un mensaje de commit a partir de los cambios.
- Texto libre: úsalo como asunto del commit (en inglés; si viene en español, tradúcelo).
- La palabra `main`: el usuario autoriza explícitamente comitear y subir a `main` en esta ejecución.

## Reglas que no se saltan
- **Nunca** `git push --force`, `git reset --hard`, `git commit --amend`, `--no-verify` ni `--no-gpg-sign`.
- **No subir a `main` sin acuerdo** (regla del proyecto). Si la rama actual es `main` o `master` y el usuario no ha escrito `main`, crea una rama de funcionalidad y trabaja ahí.
- **No inventar decisiones** en la documentación. Solo se registra lo que el equipo acordó en la conversación o lo que muestran los cambios. Lo propuesto se marca [P], lo abierto [?], lo que debe revisar Derecho [V] (leyenda de `docs/`).
- Si algo falla (comprobaciones, conflicto, push rechazado), **para y cuenta qué pasó**. No fuerces.

## Pasos

### 1. Ver el estado
Ejecuta en paralelo: `git status --short`, `git branch --show-current`, `git remote -v`, `git log --oneline -n 5` y `git diff --stat`.
- Si no hay cambios (ni archivos nuevos), dilo y termina.
- Si no existe el remoto `origin`, para y pide la URL del repositorio. La esperada es `https://github.com/perezllanosnicolas/Datathon.git`.
- Si el repositorio no tiene ningún commit todavía, es el primero: sigue igual.

### 2. Elegir la rama
- Si ya estás en una rama que no es `main`/`master`: úsala.
- Si estás en `main`/`master` y no se escribió `main` en los argumentos: crea una rama con `git switch -c <tipo>/<tema-corto>` (por ejemplo `docs/update-trd`, `feat/skeleton`). El tipo sale de lo que cambia (`docs`, `feat`, `fix`, `chore`). Avisa al usuario de la rama elegida.

### 3. Actualizar la documentación (antes del commit)
Lee los cambios (`git diff`, archivos nuevos) y revisa si la documentación los refleja:
1. **`CLAUDE.md`**
   - "Decisiones": una línea nueva con fecha (formato `AAAA-MM-DD`, la de hoy) por cada decisión **acordada** que aún no figure. No dupliques las ya anotadas.
   - "Estructura del repo": añade las carpetas o archivos nuevos importantes, y quita los que ya no existan.
   - "Skills": si se instaló o creó una skill, anótala.
   - "Fase actual": ajusta si el proyecto ha cambiado de fase.
2. **`docs/`** (01-PRD, 02-TRD, 03-AppFlow, 04-UI-UX-Design, 05-Backend-Schema, 06-Implementation-Plan, Anexo-3D-Escaneo)
   - Si el código cambia el comportamiento descrito, actualiza el documento correspondiente.
   - Mueve de [P]/[?] a [D] solo lo que el equipo haya decidido.
   - Marca como hechas las fases del plan que cumplan su criterio de "Hecho cuando", sin exagerar.
   - Mantén coherencia entre documentos (si cambia el stack, cambia en PRD, TRD y plan).
3. **`README.md`**: si hay código ejecutable, comprueba que "cómo ejecutar el prototipo" sigue siendo cierto. Si no existe y ya hay código, créalo.
4. Reglas de escritura de la documentación: lenguaje simple, frases cortas, sin afirmar contenido legal sin citar la norma.
Si no hace falta cambiar nada, no toques los archivos.

### 4. Comprobaciones antes del commit
- **Secretos y datos sensibles.** Busca en lo que se va a subir: `.env`, claves de API (por ejemplo `AIza…` de Google, `sk-…`, `ghp_…`, `token`, `secret`, `password`), archivos `.pem`/`.key`, bases de datos locales (`*.db`, `*.sqlite`), modelos o pesos de IA (`*.gguf`, `*.safetensors`, `*.bin` grandes), `node_modules/`, carpetas de compilación (`.next/`, `dist/`), y cualquier citación, informe clínico o dato personal real. **Si encuentras algo, no lo subas**: añádelo a `.gitignore` (créalo si no existe) y avisa. Si el secreto ya estaba staged, quítalo del índice con `git restore --staged <archivo>`.
- **Tamaño.** Avisa de archivos de más de 5 MB y no los subas sin confirmación.
- **Enlaces simbólicos de skills.** Los enlaces de `.claude/skills/*` creados por `npx skills` apuntan a rutas absolutas del equipo de Nicolás (por ejemplo `/c/Users/perez/...`) y no funcionan en otros equipos. **No los subas.** Sí se suben `.agents/skills/` y `skills-lock.json`. Esta skill (`.claude/skills/sincronizar/`) es una carpeta real y sí se sube. Excluye los enlaces con `.gitignore` si hace falta.
- **Pruebas del código.** Si hay `package.json` con scripts `lint`, `typecheck` o `test`, ejecútalos (los que existan y sean rápidos). Si fallan, para y muestra el fallo. Si no hay código todavía, sáltate este punto.

### 5. Commit
- Añade los archivos de forma explícita por carpetas o nombres (por ejemplo `git add CLAUDE.md docs .claude/skills/sincronizar`), no con `git add -A` a ciegas. Revisa antes `git status` y `git diff --cached --stat`.
- Si hay cambios de documentación y de código claramente separados, haz **dos commits** (primero el código, luego `docs:`). Si todo es de un solo tipo, uno.
- Mensaje en inglés, en imperativo y con prefijo convencional: `docs:`, `feat:`, `fix:`, `chore:`, `refactor:`, `test:`. Asunto de menos de 72 caracteres, y un cuerpo breve con el porqué si no es evidente.
- Termina el mensaje con la línea de atribución que dé el sistema para los commits en esta sesión (si no hay ninguna, no añadas ninguna).
- Pasa el mensaje con un heredoc para respetar los saltos de línea.
- Si un hook falla, arregla la causa y crea un commit **nuevo**; nunca uses `--no-verify` ni `--amend`.

### 6. Push a GitHub
1. `git fetch origin`.
2. Si la rama remota existe y la local va detrás: `git pull --rebase origin <rama>`. Si hay conflicto, **para**, lista los archivos en conflicto y pregunta al usuario.
3. `git push -u origin <rama>`.
4. Si se rechaza, no fuerces: explica el motivo.
5. No abras pull request salvo que el usuario lo pida. Ofrécelo en una frase y da la URL de comparación: `https://github.com/perezllanosnicolas/Datathon/compare/<rama>`.

### 7. Informe final (en español, breve)
Indica:
- Rama usada (y si se creó).
- Commits creados (hash corto y asunto).
- Archivos de documentación actualizados y qué decisiones se registraron.
- Resultado del push y enlace a la rama.
- Qué se dejó fuera y por qué (secretos, enlaces simbólicos, archivos grandes) y cualquier cosa pendiente de decidir.
