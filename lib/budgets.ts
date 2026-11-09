import { Budget } from "@/types/budget";

const STORAGE_KEY = "spendsmart-budgets";

const listeners = new Set<() => void>();

export function subscribeToBudgets(callback: () => void) {
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

export function getBudgetsSnapshot(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function getServerBudgetsSnapshot(): null {
  return null;
}

export function parseBudgetsSnapshot(snapshot: string | null): Budget[] {
  if (!snapshot) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed) ? (parsed as Budget[]) : [];
  } catch {
    return [];
  }
}

export function getBudgets(): Budget[] {
  if (typeof window === "undefined") {
    return [];
  }

  return parseBudgetsSnapshot(getBudgetsSnapshot());
}

export function saveBudgets(budgets: Budget[]): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
  listeners.forEach((callback) => callback());
}

export function addBudget(budget: Budget): void {
  const budgets = getBudgets();

  saveBudgets([...budgets, budget]);
}

export function updateBudget(updatedBudget: Budget): void {
  const budgets = getBudgets();

  const updatedBudgets = budgets.map((budget) =>
    budget.id === updatedBudget.id ? updatedBudget : budget,
  );

  saveBudgets(updatedBudgets);
}