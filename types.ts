
export type View = 'dashboard' | 'invoicing' | 'expenses' | 'reporting';

export enum InvoiceStatus {
  Paid = 'Paid',
  Pending = 'Pending',
  Overdue = 'Overdue',
}

export interface Invoice {
  id: string;
  patientName: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
  items: {
    service: string;
    cost: number;
  }[];
}

export enum ExpenseCategory {
  Salaries = 'Salaries',
  MedicalSupplies = 'Medical Supplies',
  Equipment = 'Equipment',
  Utilities = 'Utilities',
  Admin = 'Administrative',
  Marketing = 'Marketing',
}

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  accountsReceivable: number;
  accountsPayable: number;
}

export interface MonthlyData {
  month: string;
  revenue: number;
  expenses: number;
}

export interface ExpenseDistribution {
    category: ExpenseCategory;
    amount: number;
}

export interface FinancialData {
  summary: FinancialSummary;
  monthlyData: MonthlyData[];
  expenseDistribution: ExpenseDistribution[];
  invoices: Invoice[];
  expenses: Expense[];
}

export interface Message {
    sender: 'user' | 'ai';
    text: string;
}
