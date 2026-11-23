"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import BudgetManager from "@/components/BudgetManager";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import {
  addTransaction,
  deleteTransaction,
  getServerTransactionsSnapshot,
  getTransactionsSnapshot,
  parseTransactionsSnapshot,
  subscribeToTransactions,
  updateTransaction,
} from "@/lib/transactions";
import { Transaction } from "@/types/transaction";

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 2,
});

function subscribeToDateChanges() {
  return () => {};
}

function getCurrentDateSnapshot(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${now.getFullYear()}-${month}-${day}`;
}

function getServerDateSnapshot(): string {
  return "";
}

function formatMonthLabel(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);

  return new Intl.DateTimeFormat("en-PH", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, monthNumber - 1, 1));
}

export default function TransactionManager() {
  const transactionSnapshot = useSyncExternalStore(
    subscribeToTransactions,
    getTransactionsSnapshot,
    getServerTransactionsSnapshot,
  );

  const transactions = useMemo(
    () => parseTransactionsSnapshot(transactionSnapshot),
    [transactionSnapshot],
  );

  const currentDate = useSyncExternalStore(
    subscribeToDateChanges,
    getCurrentDateSnapshot,
    getServerDateSnapshot,
  );
  const [selectedMonth, setSelectedMonth] = useState("");
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const activeMonth = selectedMonth || currentDate.slice(0, 7);
  const monthLabel = activeMonth
    ? formatMonthLabel(activeMonth)
    : "Select a month";
  const defaultTransactionDate = activeMonth
    ? activeMonth === currentDate.slice(0, 7)
      ? currentDate
      : `${activeMonth}-01`
    : "";

  const monthlyTransactions = useMemo(() => {
    if (!activeMonth) {
      return [];
    }

    return transactions.filter((transaction) =>
      transaction.date.startsWith(activeMonth),
    );
  }, [transactions, activeMonth]);

  const totals = useMemo(() => {
    return monthlyTransactions.reduce(
      (summary, transaction) => {
        if (transaction.type === "income") {
          summary.income += transaction.amountInMinorUnits;
        } else {
          summary.expenses += transaction.amountInMinorUnits;
        }

        return summary;
      },
      { income: 0, expenses: 0 },
    );
  }, [monthlyTransactions]);

  function handleSaveTransaction(transaction: Transaction) {
    if (editingTransaction) {
      updateTransaction(transaction);
      setEditingTransaction(null);
      return;
    }

    addTransaction(transaction);
  }

  function handleEditTransaction(transaction: Transaction) {
    setEditingTransaction(transaction);
    document
      .getElementById("transaction-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleDeleteTransaction(id: string) {
    deleteTransaction(id);

    if (editingTransaction?.id === id) {
      setEditingTransaction(null);
    }
  }

  function handleMonthChange(month: string) {
    setSelectedMonth(month);
    setEditingTransaction(null);
  }

  return (
    <div className="space-y-8">
      <section
        aria-label="Dashboard month selection"
        className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <label
            htmlFor="dashboard-month"
            className="block text-sm font-semibold text-slate-900"
          >
            Select dashboard month
          </label>
          <p
            id="dashboard-month-help"
            className="mt-1 text-sm text-slate-500"
          >
            Choose a month to view its transactions and budget progress.
          </p>
        </div>
        <input
          id="dashboard-month"
          type="month"
          value={activeMonth}
          required
          onChange={(event) => {
            const month = event.target.value;
            if (/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
              handleMonthChange(month);
            }
          }}
          aria-describedby="dashboard-month-help"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:w-auto"
        />
      </section>

      <section
        id="overview"
        aria-label={`Financial summary for ${monthLabel}`}
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Income</p>
          <p className="mt-3 text-2xl font-bold text-emerald-700">
            {currencyFormatter.format(totals.income / 100)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Income recorded in {monthLabel}
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Expenses</p>
          <p className="mt-3 text-2xl font-bold text-rose-600">
            {currencyFormatter.format(totals.expenses / 100)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Expenses recorded in {monthLabel}
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:col-span-2 xl:col-span-1">
          <p className="text-sm font-medium text-slate-500">
            Monthly Net Balance
          </p>
          <p className="mt-3 text-2xl font-bold text-slate-900">
            {currencyFormatter.format(
              (totals.income - totals.expenses) / 100,
            )}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Income minus expenses for {monthLabel}
          </p>
        </article>
      </section>

      <BudgetManager month={activeMonth} transactions={transactions} />

      <section id="transactions" className="space-y-6">
        <div>
          <h3 className="text-lg font-bold">Transaction Management</h3>
          <p className="mt-1 text-sm text-slate-500">
            Add and manage your income and expenses.
          </p>
        </div>

        <div id="transaction-form">
          <TransactionForm
            key={`${editingTransaction?.id ?? "new"}-${selectedMonth}`}
            defaultDate={defaultTransactionDate}
            editingTransaction={editingTransaction}
            onSaveTransaction={handleSaveTransaction}
            onCancelEdit={() => setEditingTransaction(null)}
          />
        </div>

        <TransactionList
          transactions={monthlyTransactions}
          monthLabel={monthLabel}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </section>
    </div>
  );
}
