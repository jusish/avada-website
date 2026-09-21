# Avada Project Documentation

Welcome to the comprehensive documentation for the **Avada Website & CMS** platform.

This directory is organized into distinct categories designed for developers and AI agents alike. Every change to the repository must be cataloged here.

---

## 📑 Documentation Directory Tree

```
docs/
├── README.md                          # Master index (this file)
├── rules/
│   ├── frontend-styling-rules.md     # Frontend styling standards & UI likes/dislikes
│   └── backend-rules.md              # Backend Node.js, Express & Prisma conventions
└── changelog/
    ├── features-storage.md           # Single source of truth for all implemented features
    └── CHANGELOG.md                  # Chronological release and commit history
```

---

## 🗂️ Documentation Sections

### 1. Rules & Standards (`docs/rules/`)
- [**Frontend Styling Rules**](./rules/frontend-styling-rules.md): Defines the design system, colors, typography, component rules (shadcn/ui), and strictly forbidden anti-patterns (no plain HTML).
- [**Backend Rules**](./rules/backend-rules.md): Architectural best practices for Express, Prisma ORM, PostgreSQL, authentication tokens, error handling, and API schema design.

### 2. Changelog & Features (`docs/changelog/`)
- [**Features Storage**](./changelog/features-storage.md): Exhaustive encyclopedia of all features built into the project, including technical architecture, files involved, database schemas, and endpoints.
- [**Changelog**](./changelog/CHANGELOG.md): High-level version timeline documenting releases, additions, fixes, and updates.

### 3. AI Agent Directives
- See root [**`AGENT.md`**](../AGENT.md) for direct instructions and protocols that AI assistants must follow during development.
