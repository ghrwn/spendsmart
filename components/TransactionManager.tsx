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

const SELECTED_MONTH = "2026-11";

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 2,
});

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

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const monthlyTransactions = useMemo(() => {
    return transactions.filter((transaction) =>
      transaction.date.startsWith(SELECTED_MONTH),
    );
  }, [transactions]);

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

  return (
    <div className="space-y-8">
      <section
        id="overview"
        aria-label="Financial summary"
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Income</p>
          <p className="mt-3 text-2xl font-bold text-emerald-700">
            {currencyFormatter.format(totals.income / 100)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Income recorded this month
          </p>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Expenses</p>
          <p className="mt-3 text-2xl font-bold text-rose-600">
            {currencyFormatter.format(totals.expenses / 100)}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Expenses recorded this month
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
            Income minus expenses for November
          </p>
        </article>
      </section>

      <BudgetManager month={SELECTED_MONTH} transactions={transactions} />

      <section id="transactions" className="space-y-6">
        <div>
          <h3 className="text-lg font-bold">Transaction Management</h3>
          <p className="mt-1 text-sm text-slate-500">
            Add and manage your income and expenses.
          </p>
        </div>

        <div id="transaction-form">
          <TransactionForm
            key={editingTransaction?.id ?? "new"}
            editingTransaction={editingTransaction}
            onSaveTransaction={handleSaveTransaction}
            onCancelEdit={() => setEditingTransaction(null)}
          />
        </div>

        <TransactionList
          transactions={transactions}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </section>
    </div>
  );
}