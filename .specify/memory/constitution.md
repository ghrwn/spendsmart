# SpendSmart Constitution

## Core Principles

### 1. Financial Data Integrity
Income, expenses, budgets, and derived totals MUST use clear, consistent rules. Monetary values MUST avoid floating-point arithmetic, and summaries MUST be traceable to their underlying transactions. Changes to transaction data MUST update affected summaries accurately.

### 2. Privacy by Default
Financial records are sensitive. Collect and retain only data needed for the user's budgeting workflow. Do not expose financial details in logs, URLs, analytics, or error messages. Any future external storage or integrations MUST clearly communicate what data is shared and why.

### 3. Accessible, Understandable Workflows
Core tasks, especially recording a transaction and checking budget status, MUST be usable with keyboard and assistive technologies. Use clear labels, meaningful validation and error messages, and understandable financial terminology. Color MUST NOT be the sole way to convey financial status.

### 4. Responsive and Focused Experience
The primary budgeting workflows MUST work on mobile and desktop. Prioritize scannable transaction history, clear period selection, and visible budget status. Add features only when they support tracking, organizing, or understanding personal finances.

### 5. Small, Verifiable Changes
Implement features in focused increments using the repository's Next.js, TypeScript, and Tailwind CSS stack. Keep financial calculations separate from presentation where practical, and cover important calculation and validation behavior with tests. Run relevant lint, type, and build checks before considering a change complete.

## Technical Constraints

- Use TypeScript and the existing Next.js App Router structure.
- Preserve a clear distinction between transaction records, budget rules, and derived summaries.
- Do not assume a database, authentication provider, currency, or persistence strategy until it is selected for the project.
- Do not present application summaries as professional financial, tax, or investment advice.

## Governance

This constitution guides product decisions, implementation, and review. A change that conflicts with a principle MUST explain the conflict and document the reason in its specification or pull request. Amendments MUST be made explicitly and reviewed alongside affected specifications and implementation. When requirements are unclear, favor data correctness, privacy, accessibility, and the smallest useful solution.

**Version**: 1.0.0  
**Last Amended**: 2026-11-07