# Windows And Text Safety

Use this reference only when a task touches Windows command execution, non-ASCII text, exact replacements, or newline-sensitive files.

## Shell Rules

- In PowerShell, prefer `-LiteralPath` for filesystem paths.
- Do not build destructive commands by concatenating paths.
- Keep one shell responsible for a filesystem action; avoid enumerating in one shell and deleting or moving in another.
- Avoid inline commands that carry Chinese, emoji, long Markdown, prompts, or JSON with heavy quoting.
- For `.cmd`, `.ps1`, JSON, TOML, YAML, Markdown, and prompt files, prefer patch edits or explicit UTF-8 file APIs.

## Encoding Rules

- Treat console output as untrusted when it displays mojibake.
- Confirm file content with UTF-8 reads, byte checks, or a parser before rewriting.
- Preserve BOM/no-BOM behavior unless the repository already standardizes it.
- Never rewrite a whole file just to fix a small encoded span.

## Newline Rules

- Detect the nearby file style before exact replacement.
- Preserve CRLF or LF when patching.
- Do not normalize large files unless formatting is the actual task.

## Path Rules

- Quote paths.
- Avoid examples that reveal a real local user directory.
- Use placeholders such as `<PROJECT_DIR>` and `<USER_HOME>` in public docs.
- Keep generated artifacts out of commits unless they are intentional release assets.
