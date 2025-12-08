
import React, { useState, useMemo } from 'react';
import { useMockData } from '../hooks/useMockData';
import type { Expense } from '../types';
import { ExpenseCategory } from '../types';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const Expenses: React.FC = () => {
  const data = useMockData();
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'all'>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Expense; direction: 'ascending' | 'descending' } | null>({ key: 'date', direction: 'descending' });
  
  const filteredAndSortedExpenses = useMemo(() => {
    if (!data?.expenses) return [];
    let filteredItems = data.expenses;
    if (filterCategory !== 'all') {
      filteredItems = filteredItems.filter(exp => exp.category === filterCategory);
    }
    
    if (sortConfig !== null) {
      filteredItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredItems;
  }, [data?.expenses, filterCategory, sortConfig]);

  const requestSort = (key: keyof Expense) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (key: keyof Expense) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />;
  };

  if (!data) return <div className="text-center p-10">Loading expenses...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Expenses</h2>
        <div className="w-full sm:w-auto flex items-center gap-4">
          <select
            className="w-full sm:w-48 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as ExpenseCategory | 'all')}
          >
            <option value="all">All Categories</option>
            {Object.values(ExpenseCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
            New Expense
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              {['date', 'category', 'description', 'amount'].map((key) => (
                <th key={key} scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort(key as keyof Expense)}>
                   <div className="flex items-center">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    {getSortIcon(key as keyof Expense)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedExpenses.map((expense) => (
              <tr key={expense.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4">{expense.date}</td>
                <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600">
                        {expense.category}
                    </span>
                </td>
                <td className="px-6 py-4 font-medium text-slate-800">{expense.description}</td>
                <td className="px-6 py-4 text-red-600 font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(expense.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;
