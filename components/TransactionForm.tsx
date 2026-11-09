"use client";

import { useState, useSyncExternalStore } from "react";
import { Transaction, TransactionType } from "@/types/transaction";

interface TransactionFormProps {
  editingTransaction: Transaction | null;
  onSaveTransaction: (transaction: Transaction) => void;
  onCancelEdit: () => void;
}

function getLocalDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function subscribeToDateChanges() {
  return () => {};
}

export default function TransactionForm({
  editingTransaction,
  onSaveTransaction,
  onCancelEdit,
}: TransactionFormProps) {
  const today = useSyncExternalStore(
    subscribeToDateChanges,
    getLocalDate,
    () => "",
  );

  const [description, setDescription] = useState(
    editingTransaction?.description ?? "",
  );
  const [amount, setAmount] = useState(
    editingTransaction
      ? (editingTransaction.amountInMinorUnits / 100).toFixed(2)
      : "",
  );
  const [type, setType] = useState<TransactionType>(
    editingTransaction?.type ?? "expense",
  );
  const [category, setCategory] = useState(
    editingTransaction?.category ?? "",
  );
  const [date, setDate] = useState(editingTransaction?.date ?? "");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
      setError(
        "Please enter a valid amount with no more than two decimal places.",
      );
      return;
    }

    const [wholePart, decimalPart = ""] = amount.split(".");
    const amountInMinorUnits =
      Number(wholePart) * 100 + Number(decimalPart.padEnd(2, "0"));

    if (
      !Number.isSafeInteger(amountInMinorUnits) ||
      amountInMinorUnits <= 0
    ) {
      setError("Please enter an amount greater than zero.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    const transactionDate = date || today;

    if (!transactionDate) {
      setError("Please select a transaction date.");
      return;
    }

    const transaction: Transaction = {
      id: editingTransaction?.id ?? crypto.randomUUID(),
      description: description.trim(),
      amountInMinorUnits,
      type,
      category,
      date: transactionDate,
    };

    onSaveTransaction(transaction);
    setError("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="mb-5 text-lg font-semibold text-gray-900">
        {editingTransaction ? "Edit Transaction" : "Add Transaction"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="description"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Description (Optional)
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="e.g. Monthly salary"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Amount (PHP)
          </label>
          <input
            id="amount"
            type="text"
            inputMode="decimal"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Transaction Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(event) => {
              setType(event.target.value as TransactionType);
              setCategory("");
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select a category</option>
            {type === "income" ? (
              <>
                <option value="Salary">Salary</option>
                <option value="Business">Business</option>
                <option value="Other Income">Other Income</option>
              </>
            ) : (
              <>
                <option value="Food">Food</option>
                <option value="Transportation">Transportation</option>
                <option value="Bills">Bills</option>
                <option value="Shopping">Shopping</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Other Expenses">Other Expenses</option>
              </>
            )}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="date"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date || today}
            onChange={(event) => setDate(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
          className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {editingTransaction ? "Save Changes" : "Save Transaction"}
        </button>

        {editingTransaction && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}