
import { useState, useEffect } from 'react';
import type { FinancialData, Invoice, Expense, MonthlyData, FinancialSummary, ExpenseDistribution } from '../types';
import { InvoiceStatus, ExpenseCategory } from '../types';

const generateRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const generateMockInvoices = (count: number): Invoice[] => {
  const invoices: Invoice[] = [];
  const patientNames = ['John Smith', 'Emily Johnson', 'Michael Williams', 'Sarah Brown', 'David Jones', 'Jessica Garcia', 'Chris Miller', 'Linda Davis'];
  const services = [
    { service: 'Consultation', cost: 150 },
    { service: 'X-Ray', cost: 300 },
    { service: 'Blood Test', cost: 120 },
    { service: 'MRI Scan', cost: 1200 },
    { service: 'Surgery', cost: 5000 },
    { service: 'Physical Therapy', cost: 250 },
  ];

  for (let i = 0; i < count; i++) {
    const numItems = Math.floor(Math.random() * 3) + 1;
    const invoiceItems = Array.from({ length: numItems }, () => services[Math.floor(Math.random() * services.length)]);
    const totalAmount = invoiceItems.reduce((sum, item) => sum + item.cost, 0);
    const statusValues = Object.values(InvoiceStatus);

    invoices.push({
      id: `INV-${1001 + i}`,
      patientName: patientNames[Math.floor(Math.random() * patientNames.length)],
      date: formatDate(generateRandomDate(new Date(2023, 0, 1), new Date())),
      amount: totalAmount,
      status: statusValues[Math.floor(Math.random() * statusValues.length)],
      items: invoiceItems,
    });
  }
  return invoices;
};

const generateMockExpenses = (count: number): Expense[] => {
  const expenses: Expense[] = [];
  const descriptions = ['Office supplies', 'New surgical tools', 'Electricity bill', 'Janitorial services', 'Digital marketing campaign', 'Monthly payroll'];
  const categoryValues = Object.values(ExpenseCategory);

  for (let i = 0; i < count; i++) {
    expenses.push({
      id: `EXP-${2001 + i}`,
      date: formatDate(generateRandomDate(new Date(2023, 0, 1), new Date())),
      category: categoryValues[Math.floor(Math.random() * categoryValues.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      amount: Math.floor(Math.random() * 5000) + 50,
    });
  }
  return expenses;
};

export const useMockData = (): FinancialData | null => {
  const [data, setData] = useState<FinancialData | null>(null);

  useEffect(() => {
    const invoices = generateMockInvoices(50);
    const expenses = generateMockExpenses(100);

    const totalRevenue = invoices.filter(inv => inv.status === InvoiceStatus.Paid).reduce((sum, inv) => sum + inv.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const accountsReceivable = invoices.filter(inv => inv.status === InvoiceStatus.Pending || inv.status === InvoiceStatus.Overdue).reduce((sum, inv) => sum + inv.amount, 0);

    const summary: FinancialSummary = {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      accountsReceivable,
      accountsPayable: totalExpenses * 0.15, // Mocked as 15% of total expenses
    };

    const monthlyData: MonthlyData[] = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const month = d.toLocaleString('default', { month: 'short' });
        const revenue = Math.floor(Math.random() * 50000) + 20000;
        const expenses = Math.floor(Math.random() * 30000) + 10000;
        return { month, revenue, expenses };
    });
    
    const expenseDistribution: ExpenseDistribution[] = Object.values(ExpenseCategory).map(cat => ({
        category: cat,
        amount: expenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0),
    })).filter(d => d.amount > 0);

    setData({ summary, monthlyData, expenseDistribution, invoices, expenses });
  }, []);

  return data;
};
