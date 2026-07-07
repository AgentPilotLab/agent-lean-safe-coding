# Reuse Ladder

Use this reference when choosing between custom code, installed dependencies, platform features, or new libraries.

## Decision Order

1. Existing repository behavior.
2. Language standard library.
3. Native platform behavior.
4. Framework feature already in use.
5. Installed dependency.
6. Small local code.
7. New dependency after approval.

## Common Platform Wins

- Browser inputs before date, color, range, file, or number picker libraries.
- CSS layout and media queries before layout JavaScript.
- Database constraints before duplicated application guards.
- Framework router, form, cache, serializer, or validator before custom glue.
- Existing CLI/parser/logger/test utilities before new helpers.

## Dependency Approval Note

When proposing a new dependency, include:

- Problem solved.
- Current alternatives checked.
- Why existing repo dependencies do not fit.
- Size and maintenance risk.
- Security or license consideration.
- Install command.
- Minimal example.
