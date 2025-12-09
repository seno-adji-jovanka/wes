
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { FinancialData, Invoice, Expense, InvoiceStatus, ExpenseCategory, FinancialSummary, MonthlyData, ExpenseDistribution } from '../types';

interface FinancialContextType {
  data: FinancialData | null;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  isLoading: boolean;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

// Helper functions for initial data generation
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

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    setInvoices(generateMockInvoices(50));
    setExpenses(generateMockExpenses(100));
    setIsLoading(false);
  }, []);

  const addInvoice = (newInvoiceData: Omit<Invoice, 'id'>) => {
    const newId = `INV-${1001 + invoices.length + Math.floor(Math.random() * 1000)}`;
    const invoice: Invoice = { ...newInvoiceData, id: newId };
    setInvoices(prev => [invoice, ...prev]);
  };

  const addExpense = (newExpenseData: Omit<Expense, 'id'>) => {
    const newId = `EXP-${2001 + expenses.length + Math.floor(Math.random() * 1000)}`;
    const expense: Expense = { ...newExpenseData, id: newId };
    setExpenses(prev => [expense, ...prev]);
  };

  // Derive summary and chart data from current state
  const data: FinancialData | null = useMemo(() => {
    if (isLoading) return null;

    const totalRevenue = invoices.filter(inv => inv.status === InvoiceStatus.Paid).reduce((sum, inv) => sum + inv.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const accountsReceivable = invoices.filter(inv => inv.status === InvoiceStatus.Pending || inv.status === InvoiceStatus.Overdue).reduce((sum, inv) => sum + inv.amount, 0);

    const summary: FinancialSummary = {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      accountsReceivable,
      accountsPayable: totalExpenses * 0.15, 
    };

    // Calculate monthly data (simplified for this context)
    const monthlyData: MonthlyData[] = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const monthStr = d.toLocaleString('default', { month: 'short' });
        // In a real app, we would aggregate invoices/expenses by date here. 
        // For keeping the "mock" feel consistent but reactive, we'll estimate based on totals or keep the static generation for the chart 
        // to avoid empty charts if generated dates don't align perfectly. 
        // For this update, let's keep the chart data somewhat static but influenced by totals to show reactivity.
        return { 
            month: monthStr, 
            revenue: (totalRevenue / 12) * (0.8 + Math.random() * 0.4), // approximate distribution
            expenses: (totalExpenses / 12) * (0.8 + Math.random() * 0.4)
        };
    });
    
    const expenseDistribution: ExpenseDistribution[] = Object.values(ExpenseCategory).map(cat => ({
        category: cat,
        amount: expenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0),
    })).filter(d => d.amount > 0);

    return { summary, monthlyData, expenseDistribution, invoices, expenses };
  }, [invoices, expenses, isLoading]);

  return (
    <FinancialContext.Provider value={{ data, addInvoice, addExpense, isLoading }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancialData = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancialData must be used within a FinancialProvider');
  }
  return context;
};
