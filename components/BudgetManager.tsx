"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import BudgetForm from "@/components/BudgetForm";
import {
  addBudget,
  getBudgetsSnapshot,
  getServerBudgetsSnapshot,
  parseBudgetsSnapshot,
  subscribeToBudgets,
  updateBudget,
} from "@/lib/budgets";
import { Budget } from "@/types/budget";
import { Transaction } from "@/types/transaction";

interface BudgetManagerProps {
  month: string;
  transactions: Transaction[];
}

const expenseCategories = [
  "Food",
  "Transportation",
  "Bills",
  "Shopping",
  "Entertainment",
  "Other Expenses",
];

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 2,
});

export default function BudgetManager({
  month,
  transactions,
}: BudgetManagerProps) {
  const budgetSnapshot = useSyncExternalStore(
    subscribeToBudgets,
    getBudgetsSnapshot,
    getServerBudgetsSnapshot,
  );

  const budgets = useMemo(
    () => parseBudgetsSnapshot(budgetSnapshot),
    [budgetSnapshot],
  );

  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  const monthlyBudgets = useMemo(
    () => budgets.filter((budget) => budget.month === month),
    [budgets, month],
  );

  const availableCategories = expenseCategories.filter(
    (category) =>
      !monthlyBudgets.some((budget) => budget.category === category),
  );

  function handleSaveBudget(budget: Budget) {
    if (editingBudget) {
      updateBudget(budget);
      setEditingBudget(null);
      return;
    }

    addBudget(budget);
  }

  function getBudgetSpending(category: string) {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          transaction.category === category &&
          transaction.date.startsWith(month),
      )
      .reduce(
        (total, transaction) => total + transaction.amountInMinorUnits,
        0,
      );
  }

  return (
    <section id="budgets" className="space-y-6">
      <div>
        <h3 className="text-lg font-bold">Monthly Category Budgets</h3>
        <p className="mt-1 text-sm text-slate-500">
          Set spending limits and monitor your expenses by category.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {monthlyBudgets.map((budget) => {
          const spent = getBudgetSpending(budget.category);
          const remaining = budget.limitInMinorUnits - spent;
          const progress = Math.min(
            (spent / budget.limitInMinorUnits) * 100,
            100,
          );
          const isOverBudget = remaining < 0;

          return (
            <article
              key={budget.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {budget.category}
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Monthly spending limit
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingBudget(budget)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Edit
                </button>
              </div>

              <div className="mt-5 flex items-end justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-500">Spent</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {currencyFormatter.format(spent / 100)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-500">Budget limit</p>
                  <p className="mt-1 font-semibold text-slate-700">
                    {currencyFormatter.format(
                      budget.limitInMinorUnits / 100,
                    )}
                  </p>
                </div>
              </div>

              <div
                className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label={`${budget.category} budget usage`}
                aria-valuenow={Math.min(Math.round(progress), 100)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`h-full rounded-full transition-all ${
                    isOverBudget ? "bg-rose-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p
                className={`mt-3 text-sm font-medium ${
                  isOverBudget ? "text-rose-600" : "text-emerald-700"
                }`}
              >
                {isOverBudget
                  ? `Over budget by ${currencyFormatter.format(
                      Math.abs(remaining) / 100,
                    )}`
                  : `${currencyFormatter.format(
                      remaining / 100,
                    )} remaining`}
              </p>
            </article>
          );
        })}
      </div>

      {monthlyBudgets.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
          You have not created any budgets for this month yet.
        </p>
      )}

      {editingBudget ? (
        <BudgetForm
          key={editingBudget.id}
          month={month}
          existingBudget={editingBudget}
          onSaveBudget={handleSaveBudget}
          onCancelEdit={() => setEditingBudget(null)}
        />
      ) : availableCategories.length > 0 ? (
        <BudgetForm
          month={month}
          existingBudget={null}
          onSaveBudget={handleSaveBudget}
          onCancelEdit={() => setEditingBudget(null)}
          availableCategories={availableCategories}
        />
      ) : (
        <p className="text-sm text-slate-500">
          You have created budgets for all available expense categories.
        </p>
      )}
    </section>
  );
}