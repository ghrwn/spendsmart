export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  description: string;
  amountInMinorUnits: number;
  type: TransactionType;
  category: string;
  date: string;
}