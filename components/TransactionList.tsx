import { Transaction } from "@/types/transaction";

interface TransactionListProps {
  transactions: Transaction[];
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

export default function TransactionList({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Transactions
        </h2>
        <p className="mt-4 text-sm text-gray-500">
          No transactions yet. Add your first income or expense to get started.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold text-gray-900">
        Recent Transactions
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-gray-200 text-gray-500">
            <tr>
              <th scope="col" className="px-3 py-3 font-medium">
                Description
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                Category
              </th>
              <th scope="col" className="px-3 py-3 font-medium">
                Date
              </th>
              <th scope="col" className="px-3 py-3 text-right font-medium">
                Amount
              </th>
              <th scope="col" className="px-3 py-3 text-right font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-3 py-4 font-medium text-gray-900">
                  {transaction.description || "No description"}
                  <span
                    className={`ml-2 inline-block rounded-full px-2 py-1 text-xs ${
                      transaction.type === "income"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {transaction.type === "income" ? "Income" : "Expense"}
                  </span>
                </td>

                <td className="px-3 py-4 text-gray-600">
                  {transaction.category}
                </td>

                <td className="px-3 py-4 text-gray-600">
                  {transaction.date}
                </td>

                <td
                  className={`px-3 py-4 text-right font-semibold ${
                    transaction.type === "income"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {currencyFormatter.format(
                    transaction.amountInMinorUnits / 100,
                  )}
                </td>

                <td className="space-x-2 whitespace-nowrap px-3 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onEditTransaction(transaction)}
                    aria-label={`Edit ${transaction.description || "transaction"}`}
                    className="rounded-md px-2 py-1 font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this transaction?",
                        )
                      ) {
                        onDeleteTransaction(transaction.id);
                      }
                    }}
                    aria-label={`Delete ${transaction.description || "transaction"}`}
                    className="rounded-md px-2 py-1 font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}