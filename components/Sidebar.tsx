
import React from 'react';
import type { View } from '../types';
import { LayoutDashboard, Receipt, ShoppingCart, BarChart3, Stethoscope } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoicing', label: 'Invoicing', icon: Receipt },
    { id: 'expenses', label: 'Expenses', icon: ShoppingCart },
    { id: 'reporting', label: 'Reporting', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-slate-200">
        <Stethoscope className="h-8 w-8 text-cyan-600" />
        <h1 className="ml-2 text-xl font-bold text-slate-800">Hospital ERP</h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView(item.id as View);
                }}
                className={`flex items-center px-4 py-3 my-1 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  currentView === item.id
                    ? 'bg-cyan-50 text-cyan-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-200">
          <div className="flex items-center">
              <img src="https://picsum.photos/id/237/200/200" alt="User" className="w-10 h-10 rounded-full" />
              <div className="ml-3">
                  <p className="text-sm font-semibold text-slate-700">Jane Doe</p>
                  <p className="text-xs text-slate-500">Accountant</p>
              </div>
          </div>
      </div>
    </aside>
  );
};

export default Sidebar;
