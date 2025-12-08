
import React, { useState, useMemo } from 'react';
import { useMockData } from '../hooks/useMockData';
import { Invoice, InvoiceStatus } from '../types';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const Invoicing: React.FC = () => {
  const data = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Invoice; direction: 'ascending' | 'descending' } | null>({ key: 'date', direction: 'descending' });
  
  const sortedInvoices = useMemo(() => {
    if (!data?.invoices) return [];
    let sortableItems = [...data.invoices];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems.filter(invoice => 
        invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.invoices, searchTerm, sortConfig]);

  const requestSort = (key: keyof Invoice) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Invoice) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />;
  };

  const statusColorMap: { [key in InvoiceStatus]: string } = {
    [InvoiceStatus.Paid]: 'bg-emerald-100 text-emerald-800',
    [InvoiceStatus.Pending]: 'bg-amber-100 text-amber-800',
    [InvoiceStatus.Overdue]: 'bg-red-100 text-red-800',
  };

  if (!data) return <div className="text-center p-10">Loading invoices...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Invoices</h2>
        <div className="w-full sm:w-auto flex items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by patient or ID..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
            New Invoice
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-500">
          <thead className="text-xs text-slate-700 uppercase bg-slate-50">
            <tr>
              {['id', 'patientName', 'date', 'amount', 'status'].map((key) => (
                <th key={key} scope="col" className="px-6 py-3 cursor-pointer" onClick={() => requestSort(key as keyof Invoice)}>
                  <div className="flex items-center">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    {getSortIcon(key as keyof Invoice)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedInvoices.map((invoice) => (
              <tr key={invoice.id} className="bg-white border-b hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-900">{invoice.id}</td>
                <td className="px-6 py-4">{invoice.patientName}</td>
                <td className="px-6 py-4">{invoice.date}</td>
                <td className="px-6 py-4">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(invoice.amount)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[invoice.status]}`}>
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoicing;
