import { LayoutDashboard, Inbox, Users, TrendingUp, Calendar, Car, BarChart3, Zap, Settings } from 'lucide-react';
import clsx from 'clsx';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Today', icon: <LayoutDashboard size={20} />, href: '#today' },
  { label: 'Lead Inbox', icon: <Inbox size={20} />, href: '#inbox', badge: 0 },
  { label: 'Customers', icon: <Users size={20} />, href: '#customers' },
  { label: 'Pipeline', icon: <TrendingUp size={20} />, href: '#pipeline' },
  { label: 'Appointments', icon: <Calendar size={20} />, href: '#appointments' },
  { label: 'Inventory Match', icon: <Car size={20} />, href: '#inventory' },
  { label: 'Analytics', icon: <BarChart3 size={20} />, href: '#analytics' },
  { label: 'AI Command', icon: <Zap size={20} />, href: '#ai-command', badge: 2 },
  { label: 'Settings', icon: <Settings size={20} />, href: '#settings' },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col fixed left-0 top-0">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-heading font-bold text-navy-600 dark:text-navy-400">
          Super BDC
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Automotive CRM</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center justify-between px-4 py-3 rounded-lg transition-colors',
              'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
              'focus-visible:outline-2 focus-visible:outline-offset-2'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-slate-600 dark:text-slate-400">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </a>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-lavender-50 dark:bg-lavender-900/20">
          <div className="w-8 h-8 rounded-full bg-navy-600 text-white flex items-center justify-center text-xs font-bold">
            J
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">Jonathan</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">BDC Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
