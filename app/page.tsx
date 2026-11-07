const transactions = [
  {
    name: "Monthly Salary",
    category: "Income",
    date: "Nov 05, 2026",
    amount: 35000,
    type: "income",
  },
  {
    name: "Groceries",
    category: "Food",
    date: "Nov 04, 2026",
    amount: 2500,
    type: "expense",
  },
  {
    name: "Electricity Bill",
    category: "Bills",
    date: "Nov 03, 2026",
    amount: 1800,
    type: "expense",
  },
  {
    name: "Transportation",
    category: "Transport",
    date: "Nov 02, 2026",
    amount: 800,
    type: "expense",
  },
];

const budgets = [
  { category: "Food", spent: 3500, limit: 6000 },
  { category: "Transportation", spent: 1800, limit: 3000 },
  { category: "Bills", spent: 2800, limit: 5000 },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 2,
  }).format(amount);
}

export default function Home() {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white p-6 md:block">
          <h1 className="text-2xl font-bold text-emerald-700">SpendSmart</h1>
          <p className="mt-1 text-sm text-slate-500">
            Personal Finance Tracker
          </p>

          <nav className="mt-10 space-y-2">
            <a
              href="#overview"
              className="block rounded-lg bg-emerald-50 px-4 py-3 font-medium text-emerald-700"
            >
              Overview
            </a>
            <a
              href="#transactions"
              className="block rounded-lg px-4 py-3 text-slate-600 hover:bg-slate-100"
            >
              Transactions
            </a>
            <a
              href="#budgets"
              className="block rounded-lg px-4 py-3 text-slate-600 hover:bg-slate-100"
            >
              Budgets
            </a>
          </nav>

          <div className="mt-12 rounded-xl bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-800">
              Manage your money better.
            </p>
            <p className="mt-2 text-xs leading-5 text-emerald-700">
              Keep track of your income, expenses, and monthly spending.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <section className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-8">
          {/* Header */}
          <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">November 2026</p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">
                Financial Overview
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Welcome back! Here is your financial summary.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium">
              November 2026
            </div>
          </header>

          {/* Summary Cards */}
          <section
            id="overview"
            aria-label="Financial summary"
            className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Total Income</p>
              <p className="mt-3 text-2xl font-bold text-emerald-700">
                {formatCurrency(totalIncome)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Income recorded this month
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Total Expenses
              </p>
              <p className="mt-3 text-2xl font-bold text-rose-600">
                {formatCurrency(totalExpenses)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Expenses recorded this month
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:col-span-2 xl:col-span-1">
              <p className="text-sm font-medium text-slate-500">
                Remaining Balance
              </p>
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {formatCurrency(balance)}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Income minus expenses
              </p>
            </div>
          </section>

          {/* Budgets */}
          <section id="budgets" className="mt-8">
            <div className="mb-4">
              <h3 className="text-lg font-bold">Monthly Budgets</h3>
              <p className="mt-1 text-sm text-slate-500">
                Monitor your spending against your planned limits.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {budgets.map((budget) => {
                const percentage = Math.min(
                  (budget.spent / budget.limit) * 100,
                  100
                );

                return (
                  <div
                    key={budget.category}
                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold">{budget.category}</h4>
                      <span className="text-xs text-slate-500">
                        {Math.round(percentage)}% used
                      </span>
                    </div>

                    <div
                      className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"
                      role="progressbar"
                      aria-label={`${budget.category} budget used`}
                      aria-valuenow={Math.round(percentage)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="h-full rounded-full bg-emerald-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="mt-3 flex justify-between gap-2 text-sm">
                      <span className="font-medium">
                        {formatCurrency(budget.spent)}
                      </span>
                      <span className="text-slate-500">
                        of {formatCurrency(budget.limit)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recent Transactions */}
          <section id="transactions" className="mt-8">
            <div className="mb-4">
              <h3 className="text-lg font-bold">Recent Transactions</h3>
              <p className="mt-1 text-sm text-slate-500">
                A summary of your latest financial activity.
              </p>
            </div>

            <div className="w-full max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Description</th>
                    <th className="px-6 py-4 font-medium">Category</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 text-right font-medium">Amount</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {transactions.map((transaction, index) => (
                    <tr key={`${transaction.name}-${index}`}>
                      <td className="px-6 py-4 font-medium">
                        {transaction.name}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {transaction.category}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {transaction.date}
                      </td>
                      <td
                        className={`px-6 py-4 text-right font-semibold ${
                          transaction.type === "income"
                            ? "text-emerald-700"
                            : "text-rose-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <footer className="mt-10 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
            SpendSmart © 2026. Manage your money with confidence.
          </footer>
        </section>
      </div>
    </main>
  );
}
