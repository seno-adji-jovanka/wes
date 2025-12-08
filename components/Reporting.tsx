
import React from 'react';
import { useMockData } from '../hooks/useMockData';
import { Download } from 'lucide-react';

const Reporting: React.FC = () => {
  const data = useMockData();

  if (!data) {
    return <div className="text-center p-10">Loading report data...</div>;
  }
  
  const { summary, invoices, expenses } = data;
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-slate-800">Financial Reports</h2>
            <button className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Download All
            </button>
        </div>
        
        {/* Income Statement */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2">Income Statement</h3>
            <div className="space-y-3 text-slate-600">
                <div className="flex justify-between items-center">
                    <p>Total Revenue</p>
                    <p className="font-medium text-emerald-600">{formatCurrency(summary.totalRevenue)}</p>
                </div>
                 <div className="flex justify-between items-center">
                    <p>Total Expenses</p>
                    <p className="font-medium text-red-600">({formatCurrency(summary.totalExpenses)})</p>
                </div>
                <div className="border-t pt-3 mt-3 flex justify-between items-center font-bold text-slate-800">
                    <p>Net Profit</p>
                    <p className={summary.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'}>{formatCurrency(summary.netProfit)}</p>
                </div>
            </div>
        </div>

        {/* Balance Sheet (Simplified) */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-slate-700 mb-4 border-b pb-2">Balance Sheet (Simplified)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="font-semibold text-slate-600 mb-2">Assets</h4>
                    <div className="space-y-3 text-slate-600">
                         <div className="flex justify-between items-center">
                            <p>Cash (Mock)</p>
                            <p className="font-medium text-slate-800">{formatCurrency(1250000)}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p>Accounts Receivable</p>
                            <p className="font-medium text-slate-800">{formatCurrency(summary.accountsReceivable)}</p>
                        </div>
                         <div className="border-t pt-3 mt-3 flex justify-between items-center font-bold text-slate-800">
                            <p>Total Assets</p>
                            <p>{formatCurrency(1250000 + summary.accountsReceivable)}</p>
                        </div>
                    </div>
                </div>
                 <div>
                    <h4 className="font-semibold text-slate-600 mb-2">Liabilities</h4>
                    <div className="space-y-3 text-slate-600">
                         <div className="flex justify-between items-center">
                            <p>Accounts Payable</p>
                            <p className="font-medium text-slate-800">{formatCurrency(summary.accountsPayable)}</p>
                        </div>
                         <div className="border-t pt-3 mt-3 flex justify-between items-center font-bold text-slate-800">
                            <p>Total Liabilities</p>
                            <p>{formatCurrency(summary.accountsPayable)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Reporting;
