import { Transaction } from "@/types/transaction";

const STORAGE_KEY = "spendsmart-transactions";

const listeners = new Set<() => void>();

export function subscribeToTransactions(callback: () => void) {
  listeners.add(callback);

  function handleStorageChange(event: StorageEvent) {
    if (event.key === STORAGE_KEY || event.key === null) {
      callback();
    }
  }

  window.addEventListener("storage", handleStorageChange);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorageChange);
  };
}

export function getTransactionsSnapshot(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function getServerTransactionsSnapshot(): null {
  return null;
}

export function parseTransactionsSnapshot(
  snapshot: string | null,
): Transaction[] {
  if (!snapshot) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? (parsed as Transaction[]) : [];
  } catch {
    return [];
  }
}

export function getTransactions(): Transaction[] {
  if (typeof window === "undefined") {
    return [];
  }

  return parseTransactionsSnapshot(getTransactionsSnapshot());
}

export function saveTransactions(transactions: Transaction[]): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  listeners.forEach((callback) => callback());
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