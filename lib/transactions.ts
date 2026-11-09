import { Transaction } from "@/types/transaction";

const STORAGE_KEY = "spendsmart-transactions";

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedTransactions = localStorage.getItem(STORAGE_KEY);

    return storedTransactions ? JSON.parse(storedTransactions) : [];
  } catch {
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function addTransaction(transaction: Transaction): void {
  const transactions = getTransactions();

  saveTransactions([...transactions, transaction]);
}

export function updateTransaction(updatedTransaction: Transaction): void {
  const transactions = getTransactions();

  const updatedTransactions = transactions.map((transaction) =>
    transaction.id === updatedTransaction.id ? updatedTransaction : transaction,
  );

  saveTransactions(updatedTransactions);
}

export function deleteTransaction(id: string): void {
  const transactions = getTransactions();

  const updatedTransactions = transactions.filter(
    (transaction) => transaction.id !== id,
  );

  saveTransactions(updatedTransactions);
}