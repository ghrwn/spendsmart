# SpendSmart Copilot Instructions

## Project purpose

SpendSmart is an individual personal finance tracker. Users record income and expenses, organize transactions by category and date, set monthly category budgets, and review monthly financial summaries.

## Technology stack

- Next.js 16.4.5 with the App Router.
- React 19.3.0.
- TypeScript 5.
- Tailwind CSS 4.
- Browser localStorage is the current persistence mechanism for transactions and budgets.
- The application formats and displays money in Philippine pesos (PHP) using the `en-PH` locale.

Do not introduce a database, authentication system, API routes, or Server Actions unless the task explicitly requires that architectural change.

## Project structure

- `app/page.tsx`: main dashboard page and overall layout.
- `app/layout.tsx`: root document layout and metadata.
- `components/TransactionManager.tsx`: transaction state, dashboard month selection, monthly totals, and coordination of transaction and budget UI.
- `components/TransactionForm.tsx`: create and edit transaction form.
- `components/TransactionList.tsx`: transaction history and row actions.
- `components/BudgetManager.tsx`: monthly category budgets and budget progress.
- `components/BudgetForm.tsx`: create and edit budget form.
- `lib/transactions.ts`: transaction localStorage access, parsing, subscriptions, and CRUD helpers.
- `lib/budgets.ts`: budget localStorage access, parsing, subscriptions, and create/update helpers.
- `types/transaction.ts`: transaction data types.
- `types/budget.ts`: budget data types.
- `specs/001-spendsmart-mvp/spec.md`: MVP requirements, user scenarios, acceptance criteria, and technical constraints.

Keep presentation components focused. Put reusable data access and business logic in the `lib` directory, and keep shared data contracts in `types`.

## Data model and persistence

A transaction has:
- `id: string`
- `description: string`
- `amountInMinorUnits: number`
- `type: "income" | "expense"`
- `category: string`
- `date: string` in `YYYY-MM-DD` format

A budget has:
- `id: string`
- `category: string`
- `month: string` in `YYYY-MM` format
- `limitInMinorUnits: number`

Use the existing helpers in `lib/transactions.ts` and `lib/budgets.ts` instead of accessing localStorage directly from UI components. The storage keys are `spendsmart-transactions` and `spendsmart-budgets`. The libraries use `useSyncExternalStore` subscriptions so updates are reflected in mounted components.

## Financial calculations and dates

- Store and calculate monetary amounts as integer minor units (centavos). Do not use floating-point pesos for arithmetic.
- Convert to pesos only when formatting for display or reading/writing form input.
- Use the existing PHP currency formatting convention with `Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" })`.
- A monthly summary is derived from transactions whose `date` starts with the selected `YYYY-MM` value.
- Monthly budget progress must include only expense transactions matching both the budget category and selected month.
- The dashboard should default to the current month and should not use hard-coded month values.
- Keep month values in `YYYY-MM` format and transaction dates in `YYYY-MM-DD` format.

## React and Next.js conventions

- Use TypeScript for new application code and provide explicit prop types for reusable components.
- Follow the App Router conventions already used in this repository.
- Add `"use client"` only to components that need client-side state, browser APIs, or event handlers.
- Avoid reading `window` or `localStorage` during server rendering.
- Use the existing `@/*` path alias for imports from the project root.
- Prefer small, focused components and derived values with `useMemo` when they avoid repeated calculations.

## Accessibility and user experience

- Associate every form control with a visible `label` using matching `htmlFor` and `id` attributes.
- Give controls clear accessible names. Use `aria-describedby` for help text and `role="alert"` for form validation errors.
- Preserve visible keyboard focus styles and keyboard-operable controls.
- Use semantic HTML elements and correct table header scopes.
- Do not communicate income, expenses, or budget status through color alone. Include text labels or values.
- Keep layouts responsive and prevent page-level horizontal overflow on narrow screens.
- Provide clear empty states for months without transactions or budgets.

## Validation and error handling

- Transaction and budget amounts must be positive values with no more than two decimal places.
- Convert amounts to integer minor units and reject values that are not safe integers.
- Show understandable validation feedback and do not save invalid records.
- Preserve existing behavior and storage compatibility when changing data structures. Explain and handle any required migration rather than silently discarding existing localStorage data.

## Quality checks

The package scripts currently include:
- `npm run lint`
- `npm run build`

Run the relevant checks after changing code. Do not claim a check passed unless it was actually run. There is no test script defined in the current `package.json`.
