import React from "react";
export default function Table() {
  return (
    <div className="w-full px-4 py-10">
      <div className="relative w-full overflow-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
        <table className="w-full caption-bottom text-sm">
          {/* Header */}
          <thead className="bg-zinc-50/50 dark:bg-zinc-900/50 [&_tr]:border-b">
            <tr className="border-b border-zinc-200 dark:border-zinc-800 transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-zinc-500 dark:text-zinc-400">
                Customer
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-zinc-500 dark:text-zinc-400">
                Status
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-zinc-500 dark:text-zinc-400">
                Email
              </th>
              <th className="h-12 px-4 text-right align-middle font-medium text-zinc-500 dark:text-zinc-400">
                Plan
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="[&_tr:last-child]:border-0">
            <tr className="border-b border-zinc-200 dark:border-zinc-800 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
              <td className="p-4 align-middle font-medium">Alex Rivera</td>
              <td className="p-4 align-middle">
                <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  Active
                </div>
              </td>
              <td className="p-4 align-middle text-zinc-600 dark:text-zinc-400">
                alex@example.com
              </td>
              <td className="p-4 align-middle text-right text-zinc-600 dark:text-zinc-400">
                Pro
              </td>
            </tr>

            <tr className="border-b border-zinc-200 dark:border-zinc-800 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
              <td className="p-4 align-middle font-medium">Neil Sims</td>
              <td className="p-4 align-middle">
                <div className="inline-flex items-center rounded-full border border-zinc-500/20 bg-zinc-500/10 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Offline
                </div>
              </td>
              <td className="p-4 align-middle text-zinc-600 dark:text-zinc-400">
                neil.sims@example.com
              </td>
              <td className="p-4 align-middle text-right text-zinc-600 dark:text-zinc-400">
                Enterprise
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
