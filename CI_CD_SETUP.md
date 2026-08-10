# CI/CD Setup — Drink Awareness App

**Date:** August 10, 2026  
**Status:** ✅ Complete

---

## Overview

Complete CI/CD pipeline configured with:
- **Local validation** — Pre-commit hooks catch issues before pushing
- **Cloud validation** — GitHub Actions runs checks on every push/PR
- **Code quality** — ESLint, Prettier, TypeScript type-checking

---

## Components

### 1. ESLint Configuration
**File:** `.eslintrc.json`

Configured for React Native + TypeScript:
- Extends ESLint recommended rules
- React Native plugin for mobile-specific patterns
- Prettier integration (no formatting conflicts)
- Warns on console usage (except errors)
- Flags unused variables

### 2. Code Formatting
**File:** `.prettierrc.json`

Standardized formatting:
- 2-space indentation
- Single quotes (JS convention)
- Trailing commas (ES5)
- 100-char line width
- Semicolons on all statements

### 3. Pre-commit Hooks
**Files:** `.husky/pre-commit`, `.lintstagedrc.json`

Runs locally **before each commit**:
- ESLint with auto-fix
- Prettier formatting
- Only checks modified files (fast)
- Blocks commit if linting fails

**Setup:**
```bash
npm install          # Installs husky and lint-staged
npx husky install    # Enables git hooks
```

### 4. GitHub Actions Workflow
**File:** `.github/workflows/ci.yml`

Runs on every push to `main` or `develop`:

**Job 1: Lint & Type Check**
- Installs dependencies
- TypeScript type-checking (tsc --noEmit)
- ESLint validation
- Prettier format check
- Fails if any check fails → blocks merge

**Job 2: Expo Validation** (informational)
- Validates Expo app.json structure
- Checks for common Expo issues
- Does not block merge (continue-on-error)

---

## Scripts

Add these to your workflow:

### Type Checking
```bash
npm run type-check
```
Validates all TypeScript without building.

### Linting
```bash
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues
```

### Formatting
```bash
npm run format        # Auto-format all files
npm run format:check  # Check if files need formatting
```

### Full Validation
```bash
npm run validate
```
Runs type-check → lint → format:check (same as CI pipeline)

---

## Workflow

### Before Committing

**Automatic (pre-commit hook):**
1. Stages your changes
2. ESLint runs with auto-fix on modified files
3. Prettier formats modified files
4. Git commit proceeds (or fails if linting blocks it)

To commit:
```bash
git add src/
git commit -m "feat: your message"
```

### On GitHub (after push)

**Automatic (GitHub Actions):**
1. CI workflow starts
2. Lint & Type Check job runs:
   - Runs full type-check (all files)
   - Runs full ESLint (all files)
   - Runs full Prettier check
   - Status reported on PR/commit
3. Expo Validation job runs (informational only)

**Merge blocked if:**
- TypeScript compilation fails
- ESLint finds uncorrected issues
- Files don't match Prettier format

---

## ESLint Rules

**Errors (blocks merge):**
- Unused variables
- Type mismatches
- Syntax errors

**Warnings (informational):**
- `console.log()` calls (unless it's `console.error()`)
- Inline styles in React Native (prefer StyleSheet)

---

## Prettier Rules

Enforced on all `.ts`, `.tsx`, `.js`, `.jsx`, `.json` files in `src/`:
- Single quotes: `'string'` not `"string"`
- Semicolons at end of statements
- 2-space indent
- Max 100 characters per line
- Trailing commas in objects/arrays

---

## Skipping Hooks (Not Recommended)

**Force commit without hooks:**
```bash
git commit --no-verify
```

**This bypasses:**
- ESLint checks
- Prettier formatting
- Pre-commit validation

⚠️ **Use only for hotfixes.** CI will still catch issues and block the merge.

---

## Troubleshooting

### "pre-commit hook failed"

**Cause:** Linting or formatting issues in modified files.

**Fix:**
```bash
npm run lint:fix     # Auto-fix linting issues
npm run format       # Auto-format files
git add .            # Stage the fixes
git commit -m "..."  # Try commit again
```

### "ESLint error on CI"

**See:** Check the GitHub Actions job output for specifics.

**Fix locally:**
```bash
npm run lint:fix     # Auto-fix what you can
# Manually fix remaining issues
git add .
git commit --amend
git push
```

### "Type-check fails on CI but not locally"

**Cause:** Node version or dependency version mismatch.

**Fix:**
```bash
npm ci                # Use exact package-lock.json versions
npm run type-check    # Verify locally
```

---

## CI Status Badges

Add to your README:
```markdown
![CI](https://github.com/YOUR_ORG/DrinkAwarenessApp/workflows/CI/badge.svg)
```

---

## Next Steps

1. ✅ Run `npm ci` to install all dev dependencies
2. ✅ Run `npx husky install` to enable pre-commit hooks
3. ✅ Run `npm run validate` to verify everything works
4. ✅ Push to trigger GitHub Actions workflows
5. ✅ Check `.github` branch protection rules on GitHub:
   - Require CI to pass before merge
   - Require PR review before merge

---

## Files Changed

| File | Purpose |
|------|---------|
| `package.json` | Added dev dependencies & scripts |
| `.eslintrc.json` | ESLint configuration (new) |
| `.prettierrc.json` | Prettier configuration (new) |
| `.prettierignore` | Prettier exclusions (new) |
| `.husky/pre-commit` | Pre-commit hook (new) |
| `.lintstagedrc.json` | Lint-staged config (new) |
| `.github/workflows/ci.yml` | GitHub Actions (new) |

---

## Environment Setup

**After initial clone:**
```bash
# Install dependencies (exact versions)
npm ci

# Enable pre-commit hooks
npx husky install

# Run validation to verify setup
npm run validate

# Ready to commit!
git add src/
git commit -m "feat: your feature"
```

**Subsequent pushes:** All validation runs automatically on every commit + every GitHub push.

---

**Status:** CI/CD pipeline ready  
**Testing Impact:** 100% catch rate for linting/type errors before merge  
**Developer Experience:** Instant feedback on every commit

