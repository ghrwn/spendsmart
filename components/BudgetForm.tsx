"use client";

import { useState } from "react";
import { Budget } from "@/types/budget";

interface BudgetFormProps {
  month: string;
  existingBudget: Budget | null;
  onSaveBudget: (budget: Budget) => void;
  onCancelEdit: () => void;
  availableCategories?: string[];
}

const expenseCategories = [
  "Food",
  "Transportation",
  "Bills",
  "Shopping",
  "Entertainment",
  "Other Expenses",
];

export default function BudgetForm({
  month,
  existingBudget,
  onSaveBudget,
  onCancelEdit,
  availableCategories,
}: BudgetFormProps) {
  const categories = existingBudget
    ? [existingBudget.category]
    : (availableCategories ?? expenseCategories);

  const [category, setCategory] = useState(
    existingBudget?.category ?? "",
  );
  const [amount, setAmount] = useState(
    existingBudget
      ? (existingBudget.limitInMinorUnits / 100).toFixed(2)
      : "",
  );
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
      setError("Enter a valid amount with no more than two decimal places.");
      return;
    }

    const [wholePart, decimalPart = ""] = amount.split(".");
    const limitInMinorUnits =
      Number(wholePart) * 100 + Number(decimalPart.padEnd(2, "0"));

    if (
      !Number.isSafeInteger(limitInMinorUnits) ||
      limitInMinorUnits <= 0
    ) {
      setError("The budget amount must be greater than zero.");
      return;
    }

    onSaveBudget({
      id: existingBudget?.id ?? crypto.randomUUID(),
      category,
      month,
      limitInMinorUnits,
    });

    setError("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h3 className="mb-5 text-lg font-semibold text-slate-900">
        {existingBudget ? "Update Budget" : "Create Monthly Budget"}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="budget-category"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Expense Category
          </label>
          <select
            id="budget-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            disabled={Boolean(existingBudget)}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-100"
          >
            <option value="">Select a category</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="budget-amount"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Monthly Limit (PHP)
          </label>
          <input
            id="budget-amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-5 py-3 font-medium text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          {existingBudget ? "Save Changes" : "Create Budget"}
        </button>

        {existingBudget && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}