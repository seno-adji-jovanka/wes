
import React from 'react';
import { useMockData } from '../hooks/useMockData';
import { DollarSign, TrendingUp, TrendingDown, Users, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string }> = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm flex items-center">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="ml-4">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <p className="text-2xl font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const data = useMockData();

  if (!data) {
    return <div className="text-center p-10">Loading financial data...</div>;
  }
  
  const { summary, monthlyData, expenseDistribution } = data;

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const PIE_COLORS = ['#06b6d4', '#14b8a6', '#84cc16', '#f97316', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-slate-800">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={formatCurrency(summary.totalRevenue)} icon={DollarSign} color="bg-emerald-500" />
        <StatCard title="Total Expenses" value={formatCurrency(summary.totalExpenses)} icon={TrendingDown} color="bg-red-500" />
        <StatCard title="Net Profit" value={formatCurrency(summary.netProfit)} icon={TrendingUp} color="bg-sky-500" />
        <StatCard title="A/R" value={formatCurrency(summary.accountsReceivable)} icon={FileText} color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Revenue vs Expenses (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
              <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} tick={{ fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false}/>
              <Tooltip
                cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}
              />
              <Legend iconType="circle" iconSize={10} verticalAlign="top" align="right" />
              <Bar dataKey="revenue" fill="#06b6d4" name="Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#f43f5e" name="Expenses" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Expense Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
                nameKey="category"
              >
                {expenseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))}/>
              <Legend iconType="circle" iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
