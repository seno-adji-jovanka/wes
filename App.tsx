
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Invoicing from './components/Invoicing';
import Expenses from './components/Expenses';
import Reporting from './components/Reporting';
import FinancialAssistant from './components/FinancialAssistant';
import type { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'invoicing':
        return <Invoicing />;
      case 'expenses':
        return <Expenses />;
      case 'reporting':
        return <Reporting />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {renderView()}
        </div>
      </main>
      <FinancialAssistant />
    </div>
  );
};

export default App;
